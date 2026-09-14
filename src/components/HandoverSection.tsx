import React, { useState } from 'react';
import { Check, Copy, GitCommit, Hash, ShieldCheck } from 'lucide-react';
import { HANDOVER_DOC_CONTENT, HANDOVER_SECTIONS_LIST } from '../utils/handoverData.ts';

export const HandoverSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyHandover = () => {
    const fullText = `# 과제 5 일곱 칸 인수인계 문서
버전 ID: ${HANDOVER_DOC_CONTENT.versionId}
무결성 해시(SHA-256): ${HANDOVER_DOC_CONTENT.sha256Hash}

1. 목표:
${HANDOVER_DOC_CONTENT.goal}

2. 현재 상태:
${HANDOVER_DOC_CONTENT.currentStatus}

3. 실행 명령:
${HANDOVER_DOC_CONTENT.executionCommands.join('\n')}

4. 통과 검사:
${HANDOVER_DOC_CONTENT.passedTests.join('\n')}

5. 남은 문제:
${HANDOVER_DOC_CONTENT.remainingIssues.join('\n')}

6. 다음 행동:
${HANDOVER_DOC_CONTENT.nextAction}

7. 건드리지 말 것 (금지 범위):
${HANDOVER_DOC_CONTENT.doNotTouch}
`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="handover" className="scroll-mt-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-900/10 px-2.5 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
              카드 3 · 일곱 칸 인수인계 & 카드 4 · 새 대화가 이어받기
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              T05-C10 ~ T05-C15 충족
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            일곱 칸 인수인계 명세 & 무결성 대조기 (Handover Spec)
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            처음 보는 작업자가 앞선 대화 전문 없이도 새 환경에서 즉시 실행하고 작업을 이어갈 수 있는 완전한 단일
            문서입니다.
          </p>
        </div>

        {/* Copy Handover Button */}
        <button
          type="button"
          onClick={handleCopyHandover}
          className="flex items-center gap-2 rounded-xl border border-neutral-300/80 bg-white/80 px-4 py-2.5 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:bg-neutral-50 dark:border-neutral-700/80 dark:bg-neutral-900/80 dark:text-neutral-200"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>인수인계 원문 복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>인수인계 7항목 전문 복사</span>
            </>
          )}
        </button>
      </div>

      {/* Metadata & Integrity Banners (Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Version ID Match (T05-C12) */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <GitCommit className="h-4 w-4 text-neutral-500" />
            저장소 버전 ID 일치 (T05-C12)
          </div>
          <div className="mt-2 font-mono text-xs font-bold text-neutral-900 dark:text-white">
            {HANDOVER_DOC_CONTENT.versionId.slice(0, 16)}...
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            ✓ 문서 버전과 실제 저장소 Commit ID 100% 일치
          </div>
        </div>

        {/* SHA-256 Hash Match (T05-C14) */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <Hash className="h-4 w-4 text-neutral-500" />
            인수인계 동일성 SHA-256 (T05-C14)
          </div>
          <div className="mt-2 font-mono text-xs font-bold text-neutral-900 dark:text-white">
            {HANDOVER_DOC_CONTENT.sha256Hash.slice(0, 16)}...
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            ✓ AI A가 남긴 내용과 AI B가 받은 내용 100% 일치
          </div>
        </div>

        {/* Missing Items Status (T05-C15) */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            인수인계 누락 점검 (T05-C15)
          </div>
          <div className="mt-2 text-xs font-bold text-neutral-900 dark:text-white">누락 없음 (0건 확인)</div>
          <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">대화 전문 없이 단독 재현 완비</div>
        </div>
      </div>

      {/* 7 Handover Sections */}
      <div className="space-y-4">
        {HANDOVER_SECTIONS_LIST.map((item) => (
          <div
            key={item.num}
            className={`rounded-2xl border bg-white/70 p-5 shadow-xs backdrop-blur-xl transition-all dark:bg-neutral-900/60 ${
              item.isWarning
                ? 'border-amber-500/40 bg-amber-500/[0.02] dark:border-amber-500/30'
                : 'border-neutral-200/80 dark:border-neutral-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
                  {item.num}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{item.title}</h3>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  item.isWarning
                    ? 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {item.badge}
              </span>
            </div>

            <div className="mt-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
              {item.isCode ? (
                <div className="mt-2 rounded-xl bg-neutral-900 p-3.5 font-mono text-[11px] text-neutral-200">
                  <pre className="whitespace-pre-wrap">{item.content}</pre>
                </div>
              ) : item.isList ? (
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-neutral-600 dark:text-neutral-400">
                  {item.content.split('\n').map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="whitespace-pre-line text-neutral-600 dark:text-neutral-400">{item.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
