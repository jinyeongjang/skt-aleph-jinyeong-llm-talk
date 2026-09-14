export interface FixedTestCase {
  id: string; // T05-TEST-01 ~ T05-TEST-10
  name: string;
  category:
    'metadata' | 'ingestion' | 'resilience' | 'storage' | 'analysis' | 'anomaly' | 'boundary' | 'briefing' | 'security';
  inputDescription: string;
  expectedDescription: string;
  boundaryNote?: string;
  passedInA: boolean; // AI A 중단 시점 통과 여부 (1~6: true, 7~10: false)
  passedInB: boolean; // AI B 완료 시점 통과 여부 (1~10: true)
}

export interface TestExecutionResult {
  testId: string;
  name: string;
  passed: boolean;
  actualOutput: string;
  executionTimeMs: number;
  logs: string[];
}

export interface ModelMetrics {
  id: 'model-a' | 'model-b';
  maskedName: string; // 'Model A' | 'Model B' (블라인드 평가용)
  serviceName: string; // 'Cursor' | 'Antigravity'
  modelName: string; // 'Claude 3.7 Sonnet' | 'Gemini 2.5 Flash'
  timeLimitMin: number; // 60분 (공통 상한)
  actualTimeMin: number; // AI A: 28분, AI B: 22분
  callLimit: number; // 25회 (공통 상한)
  actualCalls: number; // AI A: 14회, AI B: 11회
  errorRuns: number; // 고정 검사 10개 중 1개 이상 FAIL 회차 수 (AI A: 3회, AI B: 1회)
  passedTestsCount: number; // AI A: 6, AI B: 10
  totalTestsCount: number; // 10
  startCommit: string;
  endCommit: string;
  linesAdded: number;
  linesDeleted: number;
  roleDescription: string;
}

export interface HandoverSevenItems {
  goal: string; // 1. 목표
  currentStatus: string; // 2. 현재 상태
  executionCommands: string[]; // 3. 실행 명령
  passedTests: string[]; // 4. 통과 검사
  remainingIssues: string[]; // 5. 남은 문제
  nextAction: string; // 6. 다음 행동
  doNotTouch: string; // 7. 건드리지 말 것 (금지 범위)
  versionId: string; // 저장소 버전 ID (commit hash)
  sha256Hash: string; // 무결성 해시
  missingItemsStatus: string; // "누락 없음 (0건)"
}

export interface WorkflowTimelineStep {
  id: string;
  order: number;
  actor: 'AI A' | 'AI B' | 'Human Operator';
  phase: 'A 시작' | 'A 인계' | 'B 시작' | 'B 완료';
  timestamp: string;
  description: string;
  commitHash: string;
  testsPassed: number;
  totalTests: number;
  status: 'completed' | 'in_progress' | 'pending';
}
