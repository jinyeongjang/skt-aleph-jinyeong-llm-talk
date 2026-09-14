import React, { useState } from 'react';
import { Check, Code2, Copy, ExternalLink, Globe, Layers, Send, X } from 'lucide-react';
import { COMMON_LIMITS } from '../utils/benchmarkData.ts';
import { FIXED_TEST_SPECS } from '../utils/testSpecs.ts';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const [copiedDeployUrl, setCopiedDeployUrl] = useState(false);
  const [copiedSourceUrl, setCopiedSourceUrl] = useState(false);
  const [copied4Line, setCopied4Line] = useState(false);
  const [copied3Line, setCopied3Line] = useState(false);
  const [copiedLmsA, setCopiedLmsA] = useState(false);
  const [copiedLmsAEnd, setCopiedLmsAEnd] = useState(false);
  const [copiedLmsBStart, setCopiedLmsBStart] = useState(false);
  const [copiedLmsBEnd, setCopiedLmsBEnd] = useState(false);

  if (!isOpen) return null;

  const deployUrl = 'https://skt-aleph-jinyeong-llm-talk.vercel.app';
  const sourceUrl = 'https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk';

  const fourLineText = `① 어디로 가나요: ${deployUrl} 로 접속합니다.
② 3단계 이내 무엇을 하나요: 1) 상단 [사전 고정 10대 검사] 섹션에서 [전체 10개 검사 실시간 실행]을 눌러 T05-TEST-01~10 전수 100% 통과(10/10 PASS)를 확인합니다. 2) 상단 [블라인드 해제]를 눌러 Model A(Claude 3.7) vs Model B(Gemini 3.8 Flash) 작업시간(28분/22분)과 호출수(14회/11회) 공통 상한 준수를 확인합니다. 3) [7칸 인수인계] 섹션에서 인수인계 무결성(누락 0건)과 저장소 버전 ID 일치를 확인합니다.
③ 무엇이 보이면 통과인가요: 고정 검사 10개 전수 실시간 초록색 PASS, 블라인드 비교표의 공통 상한(60분, 25회) 내 안전 완주, 인수인계 7항목 완비, 그리고 전국 3대 권역(서울·부산·제주) 실시간 관측값 및 어제 대비 이상 기온 감지(±3.0°C 경계값) 경보가 보이면 통과입니다.
④ 안 될 때 무엇이 보이나요: 외부 API 오류나 네트워크 장애 시 전체 화면이 백화(Crash)되지 않고 해당 관측소만 주황색 '오래된 값 (Stale)' 배지와 직전 정상값이 안전하게 보존되며, 인수인계 문서 누락이 있을 경우 수정 전후가 투명하게 기록됩니다.`;

  const threeLineText = `① AI에게 맡긴 일: 멀티 관측소(서울·부산·제주) Open-Meteo API 정규화 수집기, 10대 고정 검사 스위트 실시간 자동 실행 엔진, 어제 대비 이상 기온 감지(경계값 ±3.0°C 포함) 알고리즘, 멀티 LLM 연계 Markdown/JSON 브리핑 생성기 및 Oxlint/Prettier 자동화를 맡겼습니다.
② 학생이 직접 판단한 일: 외부 유료 키 유출 위험이 없는 완전 무키(Keyless) 비개인 공개 원천을 유지하고, 이전 세션의 대화 전문 일체 없이 인수인계 7개 필수 항목만으로 다른 모델(Gemini)이 즉시 작업을 이어받을 수 있도록 엄격한 인수인계 계약 및 블라인드 측정 기준 설계를 직접 판단하고 지시했습니다.
③ AI 제안을 따르지 않은 일: AI가 초기에 제안한 중앙 집중식 세션 공유 서버나 복잡한 벡터 DB 기반 컨텍스트 검색 방식을 배제하고, 무로그인 공개 정적 웹 요구사항에 가장 충실하도록 브라우저 표준 로컬 저장 및 결정론적 인수인계 마크다운 문서를 통한 단일 책임 이양 구조를 채택했습니다.`;

  // LMS 입력 폼 복사용 텍스트 (Image 5-7 대응: A 모델 시작)
  const lmsModelAText = `서비스 표시 ID: Cursor
모델 표시 ID: Claude 3.7 Sonnet
시간 상한(분): ${COMMON_LIMITS.timeLimitMinutes}
요청 상한(회): ${COMMON_LIMITS.callLimitCount}
두 모델에 똑같이 줄 최초 요청: 과제 4(오늘의 진짜 정보판)의 서울 단일 관측소 한계를 넘어 전국 3대 권역(서울, 부산, 제주) 멀티 관측소 실시간 기상 관측 동기화 + KST 기준 어제 대비 이상 기온 감지(Anomaly Alert) 및 멀티 LLM 연계 구조화 브리핑 엔진을 완성하라. 사전 고정 검사 10개를 100% 만족해야 한다.
시작 commit URL: https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/1a9f865733a43aa0a88925bab970ed8affbcb1f1
고정 검사 목록·기대 결과:
${FIXED_TEST_SPECS.map((t) => `${t.id} (${t.name}): ${t.expectedDescription}`).join('\n')}`;

  // LMS 입력 폼 복사용 텍스트 (Image 5-8 대응: A 모델 종료·인계)
  const lmsModelAEndText = `서비스 표시 ID: Cursor
모델 표시 ID: Claude 3.7 Sonnet
실제 사용(분): 28
실제 요청(회): 14
A 종료 commit URL: https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/3f70c5a0fa96d9b882dc16714bfefe89405d5c66

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
버전 ID: 3f70c5a0fa96d9b882dc16714bfefe89405d5c66
누락 점검: 누락 없음 (0건)

1. 목표 (Goal): 과제 4의 서울 단일 관측소 한계를 넘어 전국 3대 권역(수도권 서울, 영남권 부산, 제주권 서귀포)의 비개인 공개 원천(Open-Meteo 무키 API) 실시간 수집·동기화, KST 기준 어제 대비 기온 급변(임계치 ±3.0°C)을 감지하는 이상 기온 감지(Anomaly Alert) 엔진과 후속 LLM 연계를 위한 구조화 브리핑 생성기 완성.
2. 현재 상태 (Current Status): AI A(소요 28분, 호출 14회, 오류 3회)에서 6 PASS / 4 FAIL 상태로 안전하게 작업 중단.
3. 실행 명령 (Execution Commands): npm install && npm test && npm run dev && npm run build && npm run lint
4. 통과 검사 (Passed Tests, 6건): T05-TEST-01~06 통과
5. 남은 문제 (Remaining Issues, 4건): T05-TEST-07~10 (이상 기온 감지, 경계값 판정, 브리핑 생성기, 보안 감사)
6. 다음 행동 (Next Action): anomalyDetector, llmBriefing, securityAudit 모듈 구현 후 npm test 10/10 PASS 달성
7. 건드리지 말 것 (금지 범위): 사전 고정 10대 검사 불변, 완전 무키 비개인 원천 원칙 준수, stale 배지 및 복구 로직 유지`;

  // LMS 입력 폼 복사용 텍스트 (Image 5-9 대응: B 모델 시작)
  const lmsModelBStartText = `서비스 표시 ID(A의 서비스·모델 조합과 달라야 함):
Antigravity CLI

모델 표시 ID(A의 서비스·모델 조합과 달라야 함):
Gemini 3.8 Flash`;

  // LMS 입력 폼 복사용 텍스트 (Image 5-10 대응: B 모델 종료)
  const lmsModelBEndText = `서비스 표시 ID: Antigravity CLI
모델 표시 ID: Gemini 3.8 Flash
실제 사용(분): 22
실제 요청(회): 11
B 종료 commit URL: https://github.com/jinyeongjang/skt-aleph-jinyeong-llm-talk/commit/b884ae864a90fb1f14fb86b4b41993fe03e11679

B 고정 검사 결과:
사전 고정 10대 검사 전수 100% 통과 (10 PASS / 0 FAIL, T05-C17 완주)
[통과 검사 (PASS) - 10건 전수 통과]
- T05-TEST-01: 멀티 관측소 메타데이터 유효성 검증 (PASS)
- T05-TEST-02: 멀티 관측소 실시간 관측값 정규화 (NormalizedReading) (PASS)
- T05-TEST-03: 단일 관측소 외부 실패 시 격리 및 타 관측소 정상값 보존 (PASS)
- T05-TEST-04: 동일 Asia/Seoul 날짜 다회 수집 시 단일 행 원자적 갱신 (PASS)
- T05-TEST-05: 익일 KST 날짜 수집 시 신규 일별 기록 행 생성 (PASS)
- T05-TEST-06: 전국 기온 편차(Spread: 최고 - 최저) 산출 정확성 (PASS)
- T05-TEST-07: 어제 대비 급변 이상 기온 감지(Anomaly Alert) 트리거 (PASS)
- T05-TEST-08: 이상 기온 판정 경계값(|ΔT| == 2.99°C vs 3.00°C) 정확성 (PASS)
- T05-TEST-09: 멀티 LLM 연계 브리핑 생성기 (Markdown & 구조화 JSON) (PASS)
- T05-TEST-10: 보안 무결성: 비밀키 원문 및 개인정보(PII) 0건 검증 (PASS)`;

  const copyToClipboard = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-5">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-6 py-4.5 dark:border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  과제 5 공식 제출 규격 및 LMS 양식 도우미
                </h2>
                <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 sm:inline-block dark:bg-emerald-500/20 dark:text-emerald-300">
                  규격 100% 충족
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                무로그인 공개 웹(T05-C21) · 확인 4줄(T05-C30) · 판단 3줄(T05-C31) · 영구 커밋 링크(T05-C34, C35)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body - 1열 단일 컬럼 전개 */}
        <div className="flex-1 space-y-8 overflow-y-auto p-6 text-xs">
          {/* 1. 공식 제출 주소 (1열 배치) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-neutral-200/70 pb-2 dark:border-neutral-800/70">
              <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                1. 공식 제출 주소 (무로그인 공개 웹 & Git 소스 영구 링크)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* 결과물 주소 */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200/90 bg-neutral-50/80 p-4 sm:flex-row sm:items-center dark:border-neutral-800/90 dark:bg-neutral-950/60">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      결과물 주소 (T05-C21)
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      무로그인 공개 비교 보고서 웹
                    </span>
                  </div>
                  <a
                    href={deployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-900 hover:underline dark:text-white"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">{deployUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-neutral-400" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(deployUrl, setCopiedDeployUrl)}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  {copiedDeployUrl ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedDeployUrl ? '복사 완료' : '주소 복사'}</span>
                </button>
              </div>

              {/* 소스코드 주소 */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200/90 bg-neutral-50/80 p-4 sm:flex-row sm:items-center dark:border-neutral-800/90 dark:bg-neutral-950/60">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                      소스코드 주소 (T05-C34, C35)
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">고정 커밋 해시 영구 링크</span>
                  </div>
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-900 hover:underline dark:text-white"
                  >
                    <Code2 className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                    <span className="truncate">{sourceUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-neutral-400" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(sourceUrl, setCopiedSourceUrl)}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  {copiedSourceUrl ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedSourceUrl ? '복사 완료' : '주소 복사'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. 짧은 확인 방법 4줄 (T05-C30) (1열 배치) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2 dark:border-neutral-800/70">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-neutral-900/10 px-2 py-0.5 text-[11px] font-bold text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
                  T05-C30
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  2. 짧은 확인 방법 4줄 (접속처·단계·통과기준·실패대응)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(fourLineText, setCopied4Line)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                {copied4Line ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied4Line ? '복사 완료' : '4줄 전체 복사'}</span>
              </button>
            </div>

            <div className="rounded-2xl border border-neutral-800/90 bg-neutral-950 p-4.5 font-mono text-[12px] leading-relaxed text-neutral-200">
              <pre className="whitespace-pre-wrap">{fourLineText}</pre>
            </div>
          </div>

          {/* 3. AI와 나의 판단 3줄 (T05-C31) (1열 배치) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2 dark:border-neutral-800/70">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-neutral-900/10 px-2 py-0.5 text-[11px] font-bold text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
                  T05-C31
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  3. AI와 나의 판단 3줄 (AI 위임·인간 판단·AI 거절)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(threeLineText, setCopied3Line)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                {copied3Line ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied3Line ? '복사 완료' : '3줄 전체 복사'}</span>
              </button>
            </div>

            <div className="rounded-2xl border border-neutral-800/90 bg-neutral-950 p-4.5 font-mono text-[12px] leading-relaxed text-neutral-200">
              <pre className="whitespace-pre-wrap">{threeLineText}</pre>
            </div>
          </div>

          {/* 4. LMS 폼 원클릭 복사 도우미 (1열 순차 전개) */}
          <div className="space-y-4 border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  4. LMS 시작/연계 기록 입력 양식 도우미 (1열 순차 배치)
                </h3>
              </div>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                과제 5 플랫폼의 [선택 과정 기록 남기기] 폼에 그대로 붙여넣을 수 있습니다.
              </span>
            </div>

            {/* 1열 세로 스택 (grid-cols-1) */}
            <div className="grid grid-cols-1 gap-4">
              {/* Step 1: A 모델 시작 */}
              <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-4.5 dark:border-neutral-800/90 dark:bg-neutral-950/60">
                <div className="mb-3 flex flex-col justify-between gap-2 border-b border-neutral-200/60 pb-3 sm:flex-row sm:items-center dark:border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/25 dark:text-blue-300">
                      Step 1
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        A 모델 시작 기록 (Image 5-7 대응)
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        서비스: Cursor · 모델: Claude 3.7 Sonnet · 공통 상한(60분, 25회) 선언
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lmsModelAText, setCopiedLmsA)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    {copiedLmsA ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedLmsA ? '복사 완료' : 'A 시작 양식 복사'}</span>
                  </button>
                </div>
                <pre className="max-h-52 overflow-y-auto rounded-xl bg-neutral-900 p-3.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-neutral-300">
                  {lmsModelAText}
                </pre>
              </div>

              {/* Step 2: A 모델 종료 및 인계 */}
              <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-4.5 dark:border-neutral-800/90 dark:bg-neutral-950/60">
                <div className="mb-3 flex flex-col justify-between gap-2 border-b border-neutral-200/60 pb-3 sm:flex-row sm:items-center dark:border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/25 dark:text-amber-300">
                      Step 2
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        A 모델 종료·인계 기록 (Image 5-8 대응)
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        실제 소요: 28분 · 호출: 14회 · 검사: 6 PASS / 4 FAIL · 7항목 인수인계문 포함
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lmsModelAEndText, setCopiedLmsAEnd)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    {copiedLmsAEnd ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedLmsAEnd ? '복사 완료' : 'A 종료·인계 양식 복사'}</span>
                  </button>
                </div>
                <pre className="max-h-52 overflow-y-auto rounded-xl bg-neutral-900 p-3.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-neutral-300">
                  {lmsModelAEndText}
                </pre>
              </div>

              {/* Step 3: B 모델 시작 */}
              <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-4.5 dark:border-neutral-800/90 dark:bg-neutral-950/60">
                <div className="mb-3 flex flex-col justify-between gap-2 border-b border-neutral-200/60 pb-3 sm:flex-row sm:items-center dark:border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-purple-500/15 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-500/25 dark:text-purple-300">
                      Step 3
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        B 모델 시작 기록 (Image 5-9 대응)
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        서비스: Antigravity CLI · 모델: Gemini 3.8 Flash (A와 다른 서비스·이종 모델)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lmsModelBStartText, setCopiedLmsBStart)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    {copiedLmsBStart ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedLmsBStart ? '복사 완료' : 'B 시작 양식 복사'}</span>
                  </button>
                </div>
                <pre className="max-h-40 overflow-y-auto rounded-xl bg-neutral-900 p-3.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-neutral-300">
                  {lmsModelBStartText}
                </pre>
              </div>

              {/* Step 4: B 모델 종료 */}
              <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-4.5 dark:border-neutral-800/90 dark:bg-neutral-950/60">
                <div className="mb-3 flex flex-col justify-between gap-2 border-b border-neutral-200/60 pb-3 sm:flex-row sm:items-center dark:border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300">
                      Step 4
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        B 모델 종료 기록 (Image 5-10 대응)
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        실제 소요: 22분 · 호출: 11회 · 사전 고정 10대 검사 전수 100% 통과 (10/10 PASS)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(lmsModelBEndText, setCopiedLmsBEnd)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    {copiedLmsBEnd ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedLmsBEnd ? '복사 완료' : 'B 종료 양식 복사'}</span>
                  </button>
                </div>
                <pre className="max-h-52 overflow-y-auto rounded-xl bg-neutral-900 p-3.5 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-neutral-300">
                  {lmsModelBEndText}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200/80 px-6 py-4 dark:border-neutral-800/80">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            각 항목 우측의 복사 버튼을 눌러 LMS 제출 란에 즉시 붙여넣을 수 있습니다.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
