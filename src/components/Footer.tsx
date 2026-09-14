import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-neutral-200/70 bg-white/50 py-10 backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:flex-row sm:px-6 dark:text-neutral-400">
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white">
            대화가 끊겨도 이어지는 프로젝트 (LLM Handover Benchmark)
          </p>
        </div>
      </div>
    </footer>
  );
};
