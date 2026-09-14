import type { AnomalyAlert, BriefingReport, SpreadMetric, StationCurrentState } from '../types/weather';
import { formatIsoToKstString } from './kst.ts';

/**
 * 멀티 LLM 연계 구조화 브리핑 생성기 (T05-TEST-09)
 *
 * - 여러 LLM(Claude, Gemini, GPT 등)이 후속 작업이나 분석 프롬프트의 컨텍스트로 바로 활용할 수 있는
 *   고품질 Markdown 브리핑과 표준 JSON 스키마 페이로드를 동시 생성합니다.
 */
export function generateLlmBriefing(
  stations: StationCurrentState[],
  spread: SpreadMetric,
  anomalies: AnomalyAlert[],
  generatedAtIso?: string,
): BriefingReport {
  const nowIso = generatedAtIso || new Date().toISOString();
  const kstFormatted = formatIsoToKstString(nowIso);

  const activeAnomalies = anomalies.filter((a) => a.isAnomaly);
  const anomalyCount = activeAnomalies.length;

  // 헤드라인 작성
  let headline = `[KST ${kstFormatted}] 전국 3대 권역 기상 브리핑 — 전국 편차 ${spread.spread.toFixed(1)}°C, 안정`;
  if (anomalyCount > 0) {
    const names = activeAnomalies.map((a) => a.stationName).join(', ');
    headline = `🚨 [KST ${kstFormatted}] 전국 3대 권역 기상 브리핑 (이상 기후 경보) — ${names} 급변 감지 (전국 편차 ${spread.spread.toFixed(1)}°C)`;
  }

  // 요약 텍스트 작성
  const summaryText = `현재 전국 최고 기온 관측소는 ${spread.maxStation}(${spread.maxTemp.toFixed(1)}°C), 최저 기온 관측소는 ${spread.minStation}(${spread.minTemp.toFixed(1)}°C)으로 남북 기온 편차는 ${spread.spread.toFixed(1)}°C입니다. ${
    anomalyCount > 0
      ? `어제 대비 급격한 기온 변화가 감지된 권역은 ${anomalyCount}곳으로 정밀 모니터링이 필요합니다.`
      : `모든 권역의 기온이 어제 대비 정상 범위(±3.0°C 이내)에서 유지되고 있습니다.`
  }`;

  // 마크다운 작성
  const stationRows = stations
    .map((s) => {
      const readingVal = s.reading?.normalized_value ?? s.reading?.value;
      const prevVal = s.previousDayReading?.normalized_value ?? s.previousDayReading?.value;
      const tempStr = readingVal !== undefined ? `${readingVal.toFixed(1)}°C` : 'N/A';
      const prevStr = prevVal !== undefined ? `${prevVal.toFixed(1)}°C` : '-';
      const deltaStr = s.delta !== null ? (s.delta > 0 ? `+${s.delta.toFixed(1)}°C` : `${s.delta.toFixed(1)}°C`) : '-';
      const anomaly = anomalies.find((a) => a.stationId === s.station.id);
      const alertBadge = anomaly?.isAnomaly
        ? anomaly.anomalyType === 'temperature_drop'
          ? '🔻 급락 경보'
          : '🔺 급등 경보'
        : '정상';
      return `| **${s.station.name}** (${s.station.region}) | ${tempStr} | ${prevStr} | ${deltaStr} | ${s.status.freshness.toUpperCase()} | ${alertBadge} |`;
    })
    .join('\n');

  const anomalySection =
    activeAnomalies.length > 0
      ? activeAnomalies.map((a) => `- **${a.stationName}**: ${a.message}`).join('\n')
      : '- 현재 특이 이상 기온 감지 권역이 없습니다. (전국 평년 수준 유지)';

  const markdownContent = `### 🌤️ ${headline}

**생성 시각**: \`${kstFormatted}\` (Asia/Seoul)
**수집 원천**: Open-Meteo 공개 실시간 기상 관측망 (비개인 공개 데이터)

#### 1. 전국 3대 권역 관측 요약
| 관측소 (권역) | 현재 기온 | 어제 기온 | 전일 대비 변화(ΔT) | 상태 | 이상 유무 |
| :--- | :---: | :---: | :---: | :---: | :---: |
${stationRows}

#### 2. 지역별 남북 기온 편차(Spread)
- **전국 최고 기온**: **${spread.maxStation}** (${spread.maxTemp.toFixed(1)}°C)
- **전국 최저 기온**: **${spread.minStation}** (${spread.minTemp.toFixed(1)}°C)
- **남북 열적 편차(Spread)**: **${spread.spread.toFixed(1)}°C**

#### 3. 이상 기온 감지(Anomaly Alerts)
${anomalySection}

#### 4. 후속 LLM 작업 제안 프롬프트
> 위 데이터를 바탕으로 각 지역별 에너지 소비량 예측, 농작물 냉해/열해 방지 가이드라인, 혹은 외출 권장 복장 분석 리포트를 생성할 수 있습니다.
`;

  // JSON Schema 페이로드 생성
  const jsonSchemaPayload = {
    report_id: `briefing-${nowIso.replace(/[:.]/g, '-')}`,
    timestamp: nowIso,
    timezone: 'Asia/Seoul',
    spread: {
      max_station: spread.maxStation,
      max_value: spread.maxTemp,
      min_station: spread.minStation,
      min_value: spread.minTemp,
      spread_value: spread.spread,
      unit: spread.unit,
    },
    stations: stations.map((s) => {
      const anom = anomalies.find((a) => a.stationId === s.station.id);
      return {
        station_id: s.station.id,
        station_name: s.station.name,
        current_temp: s.reading ? (s.reading.normalized_value ?? s.reading.value ?? 0) : 0,
        yesterday_temp: s.previousDayReading
          ? (s.previousDayReading.normalized_value ?? s.previousDayReading.value ?? null)
          : null,
        delta: s.delta,
        is_anomaly: anom?.isAnomaly ?? false,
        status: s.status.freshness,
      };
    }),
    anomalies: activeAnomalies.map((a) => ({
      station: a.stationName,
      type: a.anomalyType,
      delta: a.delta,
      alert: a.message,
    })),
  };

  return {
    generatedAt: nowIso,
    timezone: 'Asia/Seoul',
    headline,
    summaryText,
    markdownContent,
    jsonSchemaPayload,
  };
}
