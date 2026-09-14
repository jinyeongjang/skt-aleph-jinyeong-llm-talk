import type { FixedTestCase } from '../types/benchmark';

/**
 * 사전 고정 10대 검사 명세 (T05-C01 ~ T05-C04, T05-C18 ~ T05-C20)
 *
 * - T05-C01: 작업을 시작하기 전에 고정한 검사가 정확히 10개
 * - T05-C02: 고정 검사 10개 각각에 고유 ID (T05-TEST-01 ~ T05-TEST-10) 부여
 * - T05-C03: 고정 검사 10개 각각에 사용자/시스템 입력 명시
 * - T05-C04: 고정 검사 10개 각각에 관찰 가능한 기대값 명시
 * - 불변성: 검사 삭제 0건(T05-C18), 완화 0건(T05-C19), 기대값 변경 0건(T05-C20)
 */
export const FIXED_TEST_SPECS: FixedTestCase[] = [
  {
    id: 'T05-TEST-01',
    name: '멀티 관측소 메타데이터 유효성 검증',
    category: 'metadata',
    inputDescription:
      '전국 3대 권역 관측소 목록 (서울: 37.5665/126.9780, 부산: 35.1796/129.0756, 제주: 33.4996/126.5312, 기준 시간대: Asia/Seoul)',
    expectedDescription:
      '3개 관측소의 위도(-90~90), 경도(-180~180) 유효 범위 검증 및 기준 시간대 "Asia/Seoul" 일치, 고유 ID 중복 0건',
    boundaryNote: '위도/경도 부동소수점 범위 및 서울/부산/제주 고유 ID 식별성',
    passedInA: true,
    passedInB: true,
  },
  {
    id: 'T05-TEST-02',
    name: '멀티 관측소 실시간 관측값 정규화 (NormalizedReading)',
    category: 'ingestion',
    inputDescription: '관측소별 Open-Meteo 실시간 기온 응답 페이로드 (서울 18.4°C, 부산 22.8°C, 제주 25.6°C)',
    expectedDescription:
      'NormalizedReading 형식으로 3개 관측소 모두 value (number), unit ("°C"), source_time (ISO), fetched_at (ISO), timezone ("Asia/Seoul") 필드 100% 충족',
    boundaryNote: '영하/영상 온도 및 결측값 없을 때 정상 정규화 보장',
    passedInA: true,
    passedInB: true,
  },
  {
    id: 'T05-TEST-03',
    name: '단일 관측소 외부 실패 시 격리 및 타 관측소 정상값 보존',
    category: 'resilience',
    inputDescription: '부산 관측소 API 500 장애 발생, 서울/제주 정상 응답 상황',
    expectedDescription:
      '부산 관측소만 stale 상태 및 직전 정상값 보존으로 격리되고, 서울/제주는 fresh 정상 표시 유지 (전체 UI 충돌 0건)',
    boundaryNote: '부분 네트워크 장애 시 분리 격리 및 마지막 정상값 100% 보존',
    passedInA: true,
    passedInB: true,
  },
  {
    id: 'T05-TEST-04',
    name: '동일 Asia/Seoul 날짜 다회 수집 시 단일 행 원자적 갱신 (Atomic Update)',
    category: 'storage',
    inputDescription: '동일 KST 날짜("2026-09-14")에 1차 수집(18.4°C) 후 2차 수집(18.9°C) 실행',
    expectedDescription:
      '해당 관측소의 "2026-09-14" 일별 기록 행이 중복 추가되지 않고 단 1행으로 유지되며 최신 관측값 18.9°C로 원자적 갱신',
    boundaryNote: '동일 날짜 키(YYYY-MM-DD) 중복 생성 0건 보장',
    passedInA: true,
    passedInB: true,
  },
  {
    id: 'T05-TEST-05',
    name: '익일 KST 날짜 수집 시 신규 일별 기록 행 생성 (Atomic Create)',
    category: 'storage',
    inputDescription: '기존 "2026-09-14" 기록 보유 상태에서 익일 "2026-09-15" 관측 데이터 수집',
    expectedDescription: '새로운 날짜 행("2026-09-15")이 성공적으로 추가되어 총 일별 기록 수가 1행 증가',
    boundaryNote: 'KST 자정(00:00:00+09:00) 경계 기준 날짜 전환 정확성',
    passedInA: true,
    passedInB: true,
  },
  {
    id: 'T05-TEST-06',
    name: '전국 기온 편차(Spread: 최고 - 최저) 산출 정확성',
    category: 'analysis',
    inputDescription: '서울 18.4°C, 부산 22.8°C, 제주 25.6°C 동시 관측값',
    expectedDescription:
      '최고 관측소 제주(25.6°C) - 최저 관측소 서울(18.4°C) = 7.2°C 산출 (부동소수점 오차 없이 1자리 반올림 일치)',
    boundaryNote: '동일 기온(편차 0.0°C) 및 음수 기온 구간 편차 계산 정확성',
    passedInA: true,
    passedInB: true,
  },
  {
    id: 'T05-TEST-07',
    name: '어제 대비 급변 이상 기온 감지(Anomaly Alert) 트리거',
    category: 'anomaly',
    inputDescription: '어제 기온 20.8°C, 오늘 기온 16.5°C 입력 (변화량 ΔT = -4.3°C, 기본 임계치 ±3.0°C)',
    expectedDescription:
      'isAnomaly: true, anomalyType: "temperature_drop", delta: -4.3, 경보 배지 "급격한 기온 하강 경보" 활성화',
    boundaryNote: '급격한 상승(+3.0°C 이상) 및 급격한 하강(-3.0°C 이하) 양방향 감지',
    passedInA: false, // AI A 중단 시점 미구현 (FAIL)
    passedInB: true, // AI B 인계 후 구현 완료 (PASS)
  },
  {
    id: 'T05-TEST-08',
    name: '이상 기온 판정 경계값(|ΔT| == 2.99°C vs 3.00°C) 정확성',
    category: 'boundary',
    inputDescription:
      '케이스 A: 어제 20.0°C -> 오늘 22.99°C (|ΔT| = 2.99°C) / 케이스 B: 어제 20.0°C -> 오늘 23.00°C (|ΔT| = 3.00°C)',
    expectedDescription: '케이스 A는 isAnomaly: false (정상 범위), 케이스 B는 isAnomaly: true (경계값 포함 이상 감지)',
    boundaryNote: '정확한 경계값 (|ΔT| >= threshold) 포함 판정',
    passedInA: false, // AI A 중단 시점 미구현 (FAIL)
    passedInB: true, // AI B 인계 후 구현 완료 (PASS)
  },
  {
    id: 'T05-TEST-09',
    name: '멀티 LLM 연계 브리핑 생성기 (Markdown & 구조화 JSON)',
    category: 'briefing',
    inputDescription: '3개 관측소 최신 기온, 편차, 이상 기온 감지 결과 객체',
    expectedDescription: '다운스트림 LLM 연동을 위한 규격화된 Markdown 브리핑과 JSON Schema 준수 페이로드 동시 생성',
    boundaryNote: '특수문자 이스케이프 및 JSON 역직렬화 무결성',
    passedInA: false, // AI A 중단 시점 미구현 (FAIL)
    passedInB: true, // AI B 인계 후 구현 완료 (PASS)
  },
  {
    id: 'T05-TEST-10',
    name: '보안 무결성: 비밀키(API Key) 원문 및 개인정보(PII) 0건 검증',
    category: 'security',
    inputDescription: '전체 소스코드, 저장소 파일, 네트워크 요청 매개변수, 브리핑 생성물',
    expectedDescription:
      'API 키 정규식(sk-[a-zA-Z0-9]{20,}, AIza[0-9A-Za-z-_]{35}) 및 개인정보(주민등록번호, 전화번호, 이메일) 매칭 0건 검증 통과',
    boundaryNote: '가짜 키/실제 키 구분 없이 비밀값 형태 원문 0건 엄격 검증',
    passedInA: false, // AI A 중단 시점 미구현 (FAIL)
    passedInB: true, // AI B 인계 후 구현 완료 (PASS)
  },
];
