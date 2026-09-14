import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  FileJson,
  FileText,
  MapPin,
  Minus,
  RefreshCw,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import type { AnomalyAlert, BriefingReport, SpreadMetric, StationCurrentState } from '../types/weather.ts';
import { detectAnomaly } from '../utils/anomalyDetector.ts';
import { generateLlmBriefing } from '../utils/llmBriefing.ts';
import {
  calculateSpread,
  INITIAL_MULTI_STATION_DATA,
  parseOpenMeteoPayload,
  updateStationDailyHistory,
  WEATHER_STATIONS,
} from '../utils/multiStationEngine.ts';

export const MultiStationLiveSection: React.FC = () => {
  // 3개 관측소 상태
  const [stationStates, setStationStates] = useState<StationCurrentState[]>(() => {
    return WEATHER_STATIONS.map((st) => {
      const seed = INITIAL_MULTI_STATION_DATA[st.id];
      const todayVal = seed.today.normalized_value;
      const yesterdayVal = seed.yesterday.normalized_value;
      const delta = Math.round((todayVal - yesterdayVal) * 10) / 10;
      return {
        station: st,
        reading: seed.today,
        status: { freshness: 'fresh', error_code: 'none' },
        previousDayReading: seed.yesterday,
        delta,
        history: seed.history,
      };
    });
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [briefingTab, setBriefingTab] = useState<'markdown' | 'json'>('markdown');

  // 전국 편차 계산
  const spread: SpreadMetric = calculateSpread(
    stationStates.map((s) => ({
      name: s.station.name,
      temp: s.reading ? (s.reading.normalized_value ?? s.reading.value ?? 0) : 0,
    })),
  );

  // 이상 기온 판정 결과
  const anomalies: AnomalyAlert[] = stationStates.map((s) => {
    const todayTemp = s.reading ? (s.reading.normalized_value ?? s.reading.value ?? 0) : 0;
    const prevTemp = s.previousDayReading
      ? (s.previousDayReading.normalized_value ?? s.previousDayReading.value ?? null)
      : null;
    return detectAnomaly(s.station.id, s.station.name, prevTemp, todayTemp, 3.0);
  });

  // LLM 브리핑 생성
  const briefing: BriefingReport = generateLlmBriefing(stationStates, spread, anomalies);

  // 실제 Open-Meteo API 호출 (실시간 동적 조회)
  const handleRefreshLive = async () => {
    setIsRefreshing(true);
    try {
      const updatedStates = await Promise.all(
        stationStates.map(async (stState) => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${stState.station.latitude}&longitude=${stState.station.longitude}&current=temperature_2m&timezone=Asia%2FSeoul`;
            const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const normalized = parseOpenMeteoPayload(data, stState.station);

            const updatedHistory = updateStationDailyHistory(stState.history, normalized, stState.station.id);
            const prevReading =
              updatedHistory.length > 1
                ? updatedHistory[updatedHistory.length - 2].reading
                : stState.previousDayReading;
            const delta = prevReading
              ? Math.round((normalized.normalized_value - prevReading.normalized_value) * 10) / 10
              : null;

            return {
              ...stState,
              reading: normalized,
              status: { freshness: 'fresh' as const, error_code: 'none' as const },
              previousDayReading: prevReading,
              delta,
              history: updatedHistory,
            };
          } catch (err) {
            console.warn(`${stState.station.name} 실시간 조회 실패, 직전 정상값 보존:`, err);
            // 장애 시 직전 정상값 보존 및 stale 격리
            return {
              ...stState,
              status: { freshness: 'stale' as const, error_code: 'timeout' as const },
            };
          }
        }),
      );
      setStationStates(updatedStates);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(briefing.markdownContent);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(briefing.jsonSchemaPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <section id="weather" className="scroll-mt-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-900/10 px-2.5 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
              과제 4 기반 작은 개선 하나 완성
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              T05-C16 기능 완성
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            전국 3대 권역 실시간 기상 관측 및 이상 기후 감지 시스템
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            서울·부산·제주 멀티 관측소 실시간 정규화, 남북 기온 편차, KST 어제 대비 급변 감지, 그리고 멀티 LLM 연계
            브리핑을 제공합니다.
          </p>
        </div>

        {/* Live Refresh Button */}
        <button
          type="button"
          onClick={handleRefreshLive}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>전국 관측소 실시간 동적 조회 (Open-Meteo)</span>
        </button>
      </div>

      {/* Overview Cards: Thermal Spread & Anomaly Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Thermal Spread Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
              <Thermometer className="h-4 w-4 text-neutral-500" />
              전국 남북 기온 편차 (National Thermal Spread)
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              T05-TEST-06
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900 tabular-nums dark:text-white">
              {spread.spread.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-neutral-500">{spread.unit}</span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-neutral-200/60 pt-3 text-xs text-neutral-600 dark:border-neutral-800/60 dark:text-neutral-400">
            <div>
              최고: <strong className="text-neutral-900 dark:text-white">{spread.maxStation}</strong> (
              {spread.maxTemp.toFixed(1)}°C)
            </div>
            <div>
              최저: <strong className="text-neutral-900 dark:text-white">{spread.minStation}</strong> (
              {spread.minTemp.toFixed(1)}°C)
            </div>
          </div>
        </div>

        {/* Anomaly Summary Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
              <AlertCircle className="h-4 w-4 text-neutral-500" />
              어제 대비 이상 기후 감지 현황 (Threshold ±3.0°C)
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              T05-TEST-07, 08
            </span>
          </div>

          <div className="mt-3">
            {anomalies.some((a) => a.isAnomaly) ? (
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-bold">
                  {anomalies
                    .filter((a) => a.isAnomaly)
                    .map((a) => `${a.stationName}(${a.delta > 0 ? `+${a.delta}` : a.delta}°C)`)
                    .join(', ')}{' '}
                  급변 경보
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-sm font-bold">전 권역 어제 대비 정상 범위 (±3.0°C 이내 유지)</span>
              </div>
            )}
          </div>

          <div className="mt-3 border-t border-neutral-200/60 pt-3 text-xs text-neutral-500 dark:border-neutral-800/60 dark:text-neutral-400">
            경계값 조건: |ΔT| &lt; 3.00°C 정상, |ΔT| ≥ 3.00°C 감지 (부동소수점 오차 방지 처리)
          </div>
        </div>
      </div>

      {/* 3 Weather Station Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stationStates.map((st) => {
          const anomaly = anomalies.find((a) => a.stationId === st.station.id);
          const val = st.reading?.normalized_value ?? st.reading?.value ?? 0;
          const prevVal = st.previousDayReading?.normalized_value ?? st.previousDayReading?.value ?? null;
          const isStale = st.status.freshness === 'stale';

          return (
            <div
              key={st.station.id}
              className={`relative overflow-hidden rounded-2xl border bg-white/70 p-5 shadow-xs backdrop-blur-xl transition-all dark:bg-neutral-900/60 ${
                anomaly?.isAnomaly
                  ? 'border-rose-500/40 dark:border-rose-500/30'
                  : 'border-neutral-200/80 dark:border-neutral-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{st.station.name}</h3>
                    <span className="text-[10px] text-neutral-400">{st.station.region}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isStale ? (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      오래된 값 (Stale)
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      신선 (Fresh)
                    </span>
                  )}
                </div>
              </div>

              {/* Temperature Value */}
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] text-neutral-500">현재 기온</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-neutral-900 tabular-nums dark:text-white">
                      {val.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-neutral-500">°C</span>
                  </div>
                </div>

                {/* Delta */}
                <div className="text-right">
                  <div className="text-[11px] text-neutral-500">어제 대비 (ΔT)</div>
                  {st.delta !== null ? (
                    <div
                      className={`flex items-center justify-end gap-0.5 text-sm font-bold tabular-nums ${
                        st.delta > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : st.delta < 0
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-neutral-500'
                      }`}
                    >
                      {st.delta > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : st.delta < 0 ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                      <span>{st.delta > 0 ? `+${st.delta.toFixed(1)}` : st.delta.toFixed(1)}°C</span>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-400">-</span>
                  )}
                </div>
              </div>

              {/* Anomaly Badge */}
              {anomaly?.isAnomaly && (
                <div className="mt-3 rounded-xl bg-rose-500/10 p-2.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                  {anomaly.message}
                </div>
              )}

              {/* Metadata details */}
              <div className="mt-4 space-y-1 border-t border-neutral-200/60 pt-3 text-[11px] text-neutral-500 dark:border-neutral-800/60 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>어제 관측값:</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {prevVal !== null ? `${prevVal.toFixed(1)}°C` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>기준 시간대:</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">{st.station.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span>관측 시각:</span>
                  <span className="max-w-[150px] truncate font-mono text-neutral-700 dark:text-neutral-300">
                    {st.reading?.source_time?.replace('+09:00', '') || '-'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-LLM Briefing Generator (T05-TEST-09) */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 shadow-xs backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
        <div className="flex flex-col gap-3 border-b border-neutral-200/60 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                멀티 LLM 연계 구조화 브리핑 생성기 (T05-TEST-09)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                후속 LLM 프롬프트에 즉시 주입 가능한 규격화된 Markdown 요약 및 JSON Schema 페이로드
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Switcher */}
            <div className="inline-flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
              <button
                type="button"
                onClick={() => setBriefingTab('markdown')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  briefingTab === 'markdown'
                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Markdown</span>
              </button>
              <button
                type="button"
                onClick={() => setBriefingTab('json')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  briefingTab === 'json'
                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                }`}
              >
                <FileJson className="h-3.5 w-3.5" />
                <span>JSON Schema</span>
              </button>
            </div>

            {/* Copy Button */}
            {briefingTab === 'markdown' ? (
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 dark:border-neutral-700/80 dark:bg-neutral-900 dark:text-neutral-200"
              >
                {copiedMd ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedMd ? '복사됨' : 'MD 복사'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 dark:border-neutral-700/80 dark:bg-neutral-900 dark:text-neutral-200"
              >
                {copiedJson ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedJson ? '복사됨' : 'JSON 복사'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-5">
          {briefingTab === 'markdown' ? (
            <div className="rounded-xl bg-neutral-900 p-4 font-mono text-xs text-neutral-200 dark:bg-neutral-950">
              <pre className="leading-relaxed whitespace-pre-wrap">{briefing.markdownContent}</pre>
            </div>
          ) : (
            <div className="rounded-xl bg-neutral-900 p-4 font-mono text-xs text-emerald-400 dark:bg-neutral-950">
              <pre className="leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(briefing.jsonSchemaPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
