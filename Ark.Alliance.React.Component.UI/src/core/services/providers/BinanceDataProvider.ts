/**
 * @fileoverview Binance Data Provider
 * @module core/services/providers/BinanceDataProvider
 * 
 * Data provider implementation for Binance Futures API.
 * Supports historical data fetching and real-time WebSocket streaming.
 */

import type {
    IDataProvider,
    StreamConfig,
    DataCallback,
    ConnectionCallback,
    DataProviderConfig,
} from '../DataProviderInterface';
import { DEFAULT_PROVIDER_CONFIG } from '../DataProviderInterface';
import type { CandlestickDataPoint } from '../../../components/Charts/primitives';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const BINANCE_REST_BASE = 'https://fapi.binance.com/fapi/v1/continuousKlines';
const BINANCE_WS_BASE = 'wss://fstream.binance.com/ws/';

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Binance Futures data provider
 * 
 * Provides OHLCV data from Binance Futures API with:
 * - Historical kline data via REST
 * - Real-time continuous contract streaming via WebSocket
 * 
 * @example
 * ```ts
 * const provider = new BinanceDataProvider();
 * 
 * // Fetch historical data
 * const history = await provider.fetchHistoricalData('BTCUSDT', '1m', 100);
 * 
 * // Stream real-time data
 * provider.connect(
 *     { endpoint: '', symbol: 'BTCUSDT', interval: '1m' },
 *     (data) => console.log('New candle:', data)
 * );
 * ```
 */
export class BinanceDataProvider implements IDataProvider {
    public readonly name = 'BinanceDataProvider';

    private ws: WebSocket | null = null;
    private config: Required<Omit<DataProviderConfig, 'transform'>>;
    private reconnectAttempts = 0;
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    private currentConfig: StreamConfig | null = null;
    private currentOnData: DataCallback | null = null;
    private currentOnStatus: ConnectionCallback | null = null;

    constructor(config: DataProviderConfig = {}) {
        this.config = {
            ...DEFAULT_PROVIDER_CONFIG,
            restBaseUrl: config.restBaseUrl || BINANCE_REST_BASE,
            wsBaseUrl: config.wsBaseUrl || BINANCE_WS_BASE,
            headers: config.headers || {},
            timeout: config.timeout || DEFAULT_PROVIDER_CONFIG.timeout,
            autoReconnect: config.autoReconnect ?? DEFAULT_PROVIDER_CONFIG.autoReconnect,
            reconnectDelay: config.reconnectDelay || DEFAULT_PROVIDER_CONFIG.reconnectDelay,
            maxReconnectAttempts: config.maxReconnectAttempts || DEFAULT_PROVIDER_CONFIG.maxReconnectAttempts,
        };
    }

    /**
     * Check if WebSocket is connected
     */
    public get isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Fetch historical candlestick data from Binance Futures API
     */
    public async fetchHistoricalData(
        symbol: string,
        interval: string,
        limit = 180
    ): Promise<CandlestickDataPoint[]> {
        try {
            const url = new URL(this.config.restBaseUrl);
            url.searchParams.append('pair', symbol.toUpperCase());
            url.searchParams.append('contractType', 'PERPETUAL');
            url.searchParams.append('interval', interval);
            url.searchParams.append('limit', limit.toString());

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            const response = await fetch(url.toString(), {
                headers: this.config.headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Binance API Error: ${response.status} ${response.statusText}`);
            }

            const rawData = await response.json();

            // Transform Binance kline array format to CandlestickDataPoint
            // Format: [Open time, Open, High, Low, Close, Volume, Close time, ...]
            return rawData.map((k: (string | number)[]): CandlestickDataPoint => ({
                time: Number(k[0]),
                open: parseFloat(String(k[1])),
                high: parseFloat(String(k[2])),
                low: parseFloat(String(k[3])),
                close: parseFloat(String(k[4])),
                volume: parseFloat(String(k[5])),
            }));
        } catch (error) {
            console.error('[BinanceDataProvider] Failed to fetch historical data:', error);
            return [];
        }
    }

    /**
     * Connect to Binance Futures WebSocket stream
     */
    public connect(
        config: StreamConfig,
        onData: DataCallback,
        onStatus?: ConnectionCallback
    ): void {
        this.disconnect();

        this.currentConfig = config;
        this.currentOnData = onData;
        this.currentOnStatus = onStatus || null;
        this.reconnectAttempts = 0;

        this.establishConnection();
    }

    /**
     * Establish WebSocket connection
     */
    private establishConnection(): void {
        if (!this.currentConfig) return;

        const symbol = this.currentConfig.symbol.toLowerCase();
        const interval = this.currentConfig.interval;

        // Binance Futures Continuous Contract Kline Stream format
        // <pair>_<contractType>@continuousKline_<interval>
        const streamName = `${symbol}_perpetual@continuousKline_${interval}`;
        const wsUrl = `${this.config.wsBaseUrl}${streamName}`;

        console.log(`[BinanceDataProvider] Connecting to ${wsUrl}`);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('[BinanceDataProvider] WebSocket connected');
            this.reconnectAttempts = 0;
            if (this.currentOnStatus) {
                this.currentOnStatus('connected');
            }
        };

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);

                // Binance continuous_kline event
                if (msg.e === 'continuous_kline') {
                    const k = msg.k;
                    const point: CandlestickDataPoint = {
                        time: k.t,
                        open: parseFloat(k.o),
                        high: parseFloat(k.h),
                        low: parseFloat(k.l),
                        close: parseFloat(k.c),
                        volume: parseFloat(k.v),
                    };

                    if (this.currentOnData) {
                        this.currentOnData(point, k.x);
                    }
                }
            } catch (err) {
                console.error('[BinanceDataProvider] Error parsing message:', err);
            }
        };

        this.ws.onerror = (err) => {
            console.error('[BinanceDataProvider] WebSocket error:', err);
            if (this.currentOnStatus) {
                this.currentOnStatus('error', new Error('WebSocket error'));
            }
        };

        this.ws.onclose = () => {
            console.log('[BinanceDataProvider] WebSocket closed');
            if (this.currentOnStatus) {
                this.currentOnStatus('disconnected');
            }

            // Auto-reconnect logic
            if (this.config.autoReconnect && this.currentConfig) {
                this.attemptReconnect();
            }
        };
    }

    /**
     * Attempt to reconnect after disconnect
     */
    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
            console.log('[BinanceDataProvider] Max reconnect attempts reached');
            return;
        }

        this.reconnectAttempts++;
        console.log(`[BinanceDataProvider] Attempting reconnect ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`);

        this.reconnectTimeout = setTimeout(() => {
            this.establishConnection();
        }, this.config.reconnectDelay);
    }

    /**
     * Disconnect from WebSocket
     */
    public disconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            // Disable auto-reconnect during intentional disconnect
            const wasAutoReconnect = this.config.autoReconnect;
            this.config.autoReconnect = false;

            this.ws.close();
            this.ws = null;

            this.config.autoReconnect = wasAutoReconnect;
        }

        this.currentConfig = null;
        this.currentOnData = null;
        this.currentOnStatus = null;
    }
}

export default BinanceDataProvider;
