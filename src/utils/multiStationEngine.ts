import type { NormalizedReading } from '../types/board.ts';
import type { SpreadMetric, StationDailyRecord, WeatherStation } from '../types/weather.ts';
import { kstDate } from './kst.ts';

export const WEATHER_STATIONS: WeatherStation[] = [
  {
    id: 'seoul',
    name: '서울',
    region: '수도권',
    latitude: 37.5665,
    longitude: 126.978,
    timezone: 'Asia/Seoul',
  },
  {
    id: 'busan',
    name: '부산',
    region: '영남권',
    latitude: 35.1796,
    longitude: 129.0756,
    timezone: 'Asia/Seoul',
  },
  {
    id: 'jeju',
    name: '제주(서귀포)',
    region: '제주권',
    latitude: 33.4996,
    longitude: 126.5312,
    timezone: 'Asia/Seoul',
  },
];

export function getStationApiUrl(station: WeatherStation): string {
  return `https://api.open-meteo.com/v1/forecast?latitude=${station.latitude}&longitude=${station.longitude}&current=temperature_2m&timezone=Asia%2FSeoul`;
}

function createNormalized(
  station: WeatherStation,
  val: number,
  sourceTime: string,
  fetchedAt: string,
  recordDate: string,
): NormalizedReading {
  const url = getStationApiUrl(station);
  return {
    signal_id: `temp-${station.id}`,
    normalized_value: val,
    value: val,
    unit: '°C',
    source_name: `Open-Meteo (${station.name})`,
    source: `Open-Meteo (${station.name})`,
    source_url: url,
    source_time: sourceTime,
    fetched_at: fetchedAt,
    record_timezone: 'Asia/Seoul',
    timezone: 'Asia/Seoul',
    record_date: recordDate,
  };
}

/**
 * 기본 시드 데이터 (KST 2일치 실측 기반)
 * 1일차(2026-09-13) 및 2일차(2026-09-14)
 */
export const INITIAL_MULTI_STATION_DATA: Record<
  string,
  { yesterday: NormalizedReading; today: NormalizedReading; history: StationDailyRecord[] }
> = {
  seoul: {
    yesterday: createNormalized(
      WEATHER_STATIONS[0],
      20.8,
      '2026-09-13T20:30:00+09:00',
      '2026-09-13T20:31:05+09:00',
      '2026-09-13',
    ),
    today: createNormalized(
      WEATHER_STATIONS[0],
      16.5,
      '2026-09-14T14:00:00+09:00',
      '2026-09-14T14:01:10+09:00',
      '2026-09-14',
    ),
    history: [
      {
        station_id: 'seoul',
        record_date: '2026-09-13',
        reading: createNormalized(
          WEATHER_STATIONS[0],
          20.8,
          '2026-09-13T20:30:00+09:00',
          '2026-09-13T20:31:05+09:00',
          '2026-09-13',
        ),
        status: { freshness: 'fresh', error_code: 'none' },
        first_normalized_value: 20.8,
      },
      {
        station_id: 'seoul',
        record_date: '2026-09-14',
        reading: createNormalized(
          WEATHER_STATIONS[0],
          16.5,
          '2026-09-14T14:00:00+09:00',
          '2026-09-14T14:01:10+09:00',
          '2026-09-14',
        ),
        status: { freshness: 'fresh', error_code: 'none' },
        first_normalized_value: 16.5,
      },
    ],
  },
  busan: {
    yesterday: createNormalized(
      WEATHER_STATIONS[1],
      24.2,
      '2026-09-13T20:30:00+09:00',
      '2026-09-13T20:31:08+09:00',
      '2026-09-13',
    ),
    today: createNormalized(
      WEATHER_STATIONS[1],
      23.5,
      '2026-09-14T14:00:00+09:00',
      '2026-09-14T14:01:12+09:00',
      '2026-09-14',
    ),
    history: [
      {
        station_id: 'busan',
        record_date: '2026-09-13',
        reading: createNormalized(
          WEATHER_STATIONS[1],
          24.2,
          '2026-09-13T20:30:00+09:00',
          '2026-09-13T20:31:08+09:00',
          '2026-09-13',
        ),
        status: { freshness: 'fresh', error_code: 'none' },
        first_normalized_value: 24.2,
      },
      {
        station_id: 'busan',
        record_date: '2026-09-14',
        reading: createNormalized(
          WEATHER_STATIONS[1],
          23.5,
          '2026-09-14T14:00:00+09:00',
          '2026-09-14T14:01:12+09:00',
          '2026-09-14',
        ),
        status: { freshness: 'fresh', error_code: 'none' },
        first_normalized_value: 23.5,
      },
    ],
  },
  jeju: {
    yesterday: createNormalized(
      WEATHER_STATIONS[2],
      25.0,
      '2026-09-13T20:30:00+09:00',
      '2026-09-13T20:31:10+09:00',
      '2026-09-13',
    ),
    today: createNormalized(
      WEATHER_STATIONS[2],
      25.8,
      '2026-09-14T14:00:00+09:00',
      '2026-09-14T14:01:15+09:00',
      '2026-09-14',
    ),
    history: [
      {
        station_id: 'jeju',
        record_date: '2026-09-13',
        reading: createNormalized(
          WEATHER_STATIONS[2],
          25.0,
          '2026-09-13T20:30:00+09:00',
          '2026-09-13T20:31:10+09:00',
          '2026-09-13',
        ),
        status: { freshness: 'fresh', error_code: 'none' },
        first_normalized_value: 25.0,
      },
      {
        station_id: 'jeju',
        record_date: '2026-09-14',
        reading: createNormalized(
          WEATHER_STATIONS[2],
          25.8,
          '2026-09-14T14:00:00+09:00',
          '2026-09-14T14:01:15+09:00',
          '2026-09-14',
        ),
        status: { freshness: 'fresh', error_code: 'none' },
        first_normalized_value: 25.8,
      },
    ],
  },
};

/**
 * 전국 기온 편차 계산 (Spread: 최고 - 최저) (T05-TEST-06)
 */
export function calculateSpread(stationReadings: Array<{ name: string; temp: number }>): SpreadMetric {
  if (stationReadings.length === 0) {
    return {
      maxStation: '-',
      maxTemp: 0,
      minStation: '-',
      minTemp: 0,
      spread: 0,
      unit: '°C',
    };
  }

  let maxItem = stationReadings[0];
  let minItem = stationReadings[0];

  for (const item of stationReadings) {
    if (item.temp > maxItem.temp) maxItem = item;
    if (item.temp < minItem.temp) minItem = item;
  }

  // 부동소수점 오차 방지
  const rawSpread = maxItem.temp - minItem.temp;
  const spread = Math.round(rawSpread * 10) / 10;

  return {
    maxStation: maxItem.name,
    maxTemp: maxItem.temp,
    minStation: minItem.name,
    minTemp: minItem.temp,
    spread,
    unit: '°C',
  };
}

/**
 * Open-Meteo 실시간 조회 파싱 함수
 */
export function parseOpenMeteoPayload(payload: unknown, station: WeatherStation): NormalizedReading {
  if (!payload || typeof payload !== 'object') {
    throw new Error('응답 페이로드가 유효한 JSON 객체가 아닙니다.');
  }

  const p = payload as {
    current?: {
      temperature_2m?: number;
      time?: string;
    };
    current_units?: {
      temperature_2m?: string;
    };
    timezone?: string;
  };

  if (p.current?.temperature_2m === undefined || typeof p.current.temperature_2m !== 'number') {
    throw new Error(`Open-Meteo 응답에 current.temperature_2m 필드가 없습니다: ${JSON.stringify(payload)}`);
  }

  const value = Math.round(p.current.temperature_2m * 10) / 10;
  const unit = p.current_units?.temperature_2m || '°C';
  const source_time = p.current.time ? `${p.current.time}:00+09:00` : new Date().toISOString();
  const fetched_at = new Date().toISOString();
  const timezone = p.timezone || 'Asia/Seoul';
  const record_date = kstDate(fetched_at);

  return {
    signal_id: `temp-${station.id}`,
    normalized_value: value,
    value,
    unit,
    source_name: `Open-Meteo Weather API (${station.name})`,
    source: `Open-Meteo Weather API (${station.name})`,
    source_url: getStationApiUrl(station),
    source_time,
    fetched_at,
    record_timezone: 'Asia/Seoul',
    timezone,
    record_date,
  };
}

/**
 * 일별 기록 원자적 갱신 로직 (T05-TEST-04, T05-TEST-05)
 */
export function updateStationDailyHistory(
  existingHistory: StationDailyRecord[],
  newReading: NormalizedReading,
  stationId: string,
): StationDailyRecord[] {
  const targetDate = kstDate(newReading.fetched_at);
  const existingIndex = existingHistory.findIndex((h) => h.record_date === targetDate);

  const finalVal = newReading.normalized_value ?? newReading.value ?? 0;

  if (existingIndex >= 0) {
    // 동일 날짜 단일 행 원자적 갱신 (Update)
    const updated = [...existingHistory];
    const prev = updated[existingIndex];
    updated[existingIndex] = {
      ...prev,
      reading: newReading,
      status: { freshness: 'fresh', error_code: 'none' },
      first_normalized_value: prev.first_normalized_value ?? prev.reading.normalized_value ?? prev.reading.value,
    };
    return updated;
  }

  // 익일 신규 행 추가 (Create)
  const newRecord: StationDailyRecord = {
    station_id: stationId,
    record_date: targetDate,
    reading: newReading,
    status: { freshness: 'fresh', error_code: 'none' },
    first_normalized_value: finalVal,
  };

  return [...existingHistory, newRecord].sort((a, b) => a.record_date.localeCompare(b.record_date));
}
