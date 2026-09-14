import type { ModelMetrics, WorkflowTimelineStep } from '../types/benchmark.ts';

/**
 * 사전 고정 공통 상한 (T05-C05, T05-C06)
 * - T05-C05: AI A와 AI B에 동일하게 적용할 시간 상한 한 개가 작업 전에 기록되어 있다. (60분)
 * - T05-C06: AI A와 AI B에 동일하게 적용할 요청 또는 호출 수 상한 한 개가 작업 전에 기록되어 있다. (25회)
 */
export const COMMON_LIMITS = {
  timeLimitMinutes: 60,
  callLimitCount: 25,
};

/**
 * 다음 작업에서 도구를 고르는 본인 기준 (한 문장, T05-C29)
 */
export const TOOL_SELECTION_CRITERIA =
  '정확한 스펙과 인수인계 문서가 준비되어 있을 때는 신속하고 비용 효율적인 경량 LLM(Gemini)을, 초기 아키텍처 및 복잡한 정규화 설계 단계에서는 추론 능력이 뛰어난 모델을 우선 선택한다.';

/**
 * 블라인드 비교 측정 데이터 (T05-C23 ~ T05-C28, T05-C50 ~ T05-C53)
 */
export const BENCHMARK_MODELS: Record<'a' | 'b', ModelMetrics> = {
  a: {
    id: 'model-a',
    maskedName: 'Model A',
    serviceName: 'Cursor',
    modelName: 'Claude 3.7 Sonnet',
    timeLimitMin: COMMON_LIMITS.timeLimitMinutes,
    actualTimeMin: 28, // T05-C23, T05-C50 (28분 <= 60분)
    callLimit: COMMON_LIMITS.callLimitCount,
    actualCalls: 14, // T05-C24, T05-C52 (14회 <= 25회)
    errorRuns: 3, // T05-C25 (하나 이상의 FAIL이 나온 회차 수: 3회)
    passedTestsCount: 6, // T05-C09, T05-C27 (T05-TEST-01~06 통과, 7~10 미구현)
    totalTestsCount: 10,
    startCommit: 'b4a1c72f109247d890a54e9089e31d8c0b240101',
    endCommit: '1a9f865733a43aa0a88925bab970ed8affbcb1f1',
    linesAdded: 420,
    linesDeleted: 35,
    roleDescription: '멀티 관측소 메타데이터 정의, Open-Meteo API 정규화 수집기 및 전국 편차 계산 기초 모듈 구현',
  },
  b: {
    id: 'model-b',
    maskedName: 'Model B',
    serviceName: 'Antigravity CLI',
    modelName: 'Gemini 3.8 Flash(Antigravity CLI)',
    timeLimitMin: COMMON_LIMITS.timeLimitMinutes,
    actualTimeMin: 22, // T05-C23, T05-C51 (22분 <= 60분)
    callLimit: COMMON_LIMITS.callLimitCount,
    actualCalls: 11, // T05-C24, T05-C53 (11회 <= 25회)
    errorRuns: 1, // T05-C25 (1회 수정 후 전수 PASS)
    passedTestsCount: 10, // T05-C16, T05-C27 (10개 전수 통과)
    totalTestsCount: 10,
    startCommit: '1a9f865733a43aa0a88925bab970ed8affbcb1f1',
    endCommit: '942cf9de4238292e4128746b63a786dd640d8bf1',
    linesAdded: 315,
    linesDeleted: 18,
    roleDescription:
      '인수인계 문서만으로 어제 대비 이상 기온 감지 엔진(경계값 포함), LLM 브리핑 생성기 및 보안 무결성 검증 완성',
  },
};

/**
 * 4단계 작업 흐름 순서 보증 (T05-C07)
 * 순서: AI A 시작 -> AI A 종료·인수인계 -> AI B 시작 -> AI B 종료
 */
export const WORKFLOW_TIMELINE: WorkflowTimelineStep[] = [
  {
    id: 'step-1-a-start',
    order: 1,
    actor: 'AI A',
    phase: 'A 시작',
    timestamp: '2026-09-14 13:00:00 KST',
    description: '과제 4 기반 작은 개선 선정, 검사 10개 및 공통 상한(60분, 25회) 사전 고정 후 작업 착수',
    commitHash: 'b4a1c72f109247d890a54e9089e31d8c0b240101',
    testsPassed: 0,
    totalTests: 10,
    status: 'completed',
  },
  {
    id: 'step-2-a-end',
    order: 2,
    actor: 'AI A',
    phase: 'A 인계',
    timestamp: '2026-09-14 13:28:00 KST',
    description:
      '멀티 관측소 정규화 및 편차 산출 구현 후 상한 내 중단(28분/14회). 6건 PASS 보존 및 7칸 인수인계 문서 작성',
    commitHash: '1a9f865733a43aa0a88925bab970ed8affbcb1f1',
    testsPassed: 6,
    totalTests: 10,
    status: 'completed',
  },
  {
    id: 'step-3-b-start',
    order: 3,
    actor: 'AI B',
    phase: 'B 시작',
    timestamp: '2026-09-14 13:35:00 KST',
    description: '이전 대화 전문 없이 저장소와 인수인계 문서만으로 새 세션(다른 모델) 작업 시작',
    commitHash: '1a9f865733a43aa0a88925bab970ed8affbcb1f1',
    testsPassed: 6,
    totalTests: 10,
    status: 'completed',
  },
  {
    id: 'step-4-b-end',
    order: 4,
    actor: 'AI B',
    phase: 'B 완료',
    timestamp: '2026-09-14 13:57:00 KST',
    description:
      '이상 기온 감지 및 LLM 브리핑 엔진 완성, 고정 검사 10개 전수 100% 통과(검사 삭제/완화/변경 0건) 및 보고서 산출',
    commitHash: '942cf9de4238292e4128746b63a786dd640d8bf1',
    testsPassed: 10,
    totalTests: 10,
    status: 'completed',
  },
];
