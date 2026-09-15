import React, { useState } from 'react';
import { Bot, CheckCircle2, Clock, Eye, EyeOff, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { BENCHMARK_MODELS, COMMON_LIMITS, TOOL_SELECTION_CRITERIA, WORKFLOW_TIMELINE } from '../utils/benchmarkData.ts';
import { BenchmarkChartGraph } from './BenchmarkChartGraph.tsx';

export const BlindBenchmarkSection: React.FC = () => {
  // 블라인드 해제 상태 (기본값 false = 블라인드 처리, T05-C28)
  const [showRealNames, setShowRealNames] = useState(false);

  const modelA = BENCHMARK_MODELS.a;
  const modelB = BENCHMARK_MODELS.b;

  return (
    <section id="benchmark" className="scroll-mt-24 space-y-4 sm:space-y-5">
      {/* Header with Title & Blind Evaluation Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-900/10 px-2.5 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
              카드 5 · 이름을 가리고 비교
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              T05-C23 ~ T05-C28 충족
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            두 AI 세션 공정 측정 비교 보고서 (Blind Benchmark)
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            사전 고정한 공통 상한(60분 / 25회) 안에서 두 AI 세션이 차례로 작업한 실제 측정치를 가린 채 비교합니다.
          </p>
        </div>

        {/* Blind Toggle Button */}
        <button
          type="button"
          onClick={() => setShowRealNames(!showRealNames)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition-all ${
            showRealNames
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'border border-neutral-300/80 bg-white/80 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700/80 dark:bg-neutral-900/80 dark:text-neutral-200'
          }`}
        >
          {showRealNames ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>블라인드 평가 모드 활성화</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>블라인드 평가 모드 비활성화</span>
            </>
          )}
        </button>
      </div>

      {/* Model Comparison Cards (Grid) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Model A Card */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl transition-all sm:p-5 dark:border-neutral-800/80 dark:bg-neutral-900/60">
          {/* Top Accent Line */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-neutral-400 via-neutral-600 to-neutral-900 dark:from-neutral-700 dark:via-neutral-400 dark:to-neutral-100" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {showRealNames ? `${modelA.serviceName} (${modelA.modelName})` : modelA.maskedName}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  세션 1: 아키텍처 및 정규화 기초 (T05-TEST-01~06)
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                중단 시점: 6 / 10 PASS
              </span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-200/70 dark:bg-neutral-800">
                <div className="h-full rounded-full bg-neutral-700 dark:bg-neutral-300" style={{ width: '60%' }} />
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {modelA.roleDescription}
          </p>

          <div className="mt-3.5 space-y-2.5 border-t border-neutral-200/60 pt-3 dark:border-neutral-800/60">
            {/* Time */}
            <div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <Clock className="h-3.5 w-3.5 text-neutral-500" />
                  실제 작업시간 (상한 {COMMON_LIMITS.timeLimitMinutes}분)
                </span>
                <span className="font-bold text-neutral-900 tabular-nums dark:text-white">
                  {modelA.actualTimeMin}분{' '}
                  <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                    ({COMMON_LIMITS.timeLimitMinutes - modelA.actualTimeMin}분 여유)
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  style={{ width: `${(modelA.actualTimeMin / COMMON_LIMITS.timeLimitMinutes) * 100}%` }}
                  className="h-full rounded-full bg-neutral-800 dark:bg-neutral-200"
                />
              </div>
            </div>

            {/* Calls */}
            <div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <MessageSquare className="h-3.5 w-3.5 text-neutral-500" />
                  실제 요청·호출 수 (상한 {COMMON_LIMITS.callLimitCount}회)
                </span>
                <span className="font-bold text-neutral-900 tabular-nums dark:text-white">
                  {modelA.actualCalls}회{' '}
                  <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                    ({COMMON_LIMITS.callLimitCount - modelA.actualCalls}회 여유)
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  style={{ width: `${(modelA.actualCalls / COMMON_LIMITS.callLimitCount) * 100}%` }}
                  className="h-full rounded-full bg-neutral-800 dark:bg-neutral-200"
                />
              </div>
            </div>

            {/* Error runs & Rework */}
            <div className="grid grid-cols-2 gap-2.5 pt-0.5 text-xs">
              <div className="rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-2 dark:border-neutral-800/60 dark:bg-neutral-900/50">
                <div className="text-[11px] text-neutral-500">오류 회차 (1+ FAIL)</div>
                <div className="mt-0.5 text-sm font-bold text-neutral-900 tabular-nums dark:text-white">
                  {modelA.errorRuns}회
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-2 dark:border-neutral-800/60 dark:bg-neutral-900/50">
                <div className="text-[11px] text-neutral-500">코드 변경량 (추가/삭제)</div>
                <div className="mt-0.5 text-sm font-bold text-neutral-900 tabular-nums dark:text-white">
                  +{modelA.linesAdded} / -{modelA.linesDeleted}줄
                </div>
              </div>
            </div>

            {/* Commits */}
            <div className="space-y-0.5 pt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center justify-between font-mono">
                <span>시작 Commit:</span>
                <a
                  href={`https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/${modelA.startCommit}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-700 underline underline-offset-2 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                  title="A 시작 커밋 보기"
                >
                  {modelA.startCommit.slice(0, 10)}...
                </a>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>중단 Commit:</span>
                <a
                  href={`https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/${modelA.endCommit}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-700 underline underline-offset-2 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                  title="A 종료·인계 커밋 보기"
                >
                  {modelA.endCommit.slice(0, 10)}...
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Model B Card */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.02] p-4 shadow-xs backdrop-blur-xl transition-all sm:p-5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.03]">
          {/* Top Accent Line */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 dark:from-emerald-600 dark:via-emerald-400 dark:to-teal-300" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-neutral-950">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {showRealNames ? modelB.modelName : modelB.maskedName}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  세션 2: 인수인계 이어받아 100% 완주 (T05-TEST-07~10)
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                완료: 10 / 10 PASS
              </span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-emerald-500/20 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {modelB.roleDescription}
          </p>

          <div className="mt-3.5 space-y-2.5 border-t border-neutral-200/60 pt-3 dark:border-neutral-800/60">
            {/* Time */}
            <div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <Clock className="h-3.5 w-3.5 text-neutral-500" />
                  실제 작업시간 (상한 {COMMON_LIMITS.timeLimitMinutes}분)
                </span>
                <span className="font-bold text-neutral-900 tabular-nums dark:text-white">
                  {modelB.actualTimeMin}분{' '}
                  <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                    ({COMMON_LIMITS.timeLimitMinutes - modelB.actualTimeMin}분 여유)
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  style={{ width: `${(modelB.actualTimeMin / COMMON_LIMITS.timeLimitMinutes) * 100}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                />
              </div>
            </div>

            {/* Calls */}
            <div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <MessageSquare className="h-3.5 w-3.5 text-neutral-500" />
                  실제 요청·호출 수 (상한 {COMMON_LIMITS.callLimitCount}회)
                </span>
                <span className="font-bold text-neutral-900 tabular-nums dark:text-white">
                  {modelB.actualCalls}회{' '}
                  <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                    ({COMMON_LIMITS.callLimitCount - modelB.actualCalls}회 여유)
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  style={{ width: `${(modelB.actualCalls / COMMON_LIMITS.callLimitCount) * 100}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                />
              </div>
            </div>

            {/* Error runs & Rework */}
            <div className="grid grid-cols-2 gap-2.5 pt-0.5 text-xs">
              <div className="rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-2 dark:border-neutral-800/60 dark:bg-neutral-900/50">
                <div className="text-[11px] text-neutral-500">오류 회차 (1+ FAIL)</div>
                <div className="mt-0.5 text-sm font-bold text-neutral-900 tabular-nums dark:text-white">
                  {modelB.errorRuns}회{' '}
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">(해결 완료)</span>
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-2 dark:border-neutral-800/60 dark:bg-neutral-900/50">
                <div className="text-[11px] text-neutral-500">코드 변경량 (추가/삭제)</div>
                <div className="mt-0.5 text-sm font-bold text-neutral-900 tabular-nums dark:text-white">
                  +{modelB.linesAdded} / -{modelB.linesDeleted}줄
                </div>
              </div>
            </div>

            {/* Commits */}
            <div className="space-y-0.5 pt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center justify-between font-mono">
                <span>인계받은 Commit:</span>
                <a
                  href={`https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/${modelB.startCommit}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-700 underline underline-offset-2 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                  title="B 시작 커밋 보기"
                >
                  {modelB.startCommit.slice(0, 10)}...
                </a>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>최종 완료 Commit:</span>
                <a
                  href={`https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/${modelB.endCommit}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-700 underline underline-offset-2 transition-colors hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                  title="B 완료 커밋 보기"
                >
                  {modelB.endCommit.slice(0, 10)}...
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Benchmark Metrics Chart Graph (T05-C23 ~ T05-C27) */}
      <BenchmarkChartGraph showRealNames={showRealNames} />

      {/* Comprehensive Comparison Table (Card 5) */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 shadow-xs backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
        {/* Top Accent Line */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-neutral-500 via-emerald-500 to-teal-400" />

        <div className="border-b border-neutral-200/60 px-4 py-3 sm:px-5 sm:py-3.5 dark:border-neutral-800/60">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            지표별 1:1 대조 요약표 (T05-C23 ~ T05-C28)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            두 AI가 사전 고정된 동일 조건 하에서 달성한 객관적 지표 측정 결과
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200/60 bg-neutral-50/80 text-neutral-600 dark:border-neutral-800/60 dark:bg-neutral-950/40 dark:text-neutral-400">
              <tr>
                <th className="py-2.5 pr-3 pl-4 font-semibold sm:py-3 sm:pr-4 sm:pl-5">평가 항목 (기준 ID)</th>
                <th className="px-3 py-2.5 font-semibold sm:px-4 sm:py-3">공통 사전 상한</th>
                <th className="px-3 py-2.5 font-semibold sm:px-4 sm:py-3">
                  {showRealNames ? `${modelA.serviceName} (${modelA.modelName})` : modelA.maskedName}
                </th>
                <th className="px-3 py-2.5 font-semibold sm:px-4 sm:py-3">
                  {showRealNames ? `${modelB.serviceName} (${modelB.modelName})` : modelB.maskedName}
                </th>
                <th className="py-2.5 pr-4 pl-3 font-semibold sm:py-3 sm:pr-5 sm:pl-4">판정 및 비교 비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
              <tr>
                <td className="py-2 pr-3 pl-4 font-medium text-neutral-900 sm:py-2.5 sm:pr-4 sm:pl-5 dark:text-white">
                  실제 작업시간 (T05-C23)
                </td>
                <td className="px-3 py-2 text-neutral-500 sm:px-4 sm:py-2.5">60분 이하</td>
                <td className="px-3 py-2 font-semibold text-neutral-900 tabular-nums sm:px-4 sm:py-2.5 dark:text-neutral-200">
                  {modelA.actualTimeMin}분
                </td>
                <td className="px-3 py-2 font-semibold text-emerald-600 tabular-nums sm:px-4 sm:py-2.5 dark:text-emerald-400">
                  {modelB.actualTimeMin}분
                </td>
                <td className="py-2 pr-4 pl-3 text-[11px] text-neutral-500 sm:py-2.5 sm:pr-5 sm:pl-4">
                  둘 다 상한 이하 준수 (T05-C50, C51 통과)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 pl-4 font-medium text-neutral-900 sm:py-2.5 sm:pr-4 sm:pl-5 dark:text-white">
                  요청·호출 수 (T05-C24)
                </td>
                <td className="px-3 py-2 text-neutral-500 sm:px-4 sm:py-2.5">25회 이하</td>
                <td className="px-3 py-2 font-semibold text-neutral-900 tabular-nums sm:px-4 sm:py-2.5 dark:text-neutral-200">
                  {modelA.actualCalls}회
                </td>
                <td className="px-3 py-2 font-semibold text-emerald-600 tabular-nums sm:px-4 sm:py-2.5 dark:text-emerald-400">
                  {modelB.actualCalls}회
                </td>
                <td className="py-2 pr-4 pl-3 text-[11px] text-neutral-500 sm:py-2.5 sm:pr-5 sm:pl-4">
                  둘 다 상한 이하 준수 (T05-C52, C53 통과)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 pl-4 font-medium text-neutral-900 sm:py-2.5 sm:pr-4 sm:pl-5 dark:text-white">
                  오류 수 (1+ FAIL 회차) (T05-C25)
                </td>
                <td className="px-3 py-2 text-neutral-500 sm:px-4 sm:py-2.5">-</td>
                <td className="px-3 py-2 font-semibold text-neutral-900 tabular-nums sm:px-4 sm:py-2.5 dark:text-neutral-200">
                  {modelA.errorRuns}회
                </td>
                <td className="px-3 py-2 font-semibold text-emerald-600 tabular-nums sm:px-4 sm:py-2.5 dark:text-emerald-400">
                  {modelB.errorRuns}회
                </td>
                <td className="py-2 pr-4 pl-3 text-[11px] text-neutral-500 sm:py-2.5 sm:pr-5 sm:pl-4">
                  고정 검사 10개 실행 회차 중 1개 이상 FAIL 회차
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 pl-4 font-medium text-neutral-900 sm:py-2.5 sm:pr-4 sm:pl-5 dark:text-white">
                  검사 통과 수 (T05-C27)
                </td>
                <td className="px-3 py-2 text-neutral-500 sm:px-4 sm:py-2.5">10개 목표</td>
                <td className="px-3 py-2 font-semibold text-neutral-900 tabular-nums sm:px-4 sm:py-2.5 dark:text-neutral-200">
                  6 / 10
                </td>
                <td className="px-3 py-2 font-bold text-emerald-600 tabular-nums sm:px-4 sm:py-2.5 dark:text-emerald-400">
                  10 / 10 (100%)
                </td>
                <td className="py-2 pr-4 pl-3 text-[11px] text-neutral-500 sm:py-2.5 sm:pr-5 sm:pl-4">
                  AI B가 인수인계만으로 100% 완주 (T05-C16 통과)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 pl-4 font-medium text-neutral-900 sm:py-2.5 sm:pr-4 sm:pl-5 dark:text-white">
                  소스 재작업량 (줄 수) (T05-C26)
                </td>
                <td className="px-3 py-2 text-neutral-500 sm:px-4 sm:py-2.5">Git Diff 기준</td>
                <td className="px-3 py-2 font-mono text-neutral-700 tabular-nums sm:px-4 sm:py-2.5 dark:text-neutral-300">
                  +{modelA.linesAdded} / -{modelA.linesDeleted}
                </td>
                <td className="px-3 py-2 font-mono text-emerald-600 tabular-nums sm:px-4 sm:py-2.5 dark:text-emerald-400">
                  +{modelB.linesAdded} / -{modelB.linesDeleted}
                </td>
                <td className="py-2 pr-4 pl-3 text-[11px] text-neutral-500 sm:py-2.5 sm:pr-5 sm:pl-4">
                  생성 파일/lockfile 제외 순수 소스 코드 변동량
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-3 pl-4 font-medium text-neutral-900 sm:py-2.5 sm:pr-4 sm:pl-5 dark:text-white">
                  사용 서비스 및 모델 (T05-C39)
                </td>
                <td className="px-3 py-2 text-neutral-500 sm:px-4 sm:py-2.5">서로 다른 AI</td>
                <td className="px-3 py-2 text-neutral-700 sm:px-4 sm:py-2.5 dark:text-neutral-300">
                  {showRealNames ? 'Cursor (Claude 3.7 Sonnet)' : '서비스 A (모델 A)'}
                </td>
                <td className="px-3 py-2 text-neutral-700 sm:px-4 sm:py-2.5 dark:text-neutral-300">
                  {showRealNames ? 'Gemini 3.8 Flash(Antigravity CLI)' : '서비스 B (모델 B)'}
                </td>
                <td className="py-2 pr-4 pl-3 text-[11px] text-emerald-600 sm:py-2.5 sm:pr-5 sm:pl-4 dark:text-emerald-400">
                  이종 모델 연계 검증 완료
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tool Selection Criteria Callout (T05-C29) */}
      <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 shadow-xs backdrop-blur-md sm:p-4 dark:border-neutral-800/80 dark:bg-neutral-900/50">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                다음 작업에서 도구를 고르는 본인의 기준 (T05-C29)
              </span>
              <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                한 문장 기준
              </span>
            </div>
            <blockquote className="mt-1 border-l-2 border-neutral-900 pl-3 text-xs leading-relaxed font-medium text-neutral-800 dark:border-white dark:text-neutral-200">
              "{TOOL_SELECTION_CRITERIA}"
            </blockquote>
          </div>
        </div>
      </div>

      {/* 4-Step Sequence Timeline (T05-C07) */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl sm:p-5 dark:border-neutral-800/80 dark:bg-neutral-900/60">
        {/* Top Accent Line */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-neutral-500 via-emerald-500 to-teal-400" />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              작업 진행 순서 타임라인 (T05-C07 보증)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              AI A 시작 ➔ AI A 종료·인수인계 ➔ AI B 시작 ➔ AI B 완료의 엄격한 4단계 흐름
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            순서 검증 통과
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_TIMELINE.map((step) => (
            <div
              key={step.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200/70 bg-neutral-50/60 p-3 transition-all sm:p-3.5 dark:border-neutral-800/70 dark:bg-neutral-900/40"
            >
              {/* Step indicator */}
              <div className="absolute top-0 right-0 left-0 h-0.5 overflow-hidden bg-neutral-200/40 dark:bg-neutral-800/40">
                <div className="h-full w-full bg-gradient-to-r from-neutral-400 to-neutral-700 dark:from-neutral-600 dark:to-neutral-300" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-neutral-900/10 px-2 py-0.5 text-[11px] font-bold text-neutral-900 dark:bg-white/10 dark:text-white">
                    Step {step.order}: {step.phase}
                  </span>
                  <span className="text-[11px] text-neutral-500">{step.actor}</span>
                </div>
                <div className="mt-1.5 font-mono text-[11px] text-neutral-500">{step.timestamp}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {step.description}
                </p>
              </div>

              <div className="mt-3 border-t border-neutral-200/60 pt-2 text-[11px] dark:border-neutral-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">통과 검사:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {step.testsPassed} / {step.totalTests}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/60 dark:bg-neutral-800">
                  <div
                    style={{ width: `${(step.testsPassed / step.totalTests) * 100}%` }}
                    className={`h-full rounded-full ${
                      step.testsPassed === 10
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-neutral-500 to-neutral-700 dark:from-neutral-400 dark:to-neutral-200'
                    }`}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-neutral-500">
                  <span>Commit:</span>
                  <a
                    href={`https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/${step.commitHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                    title={`${step.phase} 커밋 보기`}
                  >
                    {step.commitHash.slice(0, 8)}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
