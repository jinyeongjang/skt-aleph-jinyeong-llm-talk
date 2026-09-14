import React from 'react';
import { CheckCircle2, ListChecks, Moon, Send, ShieldCheck, Sparkles, Sun } from 'lucide-react';

interface HeaderProps {
  onOpenCriteria: () => void;
  onOpenSecurity: () => void;
  onOpenSubmission: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCriteria,
  onOpenSecurity,
  onOpenSubmission,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200/70 bg-white/75 shadow-xs backdrop-blur-xl transition-all dark:border-neutral-800/70 dark:bg-neutral-950/75 dark:shadow-neutral-950/40">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: Title & Status Badges */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900/90 text-white shadow-xs backdrop-blur-xs dark:bg-neutral-100/90 dark:text-neutral-900">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                <span>과제 5: 대화가 끊겨도 이어지는 프로젝트</span>
                <span className="hidden rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 sm:inline-block dark:bg-neutral-800 dark:text-neutral-300">
                  LLM Handover Benchmark
                </span>
              </h1>
              <p className="hidden text-[11px] text-neutral-500 sm:block dark:text-neutral-400">
                인수인계 문서만으로 새 세션(다른 모델)이 10대 고정 검사를 100% 완주
              </p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="hidden items-center gap-2 border-l border-neutral-200/80 pl-3 lg:flex dark:border-neutral-800/80">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> 10/10 PASS
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <ShieldCheck className="h-3 w-3" /> 인수인계 100% 일치
            </span>
          </div>
        </div>

        {/* Center: Quick Anchor Navigation */}
        <nav className="hidden items-center gap-1 text-xs font-medium text-neutral-600 xl:flex dark:text-neutral-300">
          <a
            href="#benchmark"
            className="dark:hover:bg-neutral-850 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white"
          >
            비교 보고서
          </a>
          <a
            href="#fixed-tests"
            className="dark:hover:bg-neutral-850 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white"
          >
            고정 검사 10선
          </a>
          <a
            href="#handover"
            className="dark:hover:bg-neutral-850 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white"
          >
            7칸 인수인계
          </a>
          <a
            href="#weather"
            className="dark:hover:bg-neutral-850 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:text-white"
          >
            멀티 관측소
          </a>
        </nav>

        {/* Right: Modals & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* 통과 기준 37선 모달 버튼 */}
          <button
            type="button"
            onClick={onOpenCriteria}
            className="dark:hover:bg-neutral-850 flex items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs backdrop-blur-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:border-neutral-700"
          >
            <ListChecks className="h-3.5 w-3.5 text-neutral-500" />
            <span className="hidden sm:inline">통과 기준</span>
          </button>

          {/* 보안 감사 모달 버튼 */}
          <button
            type="button"
            onClick={onOpenSecurity}
            className="dark:hover:bg-neutral-850 flex items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs backdrop-blur-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:border-neutral-700"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">보안 감사</span>
          </button>

          {/* 공식 제출 모달 버튼 */}
          <button
            type="button"
            onClick={onOpenSubmission}
            className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <Send className="h-3.5 w-3.5" />
            <span>제출문</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="dark:hover:bg-neutral-850 flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200/80 bg-white/70 text-neutral-600 shadow-2xs backdrop-blur-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:border-neutral-700"
            title="테마 전환"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
