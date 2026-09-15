import React, { useState } from 'react';
import {
  BarChart3,
  Clock,
  MessageSquare,
  ShieldCheck,
  TrendingDown,
  FileCode,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { BENCHMARK_MODELS, COMMON_LIMITS } from '../utils/benchmarkData.ts';

interface BenchmarkChartGraphProps {
  showRealNames: boolean;
}

type ChartViewType = 'column' | 'bar';

export const BenchmarkChartGraph: React.FC<BenchmarkChartGraphProps> = ({ showRealNames }) => {
  const [chartView, setChartView] = useState<ChartViewType>('column');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const modelA = BENCHMARK_MODELS.a;
  const modelB = BENCHMARK_MODELS.b;

  // 5대 핵심 측정 지표 데이터 (T05-C23 ~ T05-C27)
  const chartData = [
    {
      id: 'time',
      name: '소요 시간',
      criteriaId: 'T05-C23',
      icon: Clock,
      unit: '분',
      limit: COMMON_LIMITS.timeLimitMinutes,
      limitText: '60분 상한',
      valA: modelA.actualTimeMin,
      valB: modelB.actualTimeMin,
      pctA: (modelA.actualTimeMin / COMMON_LIMITS.timeLimitMinutes) * 100, // 46.7%
      pctB: (modelB.actualTimeMin / COMMON_LIMITS.timeLimitMinutes) * 100, // 36.7%
      delta: '-6분 단축 (-21.4%)',
      tooltip: '공통 상한(60분) 대비 각각 28분, 22분 소요 (T05-C50, C51 통과)',
    },
    {
      id: 'calls',
      name: '호출 횟수',
      criteriaId: 'T05-C24',
      icon: MessageSquare,
      unit: '회',
      limit: COMMON_LIMITS.callLimitCount,
      limitText: '25회 상한',
      valA: modelA.actualCalls,
      valB: modelB.actualCalls,
      pctA: (modelA.actualCalls / COMMON_LIMITS.callLimitCount) * 100, // 56.0%
      pctB: (modelB.actualCalls / COMMON_LIMITS.callLimitCount) * 100, // 44.0%
      delta: '-3회 절감 (-21.4%)',
      tooltip: '공통 상한(25회) 대비 각각 14회, 11회 호출 (T05-C52, C53 통과)',
    },
    {
      id: 'errors',
      name: '오류 회차',
      criteriaId: 'T05-C25',
      icon: TrendingDown,
      unit: '회',
      limit: 5,
      limitText: '5회 기준',
      valA: modelA.errorRuns,
      valB: modelB.errorRuns,
      pctA: (modelA.errorRuns / 5) * 100, // 60.0%
      pctB: (modelB.errorRuns / 5) * 100, // 20.0%
      delta: '-2회 감소 (-66.7%)',
      tooltip: '인수인계 문서 지침에 따라 AI B는 1회 디버깅 후 즉각 전수 통과',
    },
    {
      id: 'tests',
      name: '검사 완주율',
      criteriaId: 'T05-C27',
      icon: ShieldCheck,
      unit: '개',
      limit: 10,
      limitText: '10개 목표',
      valA: modelA.passedTestsCount,
      valB: modelB.passedTestsCount,
      pctA: (modelA.passedTestsCount / 10) * 100, // 60.0%
      pctB: (modelB.passedTestsCount / 10) * 100, // 100.0%
      delta: '+4개 완주 (100% PASS)',
      tooltip: '사전 고정 10대 검사 전수 100% 통과 완성 (T05-C16, C17 통과)',
    },
    {
      id: 'rework',
      name: '소스 변동량',
      criteriaId: 'T05-C26',
      icon: FileCode,
      unit: '줄',
      limit: 500,
      limitText: '500줄 기준',
      valA: modelA.linesAdded + modelA.linesDeleted,
      valB: modelB.linesAdded + modelB.linesDeleted,
      detailA: `+${modelA.linesAdded}/-${modelA.linesDeleted}`,
      detailB: `+${modelB.linesAdded}/-${modelB.linesDeleted}`,
      pctA: ((modelA.linesAdded + modelA.linesDeleted) / 500) * 100, // 91.0%
      pctB: ((modelB.linesAdded + modelB.linesDeleted) / 500) * 100, // 66.6%
      delta: '파기 0건 (100% 계승)',
      tooltip: '기존 AI A의 코드를 100% 보존하며 순수 증분 구현 완성',
    },
  ];

  return (
    <div className="glass-card relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-3.5 shadow-xs backdrop-blur-xl transition-all sm:p-4 dark:border-neutral-800/80 dark:bg-neutral-900/60">
      {/* Top Accent Gradient Border */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-neutral-400 via-emerald-500 to-teal-400" />

      {/* Header & View Mode Controls */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-neutral-900/10 px-2 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
              <BarChart3 className="h-3 w-3" />
              차트그래프 분석
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              5대 지표 (T05-C23 ~ T05-C27)
            </span>
          </div>
          <h3 className="mt-1 text-sm font-bold text-neutral-900 sm:text-base dark:text-white">
            두 AI 세션 공정 측정 비교 차트그래프
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            사전 고정한 공통 상한(60분/25회) 아래 두 모델의 실제 측정치를 비교 막대 차트로 대조합니다.
          </p>
        </div>

        {/* Top Controls: Legend & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model Legend */}
          <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200/60 bg-white/80 px-2.5 py-1 text-xs backdrop-blur-xs dark:border-neutral-800/60 dark:bg-neutral-950/60">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-neutral-700 dark:bg-neutral-300" />
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {showRealNames ? `${modelA.serviceName} (${modelA.modelName})` : 'Model A'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-emerald-500 shadow-xs" />
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                {showRealNames ? `${modelB.serviceName} (${modelB.modelName})` : 'Model B (100% 완주)'}
              </span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-neutral-200/60 bg-neutral-100/80 p-0.5 dark:border-neutral-800/60 dark:bg-neutral-950/60">
            <button
              type="button"
              onClick={() => setChartView('column')}
              className={`flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                chartView === 'column'
                  ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
              title="수직 기둥 차트"
            >
              <BarChart3 className="h-3 w-3" />
              <span>기둥형</span>
            </button>
            <button
              type="button"
              onClick={() => setChartView('bar')}
              className={`flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                chartView === 'bar'
                  ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
              title="수평 막대 차트"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>막대형</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHART VIEW 1: 수직 기둥 차트 그래프 (컴팩트 세로 범위, 애니메이션 제거) */}
      {chartView === 'column' && (
        <div className="mt-3">
          <div className="relative rounded-xl border border-neutral-200/70 bg-gradient-to-b from-neutral-50/70 via-white/50 to-neutral-50/40 p-2.5 pt-3 backdrop-blur-md dark:border-neutral-800/70 dark:from-neutral-950/40 dark:via-neutral-900/30 dark:to-neutral-950/40">
            {/* Main Plot Area (Compact Height: 144px, Range: 0% to 120%) */}
            <div className="relative flex">
              {/* Left Y-Axis Scale Marks */}
              <div className="relative h-36 w-8 shrink-0 font-mono text-[9px] text-neutral-400 select-none dark:text-neutral-500">
                <span className="absolute top-0 right-1 -translate-y-1/2">120%</span>
                <span
                  className="absolute right-1 -translate-y-1/2 font-bold text-rose-500 dark:text-rose-400"
                  style={{ top: '16.67%' }}
                >
                  100%
                </span>
                <span className="absolute right-1 -translate-y-1/2" style={{ top: '58.33%' }}>
                  50%
                </span>
                <span className="absolute right-1 bottom-0 translate-y-1/2">0%</span>
              </div>

              {/* Chart Plot Area with Grid Lines & 100% Limit Guideline */}
              <div className="relative h-36 flex-1 border-l border-neutral-300/80 dark:border-neutral-700/80">
                {/* 120% Ceiling Line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 border-b border-neutral-200/40 dark:border-neutral-800/30" />

                {/* 100% Limit Guideline Line */}
                <div
                  className="pointer-events-none absolute inset-x-0 z-20 border-b border-dashed border-rose-500/80 dark:border-rose-400/90"
                  style={{ top: '16.67%' }}
                >
                  <div className="py-0.2 absolute -top-3 right-1 flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-50/95 px-2 text-[9px] font-bold text-rose-700 shadow-xs backdrop-blur-md dark:border-rose-500/40 dark:bg-neutral-900/95 dark:text-rose-300">
                    <span>100% 상한선</span>
                  </div>
                </div>

                {/* Background 50% Grid Line */}
                <div
                  className="pointer-events-none absolute inset-x-0 border-b border-neutral-200/50 dark:border-neutral-800/40"
                  style={{ top: '58.33%' }}
                />

                {/* Columns Grid (5 Metrics, 정적 스타일 렌더링) */}
                <div className="relative z-10 grid h-full grid-cols-5 items-end px-1 sm:px-4">
                  {chartData.map((item) => (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredMetric(item.id)}
                      onMouseLeave={() => setHoveredMetric(null)}
                      className="group flex h-full flex-col items-center justify-end"
                    >
                      {/* Twin Columns (Model A vs Model B) */}
                      <div className="flex h-full w-full items-end justify-center gap-1 sm:gap-2">
                        {/* Model A Column */}
                        <div className="relative flex h-full w-5 flex-col justify-end sm:w-7">
                          <div
                            style={{ height: `${Math.max(8, (item.pctA / 120) * 100)}%` }}
                            className="relative w-full rounded-t-xs bg-neutral-700 shadow-xs transition-colors group-hover:bg-neutral-800 dark:bg-neutral-400 dark:group-hover:bg-neutral-300"
                          >
                            {/* Value Floating Badge on Top */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap text-neutral-800 dark:text-neutral-200">
                              {item.valA}
                              {item.unit}
                            </div>
                          </div>
                          <span className="mt-0.5 text-center text-[9px] font-semibold text-neutral-500">A</span>
                        </div>

                        {/* Model B Column (Emerald / Highlighted) */}
                        <div className="relative flex h-full w-5 flex-col justify-end sm:w-7">
                          <div
                            style={{ height: `${Math.max(8, (item.pctB / 120) * 100)}%` }}
                            className="relative w-full rounded-t-xs bg-gradient-to-t from-emerald-600 to-teal-400 shadow-[0_2px_8px_rgba(16,185,129,0.3)] transition-colors group-hover:brightness-110"
                          >
                            {/* Value Floating Badge on Top */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap text-emerald-700 dark:text-emerald-300">
                              {item.valB}
                              {item.unit}
                            </div>
                          </div>
                          <span className="mt-0.5 text-center text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            B
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* X-Axis Baseline Border */}
            <div className="mt-0 ml-8 border-b border-neutral-300/90 dark:border-neutral-700/90" />

            {/* X-Axis Labels & Delta Badges (Compact) */}
            <div className="ml-8 grid grid-cols-5 gap-1.5 pt-2 text-center sm:gap-3">
              {chartData.map((item) => (
                <div key={item.id} className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-0.5 text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                    <item.icon className="h-3 w-3 text-neutral-500" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="text-[9px] text-neutral-400 dark:text-neutral-500">{item.limitText}</div>
                  <div className="py-0.2 mt-0.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 text-[8px] font-bold whitespace-nowrap text-emerald-700 sm:text-[9px] dark:bg-emerald-500/20 dark:text-emerald-300">
                    {item.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tooltip Banner */}
          <div className="mt-1.5 flex min-h-5 items-center justify-center text-center">
            {hoveredMetric ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/90 px-2 py-0.5 text-[10px] font-medium text-neutral-800 shadow-xs sm:text-[11px] dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-200">
                <Info className="h-3 w-3 text-emerald-500" />
                {chartData.find((d) => d.id === hoveredMetric)?.tooltip}
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400">
                각 기둥에 마우스를 올리면 세부 측정 기준 및 비고가 표시됩니다.
              </span>
            )}
          </div>
        </div>
      )}

      {/* CHART VIEW 2: 수평 막대 차트 그래프 (컴팩트 수평 뷰) */}
      {chartView === 'bar' && (
        <div className="mt-2.5 space-y-2">
          {chartData.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral-200/70 bg-white/60 p-2 transition-all hover:bg-white/90 sm:p-2.5 dark:border-neutral-800/70 dark:bg-neutral-950/40 dark:hover:bg-neutral-950/60"
            >
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    <item.icon className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">{item.name}</span>
                  <span className="py-0.2 rounded-full bg-neutral-100 px-1.5 text-[9px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    {item.criteriaId}
                  </span>
                  <span className="text-[10px] text-neutral-400">({item.limitText})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="py-0.2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[9px] font-bold text-emerald-700 sm:text-[10px] dark:text-emerald-300">
                    {item.delta}
                  </span>
                </div>
              </div>

              {/* Bars Pair (Direct Styles, No Animation) */}
              <div className="mt-1.5 space-y-1">
                {/* Model A Bar */}
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      {showRealNames ? `${modelA.serviceName} (${modelA.modelName})` : 'Model A'}
                    </span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-200">
                      {item.detailA || `${item.valA}${item.unit}`}{' '}
                      <span className="text-[10px] text-neutral-400">({item.pctA.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="relative mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      style={{ width: `${Math.min(100, item.pctA)}%` }}
                      className="h-full rounded-full bg-neutral-700 dark:bg-neutral-400"
                    />
                  </div>
                </div>

                {/* Model B Bar */}
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {showRealNames ? `${modelB.serviceName} (${modelB.modelName})` : 'Model B (100% 완주)'}
                    </span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {item.detailB || `${item.valB}${item.unit}`}{' '}
                      <span className="text-[10px] font-normal text-emerald-600/80 dark:text-emerald-400/80">
                        ({item.pctB.toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  <div className="relative mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-500/15 dark:bg-neutral-800">
                    <div
                      style={{ width: `${Math.min(100, item.pctB)}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400">{item.tooltip}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart Footer Insight */}
      <div className="mt-2.5 flex flex-col gap-1 border-t border-neutral-200/60 pt-2 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
        <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px]">
            공통 사전 상한(60분, 25회) 대비 두 세션 모두 30% 이상 안전 마진 확보 (T05-C50~C53)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
          <Zap className="h-3 w-3 text-emerald-500" />
          <span>기존 코드 100% 무결성 유지 및 사전 고정 검사 10/10 PASS 보존</span>
        </div>
      </div>
    </div>
  );
};
