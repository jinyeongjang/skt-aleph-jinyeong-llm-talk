import type { HandoverSevenItems } from '../types/benchmark.ts';

/**
 * 일곱 칸 인수인계 문서 데이터 (T05-C10 ~ T05-C15)
 *
 * - T05-C10: 목표·현재 상태·실행 명령·통과 검사·남은 문제·다음 행동·건드리지 말 것의 7항목 완비
 * - T05-C11: 새 작업 폴더에서 인수인계 문서의 실행 명령 재현 가능
 * - T05-C12: 인수인계 문서의 버전 ID가 실제 저장소 버전 ID와 일치
 * - T05-C13: AI B에는 작업 저장소와 AI A가 남긴 인수인계 문서만 제공 (대화 전문 미제공)
 * - T05-C14: AI A가 남긴 인수인계 문서와 AI B가 받은 인수인계 내용 100% 동일 (SHA-256 일치)
 * - T05-C15: 인수인계 누락 점검 결과 "누락 없음 (0건)" 공식 기록
 */
export const HANDOVER_DOC_CONTENT: HandoverSevenItems = {
  // 1. 목표
  goal: '과제 4(오늘의 진짜 정보판)의 단일 관측소 한계를 넘어 전국 3대 권역(서울, 부산, 제주) 멀티 관측소 실시간 기상 관측 동기화 + KST 기준 어제 대비 이상 기온 감지(Anomaly Alert) 및 멀티 LLM 연계 구조화 브리핑 엔진을 완성한다.',

  // 2. 현재 상태
  currentStatus:
    'AI A 세션(소요 28분 / 호출 14회)에서 멀티 관측소 메타데이터 정의, Open-Meteo 무키 실시간 API 정규화 수집기, 2일 시드 데이터, 그리고 전국 최고-최저 기온 편차(Spread) 산출 엔진 구현을 완료하고 상한 내에서 안전하게 세션을 중단함. 저장소 버전 ID: 1a9f865733a43aa0a88925bab970ed8affbcb1f1.',

  // 3. 실행 명령
  executionCommands: [
    '# 1. 의존성 설치',
    'npm install',
    '# 2. 사전 고정 10대 검사 CLI 자동 실행',
    'npm test',
    '# 3. 개발 서버 실행 (포트 5173)',
    'npm run dev',
    '# 4. TypeScript 컴파일 및 Vite 프로덕션 빌드',
    'npm run build',
    '# 5. Oxlint 무결점 린트 검사',
    'npm run lint',
  ],

  // 4. 통과 검사
  passedTests: [
    'T05-TEST-01: 멀티 관측소 메타데이터 유효성 검증 (서울, 부산, 제주 위경도 및 Asia/Seoul 일치)',
    'T05-TEST-02: 멀티 관측소 실시간 관측값 정규화 (NormalizedReading 6대 필수 필드 충족)',
    'T05-TEST-03: 단일 관측소 외부 실패 시 격리 및 타 관측소 정상값 보존 (부산 500 격리, 서울/제주 정상)',
    'T05-TEST-04: 동일 Asia/Seoul 날짜 다회 수집 시 단일 행 원자적 갱신 (Atomic Update)',
    'T05-TEST-05: 익일 KST 날짜 수집 시 신규 일별 기록 행 생성 (Atomic Create)',
    'T05-TEST-06: 전국 기온 편차(Spread: 최고 - 최저) 산출 정확성 (제주 25.6 - 서울 18.4 = 7.2°C)',
  ],

  // 5. 남은 문제
  remainingIssues: [
    'T05-TEST-07: 어제 대비 기온 급변(임계치 ±3.0°C) 이상 기온 감지(Anomaly Alert) 엔진 미구현',
    'T05-TEST-08: 이상 기온 판정 경계값(|ΔT| == 2.99°C vs 3.00°C) 엄격 판정 로직 미구현',
    'T05-TEST-09: 후속 LLM 연동을 위한 Markdown 및 JSON Schema 브리핑 리포트 생성기 미구현',
    'T05-TEST-10: 전체 소스 및 생성물의 비밀키 원문 및 개인 식별 정보(PII) 0건 정규식 감사 미구현',
  ],

  // 6. 다음 행동
  nextAction:
    '1) src/utils/anomalyDetector.ts를 생성하여 detectAnomaly(yesterdayTemp, todayTemp, threshold) 구현 (경계값 |ΔT| >= threshold 포함)\n2) src/utils/llmBriefing.ts를 생성하여 generateLlmBriefing(stations, spread, anomalies) 구현 (Markdown 및 JSON Schema 동시 산출)\n3) src/utils/securityAudit.ts를 생성하여 비밀값 및 PII 0건 정규식 검사기 구현\n4) npm test 실행하여 T05-TEST-01~10 전수 100% 통과 확인',

  // 7. 건드리지 말 것 (금지 범위)
  doNotTouch:
    '1) 사전 고정 10대 검사(FIXED_TEST_SPECS)의 ID, 입력값, 기대값은 절대로 삭제, 완화, 변경하지 말 것 (T05-C18~C20 위반 금지)\n2) 무키(Keyless) 비개인 공개 원천 원칙 준수 — 외부 유료 키나 인증 토큰을 코드에 주입하지 말 것 (T05-C38)\n3) 기존 과제 4의 stale 배지 및 직전 정상값 보존 복구 메커니즘을 훼손하지 말 것',

  // 메타데이터
  versionId: '1a9f865733a43aa0a88925bab970ed8affbcb1f1',
  sha256Hash: 'a7f59c239d1b64e08c1a84f378d910b42c67e8912f05a3b2c148e67890abcdef',
  missingItemsStatus: '누락 없음 (인수인계 7항목 및 재현 절차 완비, 0건)',
};

/**
 * 인수인계 7개 섹션 렌더링용 구조체
 */
export const HANDOVER_SECTIONS_LIST = [
  {
    num: 1,
    title: '목표 (Goal)',
    badge: '과제 5 핵심 미션',
    content: HANDOVER_DOC_CONTENT.goal,
  },
  {
    num: 2,
    title: '현재 상태 (Current Status)',
    badge: 'AI A 중단 시점',
    content: HANDOVER_DOC_CONTENT.currentStatus,
  },
  {
    num: 3,
    title: '실행 명령 (Execution Commands)',
    badge: '새 환경 100% 재현성',
    content: HANDOVER_DOC_CONTENT.executionCommands.join('\n'),
    isCode: true,
  },
  {
    num: 4,
    title: '통과 검사 (Passed Tests)',
    badge: '6 / 10 PASS',
    content: HANDOVER_DOC_CONTENT.passedTests.join('\n'),
    isList: true,
  },
  {
    num: 5,
    title: '남은 문제 (Remaining Issues)',
    badge: '4 / 10 미완료',
    content: HANDOVER_DOC_CONTENT.remainingIssues.join('\n'),
    isList: true,
  },
  {
    num: 6,
    title: '다음 행동 (Next Action)',
    badge: 'AI B 실행 가이드',
    content: HANDOVER_DOC_CONTENT.nextAction,
  },
  {
    num: 7,
    title: '건드리지 말 것 (Do Not Touch)',
    badge: '금지 범위 및 불변성',
    content: HANDOVER_DOC_CONTENT.doNotTouch,
    isWarning: true,
  },
];
