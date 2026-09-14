import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-neutral-200/70 bg-white/50 py-10 backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:flex-row sm:px-6 dark:text-neutral-400">
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white">
            과제 5: 대화가 끊겨도 이어지는 프로젝트 (LLM Handover Benchmark)
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            SKT ALEPH Personal Project · 무로그인 공개 정적 웹 (T05-C21)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-300">
          <a
            href="https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
};
