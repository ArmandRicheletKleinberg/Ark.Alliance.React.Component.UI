/**
 * @fileoverview Data Provider Interface
 * @module core/services/DataProviderInterface
 * 
 * Generic interface for data providers supporting both REST and WebSocket connections.
 * Enables provider-agnostic chart data fetching and streaming.
 */

import type { CandlestickDataPoint } from '../../components/Charts/primitives';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for streaming connections
 */
export interface StreamConfig {
    /** WebSocket endpoint URL */
    endpoint: string;
    /** Trading symbol (e.g., 'BTCUSDT') */
    symbol: string;
    /** Time interval (e.g., '1m', '15m', '1h') */
    interval: string;
    /** Additional parameters */
    params?: Record<string, string>;
}

/**
 * Configuration for REST data fetching
 */
export interface FetchConfig {
    /** REST API endpoint URL */
    endpoint: string;
    /** Request headers */
    headers?: Record<string, string>;
    /** Request timeout in milliseconds */
    timeout?: number;
}

/**
 * Callback for receiving new data points
 */
export type DataCallback = (data: CandlestickDataPoint, isCandleClose: boolean) => void;

/**
 * Callback for connection status changes
 */
export type ConnectionCallback = (status: 'connected' | 'disconnected' | 'error', error?: Error) => void;

/**
 * Data transformation function
 */
export type DataTransform<T = unknown> = (raw: T) => CandlestickDataPoint;

/**
 * Generic data provider interface
 */
export interface IDataProvider {
    /** Provider name for identification */
    readonly name: string;

    /** Whether the provider is currently connected */
    readonly isConnected: boolean;

    /**
     * Fetch historical candlestick data
     * @param symbol - Trading symbol
     * @param interval - Time interval
     * @param limit - Maximum number of candles to fetch
     * @returns Promise resolving to array of candlestick data points
     */
    fetchHistoricalData(
        symbol: string,
        interval: string,
        limit?: number
    ): Promise<CandlestickDataPoint[]>;

    /**
     * Connect to streaming data source
     * @param config - Stream configuration
     * @param onData - Callback for new data
     * @param onStatus - Callback for connection status changes
     */
    connect(
        config: StreamConfig,
        onData: DataCallback,
        onStatus?: ConnectionCallback
    ): void;

    /**
     * Disconnect from streaming data source
     */
    disconnect(): void;

    /**
     * Set custom data transformation function
     * @param transform - Transform function
     */
    setTransform?(transform: DataTransform): void;
}

/**
 * Configuration options for creating a data provider
 */
export interface DataProviderConfig {
    /** Base URL for REST API */
    restBaseUrl?: string;
    /** Base URL for WebSocket */
    wsBaseUrl?: string;
    /** Default request headers */
    headers?: Record<string, string>;
    /** Default request timeout */
    timeout?: number;
    /** Data transformation function */
    transform?: DataTransform;
    /** Auto-reconnect on disconnect */
    autoReconnect?: boolean;
    /** Reconnect delay in milliseconds */
    reconnectDelay?: number;
    /** Maximum reconnect attempts */
    maxReconnectAttempts?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default provider configuration
 */
export const DEFAULT_PROVIDER_CONFIG: Required<Omit<DataProviderConfig, 'transform'>> = {
    restBaseUrl: '',
    wsBaseUrl: '',
    headers: {},
    timeout: 10000,
    autoReconnect: true,
    reconnectDelay: 3000,
    maxReconnectAttempts: 5,
};
