/**
 * 보안 및 개인정보 무결성 감사 엔진 (T05-TEST-10, T05-C37, T05-C38)
 *
 * - T05-C37: 공개 비교 화면과 제출물의 실제 개인정보(PII) 0건
 * - T05-C38: 공개 비교 화면·저장소·제출물의 비밀값 원문(API Key, Token) 0건
 */

export interface SecurityAuditResult {
  passed: boolean;
  secretKeysFound: number;
  piiFound: number;
  details: string[];
  auditedItemsCount: number;
}

// 비밀키 탐지 정규식 (OpenAI sk-, Google AIza, GitHub ghp_, AWS AKIA, Bearer 토큰 등)
const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/g,
  /AIza[0-9A-Za-z-_]{35}/g,
  /ghp_[a-zA-Z0-9]{36}/g,
  /AKIA[0-9A-Z]{16}/g,
  /Bearer\s+[a-zA-Z0-9_.-]{25,}/gi,
  /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/gi,
  /secret[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/gi,
];

// 개인 식별 정보(PII) 탐지 정규식 (대한민국 주민번호, 휴대폰번호, 개인 이메일 등)
const PII_PATTERNS = [
  /\b\d{6}-[1-4]\d{6}\b/g, // 주민등록번호
  /\b01[016789]-?\d{3,4}-?\d{4}\b/g, // 휴대폰번호
  /\b[A-Za-z0-9._%+-]+@(?!example\.com|users\.noreply\.github\.com)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, // 개인 이메일 (예시/github noreply 제외)
];

export function runSecurityAudit(textsToScan: string[]): SecurityAuditResult {
  let secretKeysFound = 0;
  let piiFound = 0;
  const details: string[] = [];

  textsToScan.forEach((text, index) => {
    // 1. 비밀키 스캔
    for (const pattern of SECRET_PATTERNS) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        secretKeysFound += matches.length;
        details.push(
          `[위반] 텍스트 #${index + 1}에서 잠재적 비밀키 패턴 발견: ${matches.map((m) => m.slice(0, 4) + '***').join(', ')}`,
        );
      }
    }

    // 2. PII 스캔
    for (const pattern of PII_PATTERNS) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        piiFound += matches.length;
        details.push(
          `[위반] 텍스트 #${index + 1}에서 잠재적 개인정보(PII) 발견: ${matches.map((m) => m.slice(0, 3) + '***').join(', ')}`,
        );
      }
    }
  });

  const passed = secretKeysFound === 0 && piiFound === 0;
  if (passed) {
    details.push('✅ 비밀값 원문 0건 (완전 무키 공개 API 및 정적 저장소 확인 완료)');
    details.push('✅ 실제 개인정보(PII) 0건 (공개 비교 화면 및 제출물 무결성 확인 완료)');
  }

  return {
    passed,
    secretKeysFound,
    piiFound,
    details,
    auditedItemsCount: textsToScan.length,
  };
}
