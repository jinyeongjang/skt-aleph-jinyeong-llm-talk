import type { AnomalyAlert } from '../types/weather';

/**
 * 이상 기온 감지 엔진 (T05-TEST-07, T05-TEST-08)
 *
 * - 기준: 어제 기온 대비 오늘 기온의 절대 변화량 |ΔT| >= threshold (기본 3.0°C)
 * - 경계값 처리:
 *   - |ΔT| < threshold : 정상 (isAnomaly = false)
 *   - |ΔT| >= threshold : 이상 감지 (isAnomaly = true)
 *     - ΔT <= -threshold : temperature_drop (급격한 기온 하강)
 *     - ΔT >= threshold : temperature_rise (급격한 기온 상승)
 */
export const DEFAULT_ANOMALY_THRESHOLD = 3.0; // °C

export function detectAnomaly(
  stationId: string,
  stationName: string,
  yesterdayTemp: number | null,
  todayTemp: number,
  threshold: number = DEFAULT_ANOMALY_THRESHOLD,
  detectedAtIso?: string,
): AnomalyAlert {
  const nowIso = detectedAtIso || new Date().toISOString();

  if (yesterdayTemp === null || yesterdayTemp === undefined) {
    return {
      stationId,
      stationName,
      isAnomaly: false,
      delta: 0,
      threshold,
      anomalyType: 'normal',
      message: `${stationName}: 어제 관측 데이터가 없어 전일 대비 비교를 대기 중입니다.`,
      detectedAt: nowIso,
    };
  }

  // 부동소수점 오차 방지: 소수점 2자리 반올림 후 비교
  const rawDelta = todayTemp - yesterdayTemp;
  const delta = Math.round(rawDelta * 100) / 100;
  const absDelta = Math.abs(delta);

  // 경계값 판정 (|ΔT| >= threshold)
  // 예: 2.99°C < 3.00°C -> false, 3.00°C >= 3.00°C -> true
  const isAnomaly = absDelta >= threshold;

  let anomalyType: 'temperature_drop' | 'temperature_rise' | 'normal' = 'normal';
  let message = `${stationName}: 어제 대비 ${delta > 0 ? `+${delta}` : delta}°C 변화로 평년 정상 범위입니다.`;

  if (isAnomaly) {
    if (delta <= -threshold) {
      anomalyType = 'temperature_drop';
      message = `⚠️ [급격한 기온 하강 경보] ${stationName} 기온이 어제(${yesterdayTemp.toFixed(1)}°C) 대비 ${delta.toFixed(1)}°C 급락하여 ${todayTemp.toFixed(1)}°C를 기록했습니다. (임계치 ±${threshold.toFixed(1)}°C 초과)`;
    } else {
      anomalyType = 'temperature_rise';
      message = `⚠️ [급격한 기온 상승 경보] ${stationName} 기온이 어제(${yesterdayTemp.toFixed(1)}°C) 대비 +${delta.toFixed(1)}°C 급등하여 ${todayTemp.toFixed(1)}°C를 기록했습니다. (임계치 ±${threshold.toFixed(1)}°C 초과)`;
    }
  }

  return {
    stationId,
    stationName,
    isAnomaly,
    delta,
    threshold,
    anomalyType,
    message,
    detectedAt: nowIso,
  };
}
