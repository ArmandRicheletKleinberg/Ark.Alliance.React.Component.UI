export interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TrendType = 'LONG' | 'SHORT' | 'WAIT';

export interface TrendSignal {
  id: string;
  time: number;
  type: TrendType;
  price: number;
}

export interface ThresholdLine {
  id: string;
  price: number;
  label: string;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface ChartStyleSettings {
  headerTitle: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  boxShadowIntensity: number;
  backgroundImage: string | null;
  bgImageOpacity: number;
  bgImageZoom: number;
  height: number;
  useLogScale: boolean;
}

export interface StreamConfig {
  endpoint: string; // e.g., 'wss://fstream.binance.com/ws/'
  symbol: string;   // e.g., 'solusdt'
  interval: string; // e.g., '1m', '15m'
}