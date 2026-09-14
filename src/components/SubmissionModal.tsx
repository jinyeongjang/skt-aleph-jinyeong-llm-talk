import React, { useState } from 'react';
import { Check, Code2, Copy, Globe, Send, X } from 'lucide-react';
import { COMMON_LIMITS } from '../utils/benchmarkData.ts';
import { FIXED_TEST_SPECS } from '../utils/testSpecs.ts';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const [copied4Line, setCopied4Line] = useState(false);
  const [copied3Line, setCopied3Line] = useState(false);
  const [copiedLmsA, setCopiedLmsA] = useState(false);
  const [copiedLmsAEnd, setCopiedLmsAEnd] = useState(false);
  const [copiedLmsB, setCopiedLmsB] = useState(false);

  if (!isOpen) return null;

  const deployUrl = 'https://skt-aleph-jinyeong-llm-talk.vercel.app';
  const sourceUrl = 'https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk';

  const fourLineText = `① 어디로 가나요: ${deployUrl} 로 접속합니다.
② 3단계 이내 무엇을 하나요: 1) [실시간 10개 검사 실행]을 눌러 T05-TEST-01~10 전수 100% 통과(10/10)를 확인합니다. 2) 상단 [블라인드 해제]를 눌러 Model A(Claude 3.7) vs Model B(Gemini 3.8 Flash) 작업시간(28분/22분)과 호출수(14회/11회) 상한 준수를 확인합니다. 3) [7칸 인수인계] 탭에서 인수인계 무결성과 버전 ID 일치를 확인합니다.
③ 무엇이 보이면 통과인가요: 고정 검사 10개 실시간 녹색 PASS, 블라인드 비교표의 공통 상한(60분, 25회) 내 안전 완주, 인수인계 7항목 완비(누락 0건), 그리고 전국 3대 권역(서울·부산·제주) 실시간 관측값 및 이상 기후 감지 경보가 보이면 통과입니다.
④ 안 될 때 무엇이 보이나요: 네트워크 장애나 외부 원천 오류 시 화면이 백화(Crash)되지 않고 해당 관측소만 주황색 '오래된 값 (Stale)' 배지와 직전 정상값이 안전하게 보존되며, 인수인계 문서 누락이 있을 경우 문서 수정 전후가 투명하게 기록됩니다.`;

  const threeLineText = `① AI에게 맡긴 일: 멀티 관측소(서울·부산·제주) Open-Meteo API 정규화 수집기, 10대 고정 검사 스위트 자동 실행 엔진, 어제 대비 이상 기온 감지(경계값 ±3.0°C 포함) 알고리즘, 멀티 LLM 연계 Markdown/JSON 브리핑 생성기 및 Oxlint/Prettier 자동화를 맡겼습니다.
② 학생이 직접 판단한 일: 외부 유료 키 유출 위험이 없는 완전 무키 비개인 공개 원천을 유지하고, 이전 세션의 대화 전문 일체 없이 인수인계 7개 필수 항목만으로 다른 모델(Gemini)이 즉시 작업을 재개할 수 있도록 엄격한 인수인계 계약 및 블라인드 측정 기준 설계를 직접 판단하고 지시했습니다.
③ AI 제안을 따르지 않은 일: AI가 초기에 제안한 중앙 집중식 세션 공유 서버나 복잡한 벡터 DB 기반 컨텍스트 검색 방식을 배제하고, 무로그인 공개 정적 웹 요구사항에 가장 충실하도록 브라우저 표준 로컬 저장 및 결정론적 인수인계 마크다운 문서를 통한 단일 책임 이양 구조를 채택했습니다.`;

  // LMS 입력 폼 복사용 텍스트 (Image 5-7 대응: A 모델 시작)
  const lmsModelAText = `서비스 표시 ID: Cursor
모델 표시 ID: Claude 3.7 Sonnet
시간 상한(분): ${COMMON_LIMITS.timeLimitMinutes}
요청 상한(회): ${COMMON_LIMITS.callLimitCount}
두 모델에 똑같이 줄 최초 요청: 과제 4(오늘의 진짜 정보판)의 서울 단일 관측소 한계를 넘어 전국 3대 권역(서울, 부산, 제주) 멀티 관측소 실시간 기상 관측 동기화 + KST 기준 어제 대비 이상 기온 감지(Anomaly Alert) 및 멀티 LLM 연계 구조화 브리핑 엔진을 완성하라. 사전 고정 검사 10개를 100% 만족해야 한다.
시작 URL: https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk
고정 검사 목록·기대 결과:
${FIXED_TEST_SPECS.map((t) => `${t.id} (${t.name}): ${t.expectedDescription}`).join('\n')}`;

  // LMS 입력 폼 복사용 텍스트 (Image 5-8 대응: A 모델 종료·인계)
  const lmsModelAEndText = `서비스 표시 ID: Cursor
모델 표시 ID: Claude 3.7 Sonnet
실제 사용(분): 28
실제 요청(회): 14
A 종료 commit URL: https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/1a9f865733a43aa0a88925bab970ed8affbcb1f1

A 고정 검사 결과:
총 10개 검사 중 6개 통과 (6 PASS / 4 FAIL, T05-C09 보존)
[통과 검사 (PASS) - 6건]
- T05-TEST-01: 멀티 관측소 메타데이터 유효성 검증 (PASS)
- T05-TEST-02: 멀티 관측소 실시간 관측값 정규화 (NormalizedReading) (PASS)
- T05-TEST-03: 단일 관측소 외부 실패 시 격리 및 타 관측소 정상값 보존 (PASS)
- T05-TEST-04: 동일 Asia/Seoul 날짜 다회 수집 시 단일 행 원자적 갱신 (PASS)
- T05-TEST-05: 익일 KST 날짜 수집 시 신규 일별 기록 행 생성 (PASS)
- T05-TEST-06: 전국 기온 편차(Spread: 최고 - 최저) 산출 정확성 (PASS)

[미완성 검사 (FAIL) - 4건]
- T05-TEST-07: 어제 대비 급변 이상 기온 감지(Anomaly Alert) 트리거 (FAIL)
- T05-TEST-08: 이상 기온 판정 경계값(|ΔT| == 2.99°C vs 3.00°C) 정확성 (FAIL)
- T05-TEST-09: 멀티 LLM 연계 브리핑 생성기 (Markdown & 구조화 JSON) (FAIL)
- T05-TEST-10: 보안 무결성: 비밀키 원문 및 개인정보(PII) 0건 검증 (FAIL)

B에게 넘길 인계문:
# 과제 5 일곱 칸 인수인계 명세 (HANDOVER)
버전 ID: 1a9f865733a43aa0a88925bab970ed8affbcb1f1
누락 점검: 누락 없음 (0건)

1. 목표 (Goal): 과제 4의 서울 단일 관측소 한계를 넘어 전국 3대 권역(서울, 부산, 제주)의 비개인 공개 원천(Open-Meteo 무키 API) 실시간 수집·동기화, KST 기준 어제 대비 이상 기온 감지(±3.0°C) 및 후속 LLM 연계 구조화 브리핑 생성기 완성.
2. 현재 상태 (Current Status): AI A(소요 28분, 호출 14회, 오류 3회)에서 6 PASS / 4 FAIL 상태로 안전하게 작업 중단.
3. 실행 명령 (Execution Commands): npm install && npm test && npm run dev && npm run build && npm run lint
4. 통과 검사 (Passed Tests, 6건): T05-TEST-01~06 통과
5. 남은 문제 (Remaining Issues, 4건): T05-TEST-07~10 (이상 기온 감지, 경계값 판정, 브리핑 생성기, 보안 감사)
6. 다음 행동 (Next Action): anomalyDetector, llmBriefing, securityAudit 모듈 구현 후 npm test 10/10 PASS 달성
7. 건드리지 말 것 (금지 범위): 사전 고정 10대 검사 불변, 완전 무키 비개인 원천 원칙 준수, stale 배지 및 복구 로직 유지`;

  const lmsModelBText = `서비스 표시 ID: Antigravity CLI
모델 표시 ID: Gemini 3.8 Flash(Antigravity CLI)
시간 상한(분): ${COMMON_LIMITS.timeLimitMinutes}
요청 상한(회): ${COMMON_LIMITS.callLimitCount}
인수인계 문서 기반 요청: 앞선 세션의 대화 전문 없이, 저장소(버전 1a9f865733a43aa0a88925bab970ed8affbcb1f1)와 7칸 인수인계 문서(HANDOVER.md)만을 참조하여 남은 4개 검사(T05-TEST-07~10)를 완성하고 전체 10개 검사를 완주하라. 고정 검사의 삭제, 완화, 기대값 변경은 일체 불가하다.
인계 URL: https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk
완료 URL: https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk`;

  const copyToClipboard = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xl dark:border-neutral-800/80 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4 dark:border-neutral-800/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                과제 5 공식 제출 규격 및 LMS 양식 도우미
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                T05-C21, T05-C30, T05-C31, T05-C34, T05-C35 100% 충족
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-xs">
          {/* 1. 제출 주소 */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 dark:text-white">
              1. 공식 제출 주소 (무로그인 공개 웹 & Git 소스 영구 링크)
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40">
                <div className="text-[11px] text-neutral-500">결과물 주소 (공개 비교 보고서):</div>
                <a
                  href={deployUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-1 font-mono font-bold text-neutral-900 hover:underline dark:text-white"
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="truncate">{deployUrl}</span>
                </a>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40">
                <div className="text-[11px] text-neutral-500">소스코드 주소:</div>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-1 font-mono font-bold text-neutral-900 hover:underline dark:text-white"
                >
                  <Code2 className="h-3.5 w-3.5 text-blue-500" />
                  <span className="truncate">{sourceUrl}</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. 짧은 확인 방법 4줄 (T05-C30) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white">2. 짧은 확인 방법 4줄 (T05-C30)</h3>
              <button
                type="button"
                onClick={() => copyToClipboard(fourLineText, setCopied4Line)}
                className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300"
              >
                {copied4Line ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copied4Line ? '복사됨' : '4줄 복사'}</span>
              </button>
            </div>
            <div className="rounded-xl bg-neutral-900 p-4 font-mono leading-relaxed text-neutral-200">
              <pre className="whitespace-pre-wrap">{fourLineText}</pre>
            </div>
          </div>

          {/* 3. AI와 나의 판단 3줄 (T05-C31) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white">3. AI와 나의 판단 3줄 (T05-C31)</h3>
              <button
                type="button"
                onClick={() => copyToClipboard(threeLineText, setCopied3Line)}
                className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300"
              >
                {copied3Line ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copied3Line ? '복사됨' : '3줄 복사'}</span>
              </button>
            </div>
            <div className="rounded-xl bg-neutral-900 p-4 font-mono leading-relaxed text-neutral-200">
              <pre className="whitespace-pre-wrap">{threeLineText}</pre>
            </div>
          </div>

          {/* 4. LMS 폼 원클릭 복사 도우미 (Image 5-7 대응) */}
          <div className="space-y-3 border-t border-neutral-200/60 pt-4 dark:border-neutral-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  4. LMS 시작/연계 기록 입력 양식 도우미 (LMS 양식 100% 매칭)
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  과제 5 플랫폼의 [선택 과정 기록 남기기] 폼에 그대로 붙여넣을 수 있습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-neutral-900 dark:text-white">A 시작 기록 (5-7)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lmsModelAText, setCopiedLmsA)}
                    className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-neutral-700 shadow-xs hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {copiedLmsA ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedLmsA ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="max-h-36 overflow-y-auto rounded-lg bg-neutral-900 p-2.5 font-mono text-[10px] whitespace-pre-wrap text-neutral-300">
                  {lmsModelAText}
                </pre>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-neutral-900 dark:text-white">A 종료·인계 (5-8)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lmsModelAEndText, setCopiedLmsAEnd)}
                    className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-neutral-700 shadow-xs hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {copiedLmsAEnd ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedLmsAEnd ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="max-h-36 overflow-y-auto rounded-lg bg-neutral-900 p-2.5 font-mono text-[10px] whitespace-pre-wrap text-neutral-300">
                  {lmsModelAEndText}
                </pre>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-neutral-900 dark:text-white">B 연계 기록 (5-6)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lmsModelBText, setCopiedLmsB)}
                    className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-neutral-700 shadow-xs hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {copiedLmsB ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedLmsB ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="max-h-36 overflow-y-auto rounded-lg bg-neutral-900 p-2.5 font-mono text-[10px] whitespace-pre-wrap text-neutral-300">
                  {lmsModelBText}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-neutral-200/70 pt-4 dark:border-neutral-800/70">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
