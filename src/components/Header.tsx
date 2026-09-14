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
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200/70 bg-white/80 shadow-xs backdrop-blur-xl transition-all dark:border-neutral-800/70 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              대화가 끊겨도 이어지는 프로젝트
            </h1>
            <span className="hidden items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 sm:inline-flex dark:bg-emerald-500/20 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> 10/10 PASS
            </span>
          </div>
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* 통과 기준 모달 */}
          <button
            type="button"
            onClick={onOpenCriteria}
            className="dark:hover:bg-neutral-850 flex items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs backdrop-blur-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:border-neutral-700"
            title="통과 기준 37선"
          >
            <ListChecks className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="hidden md:inline">통과 기준</span>
          </button>

          {/* 보안 감사 모달 */}
          <button
            type="button"
            onClick={onOpenSecurity}
            className="dark:hover:bg-neutral-850 flex items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs backdrop-blur-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:border-neutral-700"
            title="보안 감사"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">보안 감사</span>
          </button>

          {/* 공식 제출 모달 */}
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
