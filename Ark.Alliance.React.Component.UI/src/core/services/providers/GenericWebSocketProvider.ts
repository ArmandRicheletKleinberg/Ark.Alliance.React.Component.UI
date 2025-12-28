/**
 * @fileoverview Generic WebSocket Data Provider
 * @module core/services/providers/GenericWebSocketProvider
 * 
 * Configurable WebSocket data provider for custom backends.
 * Supports custom URL formats and data transformation.
 */

import type {
    IDataProvider,
    StreamConfig,
    DataCallback,
    ConnectionCallback,
    DataProviderConfig,
    DataTransform,
} from '../DataProviderInterface';
import { DEFAULT_PROVIDER_CONFIG } from '../DataProviderInterface';
import type { CandlestickDataPoint } from '../../../components/Charts/primitives';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extended configuration for generic provider
 */
export interface GenericProviderConfig extends DataProviderConfig {
    /**
     * Function to build WebSocket URL from StreamConfig
     * @param config - Stream configuration
     * @returns Complete WebSocket URL
     */
    buildWsUrl?: (config: StreamConfig) => string;

    /**
     * Function to build REST URL for historical data
     * @param symbol - Trading symbol
     * @param interval - Time interval
     * @param limit - Number of candles
     * @returns Complete REST URL
     */
    buildRestUrl?: (symbol: string, interval: string, limit: number) => string;

    /**
     * Function to parse WebSocket message
     * @param data - Raw message data
     * @returns Parsed candlestick data or null if invalid
     */
    parseMessage?: (data: unknown) => { candle: CandlestickDataPoint; isClosed: boolean } | null;

    /**
     * Function to parse REST response
     * @param data - Raw response data
     * @returns Array of candlestick data
     */
    parseResponse?: (data: unknown) => CandlestickDataPoint[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT PARSERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default WebSocket URL builder (simple concatenation)
 */
const defaultBuildWsUrl = (config: StreamConfig): string => {
    const params = new URLSearchParams({
        symbol: config.symbol,
        interval: config.interval,
        ...config.params,
    });
    return `${config.endpoint}?${params.toString()}`;
};

/**
 * Default message parser (expects JSON with OHLCV fields)
 */
const defaultParseMessage = (data: unknown): { candle: CandlestickDataPoint; isClosed: boolean } | null => {
    try {
        const msg = typeof data === 'string' ? JSON.parse(data) : data;

        // Try to extract OHLCV data from common formats
        const candle: CandlestickDataPoint = {
            time: msg.time || msg.t || msg.timestamp || Date.now(),
            open: parseFloat(msg.open ?? msg.o ?? 0),
            high: parseFloat(msg.high ?? msg.h ?? 0),
            low: parseFloat(msg.low ?? msg.l ?? 0),
            close: parseFloat(msg.close ?? msg.c ?? 0),
            volume: parseFloat(msg.volume ?? msg.v ?? 0),
        };

        // Check if it's a valid candle
        if (candle.open === 0 && candle.high === 0 && candle.low === 0 && candle.close === 0) {
            return null;
        }

        return {
            candle,
            isClosed: Boolean(msg.isClosed ?? msg.x ?? msg.closed ?? false),
        };
    } catch {
        return null;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generic WebSocket data provider
 * 
 * Configurable provider for custom data sources with:
 * - Custom URL builders
 * - Custom message parsers
 * - Auto-reconnection
 * 
 * @example
 * ```ts
 * const provider = new GenericWebSocketProvider({
 *     wsBaseUrl: 'wss://my-backend.com/stream',
 *     buildWsUrl: (config) => `wss://my-backend.com/stream/${config.symbol}`,
 *     parseMessage: (data) => ({
 *         candle: { time: data.ts, open: data.o, high: data.h, low: data.l, close: data.c, volume: data.v },
 *         isClosed: data.final,
 *     }),
 * });
 * ```
 */
export class GenericWebSocketProvider implements IDataProvider {
    public readonly name = 'GenericWebSocketProvider';

    private ws: WebSocket | null = null;
    private config: Required<Omit<DataProviderConfig, 'transform'>>;
    private buildWsUrl: (config: StreamConfig) => string;
    private buildRestUrl: ((symbol: string, interval: string, limit: number) => string) | null;
    private parseMessage: (data: unknown) => { candle: CandlestickDataPoint; isClosed: boolean } | null;
    private parseResponse: ((data: unknown) => CandlestickDataPoint[]) | null;
    private transform: DataTransform | null = null;

    private reconnectAttempts = 0;
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    private currentConfig: StreamConfig | null = null;
    private currentOnData: DataCallback | null = null;
    private currentOnStatus: ConnectionCallback | null = null;

    constructor(config: GenericProviderConfig = {}) {
        this.config = {
            ...DEFAULT_PROVIDER_CONFIG,
            restBaseUrl: config.restBaseUrl || '',
            wsBaseUrl: config.wsBaseUrl || '',
            headers: config.headers || {},
            timeout: config.timeout || DEFAULT_PROVIDER_CONFIG.timeout,
            autoReconnect: config.autoReconnect ?? DEFAULT_PROVIDER_CONFIG.autoReconnect,
            reconnectDelay: config.reconnectDelay || DEFAULT_PROVIDER_CONFIG.reconnectDelay,
            maxReconnectAttempts: config.maxReconnectAttempts || DEFAULT_PROVIDER_CONFIG.maxReconnectAttempts,
        };

        this.buildWsUrl = config.buildWsUrl || defaultBuildWsUrl;
        this.buildRestUrl = config.buildRestUrl || null;
        this.parseMessage = config.parseMessage || defaultParseMessage;
        this.parseResponse = config.parseResponse || null;
        this.transform = config.transform || null;
    }

    /**
     * Check if WebSocket is connected
     */
    public get isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Set custom data transformation
     */
    public setTransform(transform: DataTransform): void {
        this.transform = transform;
    }

    /**
     * Fetch historical data (requires buildRestUrl and parseResponse)
     */
    public async fetchHistoricalData(
        symbol: string,
        interval: string,
        limit = 180
    ): Promise<CandlestickDataPoint[]> {
        if (!this.buildRestUrl || !this.config.restBaseUrl) {
            console.warn('[GenericWebSocketProvider] REST fetching not configured');
            return [];
        }

        try {
            const url = this.buildRestUrl(symbol, interval, limit);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            const response = await fetch(url, {
                headers: this.config.headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const rawData = await response.json();

            if (this.parseResponse) {
                return this.parseResponse(rawData);
            }

            // Try to handle array of objects directly
            if (Array.isArray(rawData)) {
                return rawData.map((item): CandlestickDataPoint => ({
                    time: item.time || item.t || item.timestamp,
                    open: parseFloat(item.open ?? item.o ?? 0),
                    high: parseFloat(item.high ?? item.h ?? 0),
                    low: parseFloat(item.low ?? item.l ?? 0),
                    close: parseFloat(item.close ?? item.c ?? 0),
                    volume: parseFloat(item.volume ?? item.v ?? 0),
                }));
            }

            return [];
        } catch (error) {
            console.error('[GenericWebSocketProvider] Failed to fetch data:', error);
            return [];
        }
    }

    /**
     * Connect to WebSocket stream
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

        const wsUrl = this.buildWsUrl(this.currentConfig);
        console.log(`[GenericWebSocketProvider] Connecting to ${wsUrl}`);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('[GenericWebSocketProvider] Connected');
            this.reconnectAttempts = 0;
            if (this.currentOnStatus) {
                this.currentOnStatus('connected');
            }
        };

        this.ws.onmessage = (event) => {
            const parsed = this.parseMessage(event.data);

            if (parsed && this.currentOnData) {
                let candle = parsed.candle;

                // Apply transform if set
                if (this.transform) {
                    candle = this.transform(candle);
                }

                this.currentOnData(candle, parsed.isClosed);
            }
        };

        this.ws.onerror = (err) => {
            console.error('[GenericWebSocketProvider] Error:', err);
            if (this.currentOnStatus) {
                this.currentOnStatus('error', new Error('WebSocket error'));
            }
        };

        this.ws.onclose = () => {
            console.log('[GenericWebSocketProvider] Disconnected');
            if (this.currentOnStatus) {
                this.currentOnStatus('disconnected');
            }

            if (this.config.autoReconnect && this.currentConfig) {
                this.attemptReconnect();
            }
        };
    }

    /**
     * Attempt reconnection
     */
    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
            console.log('[GenericWebSocketProvider] Max reconnect attempts reached');
            return;
        }

        this.reconnectAttempts++;
        console.log(`[GenericWebSocketProvider] Reconnecting ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`);

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

export default GenericWebSocketProvider;
