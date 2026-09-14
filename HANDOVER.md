# 과제 5 일곱 칸 인수인계 문서 (Handover Specification)

> **문서 버전 ID**: `3f70c5a0fa96d9b882dc16714bfefe89405d5c66`  
> **인수인계 누락 점검**: 누락 없음 (0건 확인 완료, T05-C15)  
> **세션 분리 규격**: 대화 전문 일체 미제공 — 본 인수인계 문서와 저장소 코드만으로 AI B 작업 착수 (T05-C13, T05-C14)

---

## 1. 목표 (Goal)

과제 4(오늘의 진짜 정보판)의 단일 지점(서울) 관측 한계를 극복하고, 전국 3대 권역(수도권 서울, 영남권 부산, 제주권 서귀포)의 비개인 공개 원천(Open-Meteo 무료 무키 API)을 실시간으로 수집·동기화하며, KST 기준 어제 대비 기온 급변(임계치 ±3.0°C)을 감지하는 **이상 기온 감지(Anomaly Alert) 엔진**과 후속 LLM 연계를 위한 **구조화 브리핑 생성기**를 완성한다.

---

## 2. 현재 상태 (Current Status)

- **작업 주체**: AI A (Cursor / Claude 3.7 Sonnet)
- **작업량 집계**: 소요 시간 28분 (상한 60분 이하, T05-C50), API/요청 수 14회 (상한 25회 이하, T05-C52), 오류 회차 3회
- **중단 시점 소스 버전 ID**: `3f70c5a0fa96d9b882dc16714bfefe89405d5c66` (T05-C08, T05-C12)
- **진행 상태**:
  - 전국 3대 권역 관측소(서울, 부산, 제주) 메타데이터 모델 정의 완료
  - Open-Meteo 실시간 관측값 정규화 엔진(`NormalizedReading`) 구현 완료
  - 1일차(2026-09-13) 및 2일차(2026-09-14) 시드 데이터 및 전국 편차(Spread) 산출 로직 구현 완료
  - 사전 고정 검사 10개 중 **6건 통과 (PASS)**, 남은 4건은 미완성 상태(FAIL)로 보존됨 (T05-C09)

---

## 3. 실행 명령 (Execution Commands)

처음 본 작업자가 새 환경(클린 머신 또는 신규 폴더)에서 대화 없이 100% 재현 가능한 명령어 목록입니다 (T05-C11):

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 사전 고정 10대 검사 CLI 자동 실행 (현재 6 PASS / 4 FAIL 확인)
npm test

# 3. 로컬 개발 서버 실행 (기본 포트 http://localhost:5173)
npm run dev

# 4. TypeScript 타입 검사 및 프로덕션 번들 빌드
npm run build

# 5. Oxlint 정적 코드 분석
npm run lint
```

---

## 4. 통과 검사 (Passed Tests) — 6건

AI A 세션 중단 시점에 성공적으로 통과한 6개 고정 검사 목록입니다:

1. `T05-TEST-01`: **멀티 관측소 메타데이터 유효성 검증**
   - 서울, 부산, 제주 3개 관측소 위경도 범위(-90~~90, -180~~180) 및 기준 시간대 `Asia/Seoul` 일치
2. `T05-TEST-02`: **멀티 관측소 실시간 관측값 정규화 (NormalizedReading)**
   - `signal_id`, `normalized_value`, `unit`, `source_name`, `source_time`, `fetched_at`, `record_timezone` 6대 필수 메타데이터 충족
3. `T05-TEST-03`: **단일 관측소 외부 실패 시 격리 및 타 관측소 정상값 보존**
   - 부산 관측소 장애 시 stale 상태 격리 및 직전 정상값(24.2°C) 보존, 서울/제주 정상 표시 유지
4. `T05-TEST-04`: **동일 Asia/Seoul 날짜 다회 수집 시 단일 행 원자적 갱신 (Atomic Update)**
   - 동일 날짜("2026-09-14") 재조회 시 행 중복 없이 1차 제출 기준값 보존 및 최신값 원자적 갱신
5. `T05-TEST-05`: **익일 KST 날짜 수집 시 신규 일별 기록 행 생성 (Atomic Create)**
   - Asia/Seoul 기준 다음 날짜("2026-09-15") 조회 시 새 일별 기록 1행 정상 추가 (총 2행)
6. `T05-TEST-06`: **전국 기온 편차(Spread: 최고 - 최저) 산출 정확성**
   - 제주(25.6°C) - 서울(18.4°C) = 7.2°C 부동소수점 오차 없이 정확히 산출

---

## 5. 남은 문제 (Remaining Issues) — 4건

AI B 세션에서 이어받아 구현해야 할 남은 고정 검사 4건입니다:

1. `T05-TEST-07`: **어제 대비 급변 이상 기온 감지(Anomaly Alert) 트리거**
   - 어제 기온 대비 오늘 기온 변화량이 임계치(기본 ±3.0°C)를 초과할 때 `isAnomaly: true`, `anomalyType` 경보 발령 로직 부재
2. `T05-TEST-08`: **이상 기온 판정 경계값(|ΔT| == 2.99°C vs 3.00°C) 정확성**
   - `|ΔT| < 3.00°C`는 정상, `|ΔT| >= 3.00°C`는 경보로 판정하는 엄격한 경계 조건 처리 부재
3. `T05-TEST-09`: **멀티 LLM 연계 브리핑 생성기 (Markdown & 구조화 JSON)**
   - 후속 LLM 연계를 위한 마크다운 요약 리포트 및 JSON Schema 준수 브리핑 페이로드 생성 모듈 부재
4. `T05-TEST-10`: **보안 무결성: 비밀키(API Key) 원문 및 개인정보(PII) 0건 검증**
   - 소스코드 및 번들 내 하드코딩된 API Key 및 개인정보 정규식 자동 스캐너 부재

---

## 6. 다음 행동 (Next Action)

AI B가 작업할 권장 순서 및 파일 가이드:

1. `src/utils/anomalyDetector.ts`를 생성하고 `detectAnomaly(stationId, stationName, yesterdayTemp, todayTemp, threshold)` 함수 구현:
   - `Math.abs(delta) >= threshold` 경계값 포함 검증
   - 하강(`temperature_drop`) 및 상승(`temperature_rise`) 알림 메시지 서식화
2. `src/utils/llmBriefing.ts`를 생성하고 `generateLlmBriefing(stations, spread, anomalies)` 함수 구현:
   - 마크다운 브리핑 텍스트 및 JSON Schema 페이로드 동시 반환
3. `src/utils/securityAudit.ts`를 생성하여 정규식 기반 비밀값/PII 스캐너 구현
4. `npm test`를 실행하여 10개 검사가 모두 통과(10 / 10 PASS)하는지 확인
5. 최종 버전 빌드 및 비교 보고서 화면 검증

---

## 7. 건드리지 말 것 (Do Not Touch — 금지 범위)

1. **사전 고정 검사 10개 불변성 (T05-C18 ~ T05-C20)**:
   - `FIXED_TEST_SPECS`에 정의된 검사 10개의 ID, 입력 파라미터, 기대값은 절대로 삭제(C18), 완화(C19), 변경(C20)할 수 없습니다.
2. **완전 무키(Keyless) 비개인 공개 원천 원칙 (T05-C38)**:
   - 외부 상용 유료 API Key나 비밀 토큰을 저장소에 추가하지 마십시오. Open-Meteo 공개 엔드포인트만 사용해야 합니다.
3. **과제 4 상태 전이 및 복구 메커니즘 보존 (T05-C17)**:
   - 장애 발생 시 직전 정상값을 보존하고 주황색 '오래된 값 (Stale)' 배지를 표시하는 안정성 메커니즘을 수정하지 마십시오.
