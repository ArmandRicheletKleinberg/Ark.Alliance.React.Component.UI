import { ChartDataPoint, TrendSignal, TrendType } from '../types';

type DataCallback = (data: ChartDataPoint, isCandleClose: boolean) => void;
type SignalCallback = (signal: TrendSignal) => void;

export class StreamService {
  private ws: WebSocket | null = null;
  private onDataCallback: DataCallback | null = null;
  private onSignalCallback: SignalCallback | null = null;
  private currentSymbol: string = '';
  private currentInterval: string = '';

  constructor() {}

  public connect(endpoint: string, symbol: string, interval: string, onData: DataCallback, onSignal: SignalCallback) {
    this.disconnect();
    
    this.currentSymbol = symbol.toLowerCase();
    this.currentInterval = interval;
    this.onDataCallback = onData;
    this.onSignalCallback = onSignal;

    // Binance Futures Continuous Contract Kline Stream construction
    // Format: <pair>_<contractType>@continuousKline_<interval>
    // We use 'perpetual' as the default contract type.
    // Example: solusdt_perpetual@continuousKline_1m
    const streamName = `${this.currentSymbol}_perpetual@continuousKline_${this.currentInterval}`;
    const url = `${endpoint}${streamName}`;

    console.log(`Connecting to ${url}`);
    
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('Stream connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // Event type is 'continuous_kline' for this stream type
        if (msg.e === 'continuous_kline') {
          const k = msg.k;
          const point: ChartDataPoint = {
            time: k.t,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
            volume: parseFloat(k.v),
          };
          
          if (this.onDataCallback) {
            this.onDataCallback(point, k.x);
          }
        }
      } catch (err) {
        console.error('Error parsing stream data', err);
      }
    };

    this.ws.onerror = (err) => {
      console.error('Stream error', err);
    };

    this.ws.onclose = () => {
      console.log('Stream closed');
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const streamService = new StreamService();