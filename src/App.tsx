import React, { useEffect, useState } from 'react';
import { BlindBenchmarkSection } from './components/BlindBenchmarkSection.tsx';
import { CriteriaModal } from './components/CriteriaModal.tsx';
import { FixedTestsSection } from './components/FixedTestsSection.tsx';
import { Footer } from './components/Footer.tsx';
import { HandoverSection } from './components/HandoverSection.tsx';
import { Header } from './components/Header.tsx';
import { MultiStationLiveSection } from './components/MultiStationLiveSection.tsx';
import { SecurityAuditModal } from './components/SecurityAuditModal.tsx';
import { SubmissionModal } from './components/SubmissionModal.tsx';

export const App: React.FC = () => {
  // 테마 상태 (다크 모드 / 라이트 모드)
  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // 모달 상태
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-neutral-50 font-sans text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      {/* 0. Ambient Glass Background Lighting (모노크롬 & 은은한 글래스모피즘 앰비언트 광원) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-neutral-400/15 blur-[100px] dark:bg-neutral-600/10" />
        <div className="absolute top-1/4 -right-40 h-125 w-125 rounded-full bg-emerald-500/10 blur-[130px] dark:bg-emerald-500/[0.07]" />
        <div className="absolute top-2/3 -left-32 h-112.5 w-112.5 rounded-full bg-teal-500/10 blur-[120px] dark:bg-teal-500/6" />
        <div className="absolute right-1/4 -bottom-40 h-137.5 w-137.5 rounded-full bg-neutral-400/10 blur-[140px] dark:bg-neutral-600/10" />
        <div className="bg-ambient-pattern absolute inset-0 opacity-40 dark:opacity-20" />
      </div>

      {/* 1. 상단 고정 헤더 (Fixed Header) */}
      <Header
        onOpenCriteria={() => setIsCriteriaOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenSubmission={() => setIsSubmissionOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* 2. 메인 컨테이너 (헤더 높이 pt-20 sm:pt-24 오프셋 보장) */}
      <main className="mx-auto max-w-7xl space-y-12 px-4 pt-20 sm:px-6 sm:pt-24">
        {/* 섹션 1: 이름을 가린 비교 보고서 (Card 5) */}
        <BlindBenchmarkSection />

        {/* 섹션 2: 사전 고정 10대 검사 스위트 & 실시간 인터랙티브 러너 (Card 1, Card 2, Card 4) */}
        <FixedTestsSection />

        {/* 섹션 3: 일곱 칸 인수인계 명세 & 무결성 대조기 (Card 3, Card 4) */}
        <HandoverSection />

        {/* 섹션 4: 실제 완성된 개선 기능 (전국 3대 권역 실시간 기상 관측 및 이상 기후 감지 + LLM 브리핑) */}
        <MultiStationLiveSection />
      </main>

      {/* 3. 푸터 */}
      <Footer />

      {/* 4. 모달 다이얼로그 */}
      <CriteriaModal isOpen={isCriteriaOpen} onClose={() => setIsCriteriaOpen(false)} />
      <SecurityAuditModal isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />
      <SubmissionModal isOpen={isSubmissionOpen} onClose={() => setIsSubmissionOpen(false)} />
    </div>
  );
};

export default App;
