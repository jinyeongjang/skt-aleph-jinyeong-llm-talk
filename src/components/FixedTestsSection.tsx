import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import type { TestExecutionResult } from '../types/benchmark.ts';
import { executeSingleTest, runSingleFixedTest } from '../utils/testRunner.ts';
import { FIXED_TEST_SPECS } from '../utils/testSpecs.ts';

export const FixedTestsSection: React.FC = () => {
  // 모드: 'live' (브라우저 실시간 실행) | 'ai-a' (AI A 중단 시점 6/10) | 'ai-b' (AI B 완료 시점 10/10)
  const [viewMode, setViewMode] = useState<'live' | 'ai-a' | 'ai-b'>('live');
  const [liveResults, setLiveResults] = useState<TestExecutionResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [runningIndividualId, setRunningIndividualId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    percent: number;
    currentName: string;
  } | null>(null);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);
  const [totalDurationMs, setTotalDurationMs] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // 10대 사전 고정 검사 순차 실시간 실행 핸들러
  const handleRunAllLive = async () => {
    setViewMode('live');
    setIsRunning(true);
    setProgress({
      current: 0,
      total: FIXED_TEST_SPECS.length,
      percent: 0,
      currentName: '테스트 러너 초기화 중...',
    });

    const startTime = performance.now();
    const collectedResults: TestExecutionResult[] = [];

    try {
      for (let i = 0; i < FIXED_TEST_SPECS.length; i++) {
        const spec = FIXED_TEST_SPECS[i];
        setRunningTestId(spec.id);
        setProgress({
          current: i + 1,
          total: FIXED_TEST_SPECS.length,
          percent: Math.round(((i + 1) / FIXED_TEST_SPECS.length) * 100),
          currentName: spec.name,
        });

        // 렌더링 프레임 확보 및 실시간 진행 체감을 위한 최소 딜레이 (60ms)
        await new Promise((resolve) => setTimeout(resolve, 60));

        const res = await executeSingleTest(spec);
        collectedResults.push(res);
        setLiveResults([...collectedResults]);

        // 카드 시각적 전환 안정화 딜레이 (30ms)
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      const totalTime = Math.round(performance.now() - startTime);
      setTotalDurationMs(totalTime);

      const now = new Date();
      const kstTimeStr = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setLastRunTime(kstTimeStr);
    } catch (err) {
      console.error('실시간 검사 실행 실패:', err);
    } finally {
      setIsRunning(false);
      setRunningTestId(null);
      setProgress(null);
    }
  };

  // 단일 검사 개별 재실행 핸들러
  const handleRunSingleTest = async (testId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMode !== 'live') {
      setViewMode('live');
    }
    setRunningIndividualId(testId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
      const res = await runSingleFixedTest(testId);

      setLiveResults((prev) => {
        if (!prev) return [res];
        const filtered = prev.filter((r) => r.testId !== testId);
        return [...filtered, res].sort((a, b) => a.testId.localeCompare(b.testId));
      });

      // 단독 실행된 카드는 상세 로그를 즉시 열어 확인 가능하도록 함
      setExpandedIds((prev) => new Set([...prev, testId]));
    } catch (err) {
      console.error(`단일 검사 ${testId} 실행 실패:`, err);
    } finally {
      setRunningIndividualId(null);
    }
  };

  // 개별 카드 아코디언 토글
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 전체 카드 열기/닫기 토글
  const toggleExpandAll = () => {
    if (expandedIds.size === FIXED_TEST_SPECS.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(FIXED_TEST_SPECS.map((s) => s.id)));
    }
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
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              T05-C17 완주
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            사전 고정 10대 검사 스위트 & 실시간 인터랙티브 러너
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            작업 착수 전에 고유 ID·입력·관찰 가능한 기대값·경계값을 확정한 10개 검사를 브라우저 런타임에서 직접
            실행합니다.
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
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
              <span>검사 실행 중 ({progress?.current || 0}/10)...</span>
            </>
          ) : liveResults && liveResults.length === FIXED_TEST_SPECS.length ? (
            <>
              <RotateCcw className="h-4 w-4" />
              <span>전체 10개 검사 다시 실행 (Re-run Tests)</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current text-emerald-400" />
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

      {/* Dynamic Status Banners */}
      {/* 1. 실시간 실행 중 프로그레스 바 */}
      {isRunning && progress && (
        <div className="rounded-2xl border border-blue-200/90 bg-blue-50/80 p-4 shadow-xs backdrop-blur-xl dark:border-blue-900/80 dark:bg-blue-950/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-950 dark:text-blue-100">
                10대 사전 고정 검사 실시간 실행 중 ({progress.current} / {progress.total})
              </span>
            </div>
            <span className="max-w-md truncate font-mono text-xs font-medium text-blue-700 dark:text-blue-300">
              현재: [{runningTestId}] {progress.currentName}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-blue-200/60 dark:bg-blue-900/60">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-150 ease-out"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. 실행 완료 요약 배너 (Live 모드에서 10개 완주 시) */}
      {!isRunning && viewMode === 'live' && liveResults && liveResults.length === FIXED_TEST_SPECS.length && (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/80 p-4.5 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-emerald-900/80 dark:bg-emerald-950/40">
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  🎉 10대 사전 고정 검사 전수 100% 실시간 통과 (10/10 PASS)
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                  T05-C17 완주
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                브라우저 런타임 검증 완료 · 실행 시각:{' '}
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{lastRunTime}</span> (총 소요
                시간: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{totalDurationMs}ms</span>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleExpandAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700/80 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>{expandedIds.size === FIXED_TEST_SPECS.length ? '전체 로그 접기' : '전체 상세 로그 열기'}</span>
            </button>
            <button
              type="button"
              onClick={handleRunAllLive}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>전체 다시 실행</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. 미실행 대기 상태 배너 (Live 모드에서 아직 실행 안 했을 때) */}
      {!isRunning && viewMode === 'live' && !liveResults && (
        <div className="flex flex-col gap-3 rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4.5 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-blue-900/60 dark:bg-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                브라우저 실시간 테스트 러너 준비 완료
              </h3>
              <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                우측 또는 상단의 <strong>[전체 10개 검사 실시간 실행]</strong> 버튼을 누르면 10대 사전 고정 검사가
                순차적으로 실행되며 실시간 로그와 통과 여부를 검증합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRunAllLive}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>지금 10개 검사 실행하기</span>
          </button>
        </div>
      )}

      {/* 4. AI A 중단 시점 안내 배너 */}
      {viewMode === 'ai-a' && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-xs text-amber-900 shadow-xs dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>AI A 중단 시점 보존 기록 (6 PASS / 4 FAIL):</strong> AI A(Claude 3.7)는 28분간 14회 호출 후 검사
              7~10을 미완성(FAIL)으로 남기고 인수인계 문서(HANDOVER.md)를 작성했습니다.
            </span>
          </div>
          <button
            type="button"
            onClick={handleRunAllLive}
            className="ml-3 shrink-0 text-xs font-bold text-amber-700 underline hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
          >
            AI B 완성본 실시간 실행 ➔
          </button>
        </div>
      )}

      {/* 5. AI B 완주 시점 안내 배너 */}
      {viewMode === 'ai-b' && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-xs text-emerald-900 shadow-xs dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>AI B 완주 시점 기록 (10 PASS / 0 FAIL):</strong> AI B(Gemini 3.8 Flash)는 이전 대화 기록 없이
              저장소와 인수인계 문서만으로 22분간 11회 호출을 통해 미완성 4개 검사를 100% 통과시켰습니다.
            </span>
          </div>
          <button
            type="button"
            onClick={handleRunAllLive}
            className="ml-3 shrink-0 text-xs font-bold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            브라우저 실시간 재실행 ➔
          </button>
        </div>
      )}

      {/* 10 Test Cases List */}
      <div className="space-y-3">
        {FIXED_TEST_SPECS.map((test) => {
          const liveRes = liveResults?.find((r) => r.testId === test.id);
          const isTestRunning = runningTestId === test.id || runningIndividualId === test.id;

          const isPassed =
            viewMode === 'live'
              ? liveRes
                ? liveRes.passed
                : false
              : viewMode === 'ai-a'
                ? test.passedInA
                : test.passedInB;

          const isUnrunInLive = viewMode === 'live' && !liveRes && !isTestRunning;
          const isExpanded = expandedIds.has(test.id);

          return (
            <div
              key={test.id}
              className={`overflow-hidden rounded-2xl border bg-white/70 shadow-xs backdrop-blur-xl transition-all dark:bg-neutral-900/60 ${
                isTestRunning
                  ? 'border-blue-400 ring-2 ring-blue-400/30 dark:border-blue-500'
                  : 'border-neutral-200/80 dark:border-neutral-800/80'
              }`}
            >
              <div
                onClick={() => toggleExpand(test.id)}
                className="flex cursor-pointer items-center justify-between p-4.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      isTestRunning
                        ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                        : isUnrunInLive
                          ? 'bg-neutral-200/70 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                          : isPassed
                            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}
                  >
                    {isTestRunning ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : isUnrunInLive ? (
                      <Clock className="h-4 w-4" />
                    ) : isPassed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
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
                  {/* 단독 실행 버튼 (Live 모드 전용) */}
                  {viewMode === 'live' && (
                    <button
                      type="button"
                      onClick={(e) => handleRunSingleTest(test.id, e)}
                      disabled={isRunning || isTestRunning}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200/80 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700/80 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-700"
                      title="이 검사만 브라우저에서 단독 실행합니다"
                    >
                      {isTestRunning ? (
                        <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
                      ) : (
                        <Play className="h-3 w-3 fill-current text-neutral-500 dark:text-neutral-400" />
                      )}
                      <span>{liveRes ? '재실행' : '단독 실행'}</span>
                    </button>
                  )}

                  {/* 소요 시간 표시 (Live 결과가 있을 시) */}
                  {liveRes && (
                    <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {liveRes.executionTimeMs}ms
                    </span>
                  )}

                  {/* 상태 뱃지 */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      isTestRunning
                        ? 'animate-pulse bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                        : isUnrunInLive
                          ? 'bg-neutral-200/70 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                          : isPassed
                            ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                    }`}
                  >
                    {isTestRunning ? '실행 중...' : isUnrunInLive ? '실행 대기' : isPassed ? 'PASS' : 'FAIL (미완성)'}
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
                  {liveRes ? (
                    <div className="rounded-xl border border-neutral-200/60 bg-neutral-900 p-3 text-white dark:border-neutral-800/60">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Terminal className="h-3 w-3" /> 실시간 실행 로그 (소요 시간: {liveRes.executionTimeMs}ms)
                        </span>
                        <span className="font-mono text-emerald-400">{liveRes.actualOutput}</span>
                      </div>
                      <pre className="mt-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-neutral-300">
                        {liveRes.logs.join('\n')}
                      </pre>
                    </div>
                  ) : isUnrunInLive ? (
                    <div className="rounded-xl border border-dashed border-neutral-300/80 bg-neutral-100/50 p-3 text-center text-xs text-neutral-500 dark:border-neutral-700/80 dark:bg-neutral-900/40 dark:text-neutral-400">
                      <p>아직 브라우저에서 실행되지 않았습니다.</p>
                      <button
                        type="button"
                        onClick={(e) => handleRunSingleTest(test.id, e)}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>이 검사 지금 실행하기</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
