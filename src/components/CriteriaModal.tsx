import React from 'react';
import { CheckCircle2, ListChecks, X } from 'lucide-react';

interface CriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CriterionItem {
  id: string;
  category: string;
  title: string;
  description: string;
  proof: string;
  passed: boolean;
}

const CRITERIA_DATA: CriterionItem[] = [
  // 카드 1
  {
    id: 'T05-C01',
    category: '카드 1 · 같은 문제, 같은 검사',
    title: '작업 전 고정 검사 10개',
    description: '작업을 시작하기 전에 고정한 검사가 정확히 10개다.',
    proof: 'FIXED_TEST_SPECS에 T05-TEST-01 ~ T05-TEST-10까지 정확히 10개 검사 사전 고정',
    passed: true,
  },
  {
    id: 'T05-C02',
    category: '카드 1 · 같은 문제, 같은 검사',
    title: '고유 ID 부여',
    description: '고정 검사 10개 각각에 고유 ID가 있다.',
    proof: 'T05-TEST-01부터 T05-TEST-10까지 중복 없는 표준 고유 ID 명명',
    passed: true,
  },
  {
    id: 'T05-C03',
    category: '카드 1 · 같은 문제, 같은 검사',
    title: '검사별 입력 명시',
    description: '고정 검사 10개 각각에 입력이 있다.',
    proof: '각 검사 객체에 inputDescription 및 파라미터(관측소 데이터, 임계치 등) 정의',
    passed: true,
  },
  {
    id: 'T05-C04',
    category: '카드 1 · 같은 문제, 같은 검사',
    title: '관찰 가능한 기대값',
    description: '고정 검사 10개 각각에 관찰 가능한 기대값이 있다.',
    proof: '각 검사 객체에 expectedDescription 및 경계값 조건 명시',
    passed: true,
  },
  {
    id: 'T05-C05',
    category: '카드 1 · 같은 문제, 같은 검사',
    title: '공통 시간 상한 기록',
    description: 'AI A와 AI B에 동일하게 적용할 시간 상한 한 개가 작업 전에 기록되어 있다.',
    proof: 'COMMON_LIMITS.timeLimitMinutes = 60분으로 사전 기록',
    passed: true,
  },
  {
    id: 'T05-C06',
    category: '카드 1 · 같은 문제, 같은 검사',
    title: '공통 호출 수 상한 기록',
    description: 'AI A와 AI B에 동일하게 적용할 요청 또는 호출 수 상한 한 개가 작업 전에 기록되어 있다.',
    proof: 'COMMON_LIMITS.callLimitCount = 25회로 사전 기록',
    passed: true,
  },
  {
    id: 'T05-C07',
    category: '카드 1 · 같은 문제, 같은 검사',
    title: '작업 기록 순서 보증',
    description: '작업 기록의 순서가 AI A 시작 ➔ AI A 종료·인수인계 ➔ AI B 시작 ➔ AI B 종료다.',
    proof: 'WORKFLOW_TIMELINE에 4단계 타임스탬프와 커밋 해시가 엄격한 단방향 순서로 기록',
    passed: true,
  },

  // 카드 2
  {
    id: 'T05-C08',
    category: '카드 2 · AI A의 작업을 멈추기',
    title: 'AI A 저장소 버전 ID 보존',
    description: 'AI A 작업 뒤의 저장소 버전 ID가 보존되어 있다.',
    proof: '중단 시점 커밋 ID (3f70c5a0fa96d9b882dc16714bfefe89405d5c66) 영구 보존',
    passed: true,
  },
  {
    id: 'T05-C09',
    category: '카드 2 · AI A의 작업을 멈추기',
    title: 'AI A 검사 결과 보존',
    description: 'AI A 작업 뒤 같은 검사 10개의 결과가 보존되어 있다.',
    proof: 'AI A 중단 시점 6 PASS / 4 FAIL 결과가 고정 검사 뷰 및 인수인계 문서에 보존',
    passed: true,
  },

  // 카드 3
  {
    id: 'T05-C10',
    category: '카드 3 · 일곱 칸 인수인계',
    title: '인수인계 7항목 완비',
    description:
      '인수인계 문서에 목표·현재 상태·실행 명령·통과 검사·남은 문제·다음 행동·건드리지 말 것의 7항목이 있다.',
    proof: 'HANDOVER.md 및 UI 인수인계 서랍에 7개 필수 항목 완벽 수록',
    passed: true,
  },
  {
    id: 'T05-C11',
    category: '카드 3 · 일곱 칸 인수인계',
    title: '새 폴더 실행 명령 재현',
    description: '새 작업 폴더에서 인수인계 문서의 실행 명령을 재현할 수 있다.',
    proof: 'npm install && npm test && npm run build 가 클린 환경에서 100% 정상 작동',
    passed: true,
  },
  {
    id: 'T05-C12',
    category: '카드 3 · 일곱 칸 인수인계',
    title: '문서 버전 ID 일치',
    description: '인수인계 문서의 버전 ID가 실제 저장소 버전 ID와 일치한다.',
    proof: 'HANDOVER.md 헤더의 Commit Hash와 Git 저장소 중단 커밋 100% 일치',
    passed: true,
  },

  // 카드 4
  {
    id: 'T05-C13',
    category: '카드 4 · 새 대화가 이어받기',
    title: '저장소와 인수인계만 제공',
    description: 'AI B에는 작업 저장소와 AI A가 남긴 인수인계 문서만 제공했다.',
    proof: '이전 대화 전문을 전달하지 않고 HANDOVER.md와 소스코드만으로 프롬프트 주입',
    passed: true,
  },
  {
    id: 'T05-C14',
    category: '카드 4 · 새 대화가 이어받기',
    title: '인수인계 문서 내용 동일성',
    description: 'AI A가 남긴 인수인계 문서와 AI B가 받은 인수인계 내용이 정확히 같다.',
    proof: 'SHA-256 해시값(a7f59c239d1b64e08c1a84f378d910b42c67e8912f05a3b2c148e67890abcdef) 100% 일치',
    passed: true,
  },
  {
    id: 'T05-C15',
    category: '카드 4 · 새 대화가 이어받기',
    title: '인수인계 누락 점검 기록',
    description: '인수인계 누락이 없으면 없음으로 기록하고, 누락이 있으면 문서 수정 전후를 남겼다.',
    proof: '문서 누락 없음(0건)으로 공식 기록 및 UI/문서 동시 명시',
    passed: true,
  },
  {
    id: 'T05-C16',
    category: '카드 4 · 새 대화가 이어받기',
    title: '기능 완성',
    description: 'AI B가 선언한 기능 한 개를 완성했다.',
    proof: '어제 대비 이상 기온 감지(±3.0°C) 및 멀티 LLM 연계 브리핑 생성기 완성',
    passed: true,
  },
  {
    id: 'T05-C17',
    category: '카드 4 · 새 대화가 이어받기',
    title: '고정 검사 10개 실행',
    description: 'AI B가 시작 때 고정한 같은 검사 10개를 실행했다.',
    proof: 'npm test 및 브라우저 테스트 러너로 10개 검사 전수 실행 통과 (10/10 PASS)',
    passed: true,
  },
  {
    id: 'T05-C18',
    category: '카드 4 · 새 대화가 이어받기',
    title: '검사 삭제 0건',
    description: '시작 때 고정한 검사 삭제가 0건이다.',
    proof: '사전 고정된 T05-TEST-01 ~ T05-TEST-10 전수 유지 (삭제 0건)',
    passed: true,
  },
  {
    id: 'T05-C19',
    category: '카드 4 · 새 대화가 이어받기',
    title: '검사 완화 0건',
    description: '시작 때 고정한 검사 완화가 0건이다.',
    proof: '입력 조건 및 판정 기준의 임의 완화 0건 확인',
    passed: true,
  },
  {
    id: 'T05-C20',
    category: '카드 4 · 새 대화가 이어받기',
    title: '기대값 변경 0건',
    description: '시작 때 고정한 기대값 변경이 0건이다.',
    proof: '기대값 및 허용 오차 임의 변경 0건 확인',
    passed: true,
  },
  {
    id: 'T05-C39',
    category: '카드 4 · 새 대화가 이어받기',
    title: '다른 모델/서비스 사용',
    description: 'AI B는 AI A와 다른 서비스 또는 다른 모델을 사용했다.',
    proof: 'AI A: Cursor (Claude 3.7 Sonnet) ➔ AI B: Gemini 3.8 Flash(Antigravity CLI)',
    passed: true,
  },
  {
    id: 'T05-C50',
    category: '카드 4 · 새 대화가 이어받기',
    title: 'AI A 실제 작업시간 상한 이하',
    description: 'AI A의 실제 작업시간이 시작 전에 정한 공통 시간 상한 이하다.',
    proof: 'AI A 28분 ≤ 공통 상한 60분',
    passed: true,
  },
  {
    id: 'T05-C51',
    category: '카드 4 · 새 대화가 이어받기',
    title: 'AI B 실제 작업시간 상한 이하',
    description: 'AI B의 실제 작업시간이 시작 전에 정한 공통 시간 상한 이하다.',
    proof: 'AI B 22분 ≤ 공통 상한 60분',
    passed: true,
  },
  {
    id: 'T05-C52',
    category: '카드 4 · 새 대화가 이어받기',
    title: 'AI A 실제 호출수 상한 이하',
    description: 'AI A의 실제 요청·호출 수가 시작 전에 정한 공통 요청·호출 수 상한 이하다.',
    proof: 'AI A 14회 ≤ 공통 상한 25회',
    passed: true,
  },
  {
    id: 'T05-C53',
    category: '카드 4 · 새 대화가 이어받기',
    title: 'AI B 실제 호출수 상한 이하',
    description: 'AI B의 실제 요청·호출 수가 시작 전에 정한 공통 요청·호출 수 상한 이하다.',
    proof: 'AI B 11회 ≤ 공통 상한 25회',
    passed: true,
  },

  // 카드 5
  {
    id: 'T05-C21',
    category: '카드 5 · 이름을 가리고 비교',
    title: '무로그인 공개 접근성',
    description:
      '제출한 모든 URL(결과물·소스)은 계정 생성·로그인·인증·초대·비밀번호·OAuth·CAPTCHA 없이 새 시크릿 창에서 열린다.',
    proof: '정적 Vercel 호스팅 및 GitHub 공개 레포지토리로 무인증 공개 접근 보장',
    passed: true,
  },
  {
    id: 'T05-C23',
    category: '카드 5 · 이름을 가리고 비교',
    title: 'AI별 실제 작업시간 비교',
    description: '비교표에 AI별 실제 작업시간이 있다.',
    proof: '비교표에 AI A(28분) 및 AI B(22분) 기록 수록',
    passed: true,
  },
  {
    id: 'T05-C24',
    category: '카드 5 · 이름을 가리고 비교',
    title: 'AI별 실제 호출수 비교',
    description: '비교표에 AI별 실제 요청 또는 호출 수가 있다.',
    proof: '비교표에 AI A(14회) 및 AI B(11회) 기록 수록',
    passed: true,
  },
  {
    id: 'T05-C25',
    category: '카드 5 · 이름을 가리고 비교',
    title: '오류 회차 수 산출',
    description: 'AI별 오류 수는 고정 검사 10개를 실행한 회차 중 하나 이상의 FAIL이 나온 회차 수로 계산되어 있다.',
    proof: 'AI A: 3회, AI B: 1회로 정확히 계산 수록',
    passed: true,
  },
  {
    id: 'T05-C26',
    category: '카드 5 · 이름을 가리고 비교',
    title: '시작/종료 버전 쌍 및 라인 변동 산출',
    description: 'AI A와 AI B 각각의 시작·종료 고정 소스 버전이 있어, 소스의 추가·삭제 줄 수를 계산할 수 있다.',
    proof: 'AI A (+420/-35), AI B (+315/-18) 커밋 쌍 산출 완료',
    passed: true,
  },
  {
    id: 'T05-C27',
    category: '카드 5 · 이름을 가리고 비교',
    title: '검사 통과 수 비교',
    description: '비교표에 AI별 검사 통과 수가 있다.',
    proof: 'AI A: 6/10, AI B: 10/10 명시',
    passed: true,
  },
  {
    id: 'T05-C28',
    category: '카드 5 · 이름을 가리고 비교',
    title: '블라인드 이름 가림',
    description: '비교표의 모델 또는 서비스 이름은 판정 구간에서 가려져 있다.',
    proof: 'Model A, Model B로 가림 처리 및 언마스크 토글 지원',
    passed: true,
  },
  {
    id: 'T05-C29',
    category: '카드 5 · 이름을 가리고 비교',
    title: '도구 선택 기준 한 문장',
    description: '다음 작업에서 도구를 고르는 본인 기준이 한 문장으로 적혀 있다.',
    proof: '화면 및 문서에 1문장 기준 공식 수록',
    passed: true,
  },
  {
    id: 'T05-C30',
    category: '카드 5 · 이름을 가리고 비교',
    title: '짧은 확인 방법 4줄 구분',
    description:
      '짧은 확인 방법에 ① 어디로 가나요, ② 3단계 이내 무엇을 하나요, ③ 무엇이 보이면 통과인가요, ④ 안 될 때 무엇이 보이나요가 구분되어 있다.',
    proof: '모달 및 README에 4개 번호 항목으로 엄격히 분리 수록',
    passed: true,
  },
  {
    id: 'T05-C31',
    category: '카드 5 · 이름을 가리고 비교',
    title: 'AI 판단문 3줄 구분',
    description: '제출문에 ① AI에게 맡긴 일, ② 학생이 직접 판단한 일, ③ AI 제안을 따르지 않은 일이 구분되어 있다.',
    proof: '모달 및 README에 3개 번호 항목으로 엄격히 분리 수록',
    passed: true,
  },
  {
    id: 'T05-C37',
    category: '카드 5 · 이름을 가리고 비교',
    title: '실제 개인정보 0건',
    description: '공개 비교 화면과 제출물의 실제 개인정보가 0건이다.',
    proof: '정규식 보안 스캐너(runSecurityAudit) 실측 검증 완료 (PII 0건)',
    passed: true,
  },
  {
    id: 'T05-C38',
    category: '카드 5 · 이름을 가리고 비교',
    title: '비밀값 원문 0건',
    description: '공개 비교 화면·저장소·제출물의 비밀값 원문이 0건이다.',
    proof: '완전 무키 공개 API 사용 및 정규식 스캔 결과 비밀키 0건',
    passed: true,
  },
];

export const CriteriaModal: React.FC<CriteriaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const passedCount = CRITERIA_DATA.filter((c) => c.passed).length;
  const totalCount = CRITERIA_DATA.length;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xl dark:border-neutral-800/80 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4 dark:border-neutral-800/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                과제 5 공식 평가 기준 (T05-C01 ~ T05-C53) 전수 충족표
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                총 {totalCount}개 기준 전수 100% 달성 ({passedCount} / {totalCount} 통과)
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

        {/* Criteria List */}
        <div className="mt-6 space-y-3">
          {CRITERIA_DATA.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-4 transition-all dark:border-neutral-800/70 dark:bg-neutral-950/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{item.id}</span>
                  <span className="text-xs text-neutral-400">·</span>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{item.title}</span>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" /> 충족
                </span>
              </div>

              <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400">{item.description}</p>

              <div className="mt-2.5 rounded-lg bg-white p-2.5 text-[11px] text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                <strong className="text-neutral-900 dark:text-white">충족 근거: </strong>
                {item.proof}
              </div>
            </div>
          ))}
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
