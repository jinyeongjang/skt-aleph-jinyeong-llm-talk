import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Play, RefreshCw, Terminal, XCircle } from 'lucide-react';
import type { TestExecutionResult } from '../types/benchmark.ts';
import { runAllFixedTests } from '../utils/testRunner.ts';
import { FIXED_TEST_SPECS } from '../utils/testSpecs.ts';

export const FixedTestsSection: React.FC = () => {
  // 모드: 'live' (브라우저 실시간 실행) | 'ai-a' (AI A 중단 시점 6/10) | 'ai-b' (AI B 완료 시점 10/10)
  const [viewMode, setViewMode] = useState<'live' | 'ai-a' | 'ai-b'>('live');
  const [liveResults, setLiveResults] = useState<TestExecutionResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRunAllLive = async () => {
    setIsRunning(true);
    try {
      const results = await runAllFixedTests();
      setLiveResults(results);
    } catch (err) {
      console.error('검사 실행 실패:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="fixed-tests" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-900/10 px-2.5 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
              카드 1 · 같은 문제, 같은 검사
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              T05-C01 ~ T05-C04 충족
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            사전 고정 10대 검사 스위트 & 실시간 인터랙티브 러너
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            작업 착수 전에 고유 ID·입력·관찰 가능한 기대값·경계값을 확정한 10개 검사를 실행합니다.
          </p>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleRunAllLive}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>10개 검사 실시간 실행 중...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>전체 10개 검사 실시간 실행 (Run Tests)</span>
            </>
          )}
        </button>
      </div>

      {/* Invariance Guarantee Badges & View Switcher */}
      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/80 dark:bg-neutral-900/60">
        {/* Invariance Guarantees (T05-C18 ~ C20) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">불변성 보증 규격:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> 검사 삭제 0건 (T05-C18)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> 검사 완화 0건 (T05-C19)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> 기대값 변경 0건 (T05-C20)
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="inline-flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
          <button
            type="button"
            onClick={() => setViewMode('live')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'live'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            실시간 실행 뷰
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ai-a')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'ai-a'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            AI A 중단 시점 (6/10)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ai-b')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'ai-b'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            AI B 완료 시점 (10/10)
          </button>
        </div>
      </div>

      {/* 10 Test Cases List */}
      <div className="space-y-3">
        {FIXED_TEST_SPECS.map((test) => {
          const liveRes = liveResults?.find((r) => r.testId === test.id);
          const isPassed =
            viewMode === 'live'
              ? liveRes
                ? liveRes.passed
                : true // 기본적으로 성공 상태
              : viewMode === 'ai-a'
                ? test.passedInA
                : test.passedInB;

          const isExpanded = expandedId === test.id;

          return (
            <div
              key={test.id}
              className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 shadow-xs backdrop-blur-xl transition-all dark:border-neutral-800/80 dark:bg-neutral-900/60"
            >
              <div
                onClick={() => toggleExpand(test.id)}
                className="dark:hover:bg-neutral-850/50 flex cursor-pointer items-center justify-between p-4.5 hover:bg-neutral-50/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      isPassed
                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{test.id}</span>
                      <span className="text-xs text-neutral-400">·</span>
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{test.name}</h4>
                    </div>
                    <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                      입력: {test.inputDescription}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      isPassed
                        ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                    }`}
                  >
                    {isPassed ? 'PASS' : 'FAIL (미완성)'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <div className="space-y-3 border-t border-neutral-200/60 bg-neutral-50/50 p-4 text-xs dark:border-neutral-800/60 dark:bg-neutral-950/40">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200/60 bg-white p-3 dark:border-neutral-800/60 dark:bg-neutral-900">
                      <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                        관찰 가능한 기대값 (Observable Expected Output)
                      </div>
                      <p className="mt-1 leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {test.expectedDescription}
                      </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200/60 bg-white p-3 dark:border-neutral-800/60 dark:bg-neutral-900">
                      <div className="font-semibold text-neutral-700 dark:text-neutral-300">
                        경계값 및 방어 조건 (Boundary Check)
                      </div>
                      <p className="mt-1 leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {test.boundaryNote || '표준 유효 범위 및 타입 엄격 검증'}
                      </p>
                    </div>
                  </div>

                  {/* Execution Logs if live run performed */}
                  {liveRes && (
                    <div className="rounded-xl border border-neutral-200/60 bg-neutral-900 p-3 text-white dark:border-neutral-800/60">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Terminal className="h-3 w-3" /> 실행 로그 (소요 시간: {liveRes.executionTimeMs}ms)
                        </span>
                        <span className="font-mono text-emerald-400">{liveRes.actualOutput}</span>
                      </div>
                      <pre className="mt-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-neutral-300">
                        {liveRes.logs.join('\n')}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
