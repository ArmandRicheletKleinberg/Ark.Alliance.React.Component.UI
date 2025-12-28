import { CryptoSymbol, DashboardMetrics, PanelSettings } from './types';

export const INITIAL_SETTINGS: PanelSettings = {
  borderRadius: 24,
  shadowIntensity: 50,
  gradientStart: '#0f172a', // Slate 900
  gradientEnd: '#1e293b',   // Slate 800
  opacity: 95,
  backgroundImage: null,
  textColor: '#ffffff',
  accentColor: '#4ade80',   // Green 400
  glassBlur: 10,
  showGrid: false,
};

export const MOCK_SYMBOLS: CryptoSymbol[] = [
  { symbol: 'BTCUSDT', price: 64230.50, change: 1.2, volume: '2.4B' },
  { symbol: 'ETHUSDT', price: 3450.12, change: -0.5, volume: '1.1B' },
  { symbol: 'BNBUSDT', price: 590.20, change: 0.8, volume: '400M' },
  { symbol: 'SOLUSDT', price: 145.60, change: 3.4, volume: '800M' },
  { symbol: 'ADAUSDT', price: 0.45, change: -1.1, volume: '120M' },
];

export const MOCK_METRICS: DashboardMetrics = {
  activeSymbolsCount: 1829,
  aiStatus: 'Online',
  trainingStatus: 'Running',
  trainingProgress: 75,
  predictionScore: 86,
  transactions: 1829,
  successful: 1791,
  failed: 40,
  failRate: 2,
  transactionTime: 8,
  fraudAlerts: 44,
};