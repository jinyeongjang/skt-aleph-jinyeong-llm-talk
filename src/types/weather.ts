import type { NormalizedReading, ReadingStatus } from './board';

export interface WeatherStation {
  id: string; // 'seoul' | 'busan' | 'jeju'
  name: string; // '서울' | '부산' | '제주(서귀포)'
  region: string; // '수도권' | '영남권' | '제주권'
  latitude: number;
  longitude: number;
  timezone: string; // 'Asia/Seoul'
}

export interface StationDailyRecord {
  station_id: string;
  record_date: string; // YYYY-MM-DD
  reading: NormalizedReading;
  raw_reading?: unknown;
  status: ReadingStatus;
  first_normalized_value?: number;
}

export interface StationCurrentState {
  station: WeatherStation;
  reading: NormalizedReading | null;
  status: ReadingStatus;
  previousDayReading: NormalizedReading | null;
  delta: number | null; // 오늘 기온 - 어제 기온
  history: StationDailyRecord[];
}

export interface AnomalyAlert {
  stationId: string;
  stationName: string;
  isAnomaly: boolean;
  delta: number;
  threshold: number; // 기본 3.0°C
  anomalyType: 'temperature_drop' | 'temperature_rise' | 'normal';
  message: string;
  detectedAt: string;
}

export interface SpreadMetric {
  maxStation: string;
  maxTemp: number;
  minStation: string;
  minTemp: number;
  spread: number; // maxTemp - minTemp
  unit: string; // '°C'
}

export interface BriefingReport {
  generatedAt: string;
  timezone: string;
  headline: string;
  summaryText: string;
  markdownContent: string;
  jsonSchemaPayload: {
    report_id: string;
    timestamp: string;
    timezone: string;
    spread: {
      max_station: string;
      max_value: number;
      min_station: string;
      min_value: number;
      spread_value: number;
      unit: string;
    };
    stations: Array<{
      station_id: string;
      station_name: string;
      current_temp: number;
      yesterday_temp: number | null;
      delta: number | null;
      is_anomaly: boolean;
      status: string;
    }>;
    anomalies: Array<{
      station: string;
      type: string;
      delta: number;
      alert: string;
    }>;
  };
}
