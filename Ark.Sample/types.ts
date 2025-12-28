export interface PanelSettings {
  borderRadius: number;
  shadowIntensity: number;
  gradientStart: string;
  gradientEnd: string;
  opacity: number;
  backgroundImage: string | null;
  textColor: string;
  accentColor: string;
  glassBlur: number;
  showGrid: boolean;
}

export interface CryptoSymbol {
  symbol: string;
  price: number;
  change: number;
  volume: string;
}

export interface DashboardMetrics {
  activeSymbolsCount: number;
  aiStatus: 'Online' | 'Offline' | 'Analyzing';
  trainingStatus: 'Running' | 'Idle';
  trainingProgress: number; // 0-100
  predictionScore: number; // 0-100
  transactions: number;
  successful: number;
  failed: number;
  failRate: number;
  transactionTime: number; // ms
  fraudAlerts: number;
}