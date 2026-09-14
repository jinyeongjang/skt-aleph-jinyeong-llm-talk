import React from 'react';
import { Code2, GitCommit } from 'lucide-react';

export const Footer: React.FC = () => {
  const commitHash = '942cf9de4238292e4128746b63a786dd640d8bf1';

  return (
    <footer className="mt-16 border-t border-neutral-200/70 bg-white/50 py-10 backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:flex-row sm:px-6 dark:text-neutral-400">
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white">
            과제 5: 대화가 끊겨도 이어지는 프로젝트 (LLM Handover Benchmark)
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-400">
            비개인 공개 기상 관측망(Open-Meteo) 기반 · 무로그인 공개 정적 웹 · 비밀키 0건 · 개인정보 0건
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-300">
          <a
            href="https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            <Code2 className="h-4 w-4" />
            <span>GitHub 소스</span>
          </a>

          <a
            href={`https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/${commitHash}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-mono text-[11px] transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            <GitCommit className="h-3.5 w-3.5" />
            <span>{commitHash.slice(0, 8)}</span>
          </a>

          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span className="text-[11px]">MIT License</span>
        </div>
      </div>
    </footer>
  );
};
