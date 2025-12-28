/**
 * @fileoverview Data Provider Hook
 * @module core/services/useDataProvider
 * 
 * React hook for consuming data providers with automatic cleanup
 * and connection management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { IDataProvider, StreamConfig, ConnectionCallback } from './DataProviderInterface';
import type { CandlestickDataPoint } from '../../components/Charts/primitives';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Connection status
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Options for useDataProvider hook
 */
export interface UseDataProviderOptions {
    /** Data provider instance */
    provider: IDataProvider;
    /** Stream configuration */
    streamConfig?: StreamConfig;
    /** Whether to auto-connect on mount */
    autoConnect?: boolean;
    /** Whether to fetch historical data on connect */
    fetchHistory?: boolean;
    /** Number of historical candles to fetch */
    historyLimit?: number;
    /** Maximum data points to keep in buffer */
    maxDataPoints?: number;
    /** Callback when new data arrives */
    onData?: (data: CandlestickDataPoint, isClosed: boolean) => void;
    /** Callback when connection status changes */
    onStatusChange?: (status: ConnectionStatus) => void;
}

/**
 * Return type for useDataProvider hook
 */
export interface UseDataProviderResult {
    /** Current candlestick data */
    data: CandlestickDataPoint[];
    /** Current connection status */
    status: ConnectionStatus;
    /** Whether currently loading historical data */
    isLoading: boolean;
    /** Error if any */
    error: Error | null;
    /** Connect to stream */
    connect: () => void;
    /** Disconnect from stream */
    disconnect: () => void;
    /** Fetch historical data */
    fetchHistory: (symbol: string, interval: string, limit?: number) => Promise<CandlestickDataPoint[]>;
    /** Clear current data */
    clearData: () => void;
    /** Add data point manually */
    addDataPoint: (point: CandlestickDataPoint) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * React hook for data provider consumption
 * 
 * Manages WebSocket connections, historical data fetching,
 * and data buffer with automatic cleanup.
 * 
 * @example
 * ```tsx
 * const provider = new BinanceDataProvider();
 * 
 * function MyChart() {
 *     const {
 *         data,
 *         status,
 *         connect,
 *         disconnect,
 *     } = useDataProvider({
 *         provider,
 *         streamConfig: { endpoint: '', symbol: 'BTCUSDT', interval: '1m' },
 *         autoConnect: true,
 *         fetchHistory: true,
 *     });
 *     
 *     return <Chart data={data} isConnected={status === 'connected'} />;
 * }
 * ```
 */
export function useDataProvider(options: UseDataProviderOptions): UseDataProviderResult {
    const {
        provider,
        streamConfig,
        autoConnect = false,
        fetchHistory: shouldFetchHistory = true,
        historyLimit = 180,
        maxDataPoints = 180,
        onData,
        onStatusChange,
    } = options;

    const [data, setData] = useState<CandlestickDataPoint[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mountedRef = useRef(true);
    const configRef = useRef(streamConfig);

    // Update config ref when it changes
    useEffect(() => {
        configRef.current = streamConfig;
    }, [streamConfig]);

    /**
     * Handle status change
     */
    const handleStatusChange: ConnectionCallback = useCallback((newStatus, err) => {
        if (!mountedRef.current) return;

        let mappedStatus: ConnectionStatus;
        switch (newStatus) {
            case 'connected':
                mappedStatus = 'connected';
                break;
            case 'disconnected':
                mappedStatus = 'disconnected';
                break;
            case 'error':
                mappedStatus = 'error';
                if (err) setError(err);
                break;
            default:
                mappedStatus = 'disconnected';
        }

        setStatus(mappedStatus);
        if (onStatusChange) {
            onStatusChange(mappedStatus);
        }
    }, [onStatusChange]);

    /**
     * Handle incoming data
     */
    const handleData = useCallback((point: CandlestickDataPoint, isClosed: boolean) => {
        if (!mountedRef.current) return;

        setData(prev => {
            const last = prev[prev.length - 1];

            let newData: CandlestickDataPoint[];

            // Update existing candle or add new one
            if (last && last.time === point.time) {
                // Update current candle
                newData = [...prev.slice(0, -1), point];
            } else {
                // Add new candle
                newData = [...prev, point];
            }

            // Apply sliding window
            if (newData.length > maxDataPoints) {
                newData = newData.slice(-maxDataPoints);
            }

            return newData;
        });

        if (onData) {
            onData(point, isClosed);
        }
    }, [maxDataPoints, onData]);

    /**
     * Fetch historical data
     */
    const fetchHistoryFn = useCallback(async (
        symbol: string,
        interval: string,
        limit = historyLimit
    ): Promise<CandlestickDataPoint[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const history = await provider.fetchHistoricalData(symbol, interval, limit);

            if (mountedRef.current) {
                setData(history);
                setIsLoading(false);
            }

            return history;
        } catch (err) {
            if (mountedRef.current) {
                setError(err as Error);
                setIsLoading(false);
            }
            return [];
        }
    }, [provider, historyLimit]);

    /**
     * Connect to stream
     */
    const connect = useCallback(async () => {
        const config = configRef.current;
        if (!config) {
            console.warn('[useDataProvider] No stream config provided');
            return;
        }

        setStatus('connecting');
        setError(null);

        // Fetch history first if enabled
        if (shouldFetchHistory) {
            await fetchHistoryFn(config.symbol, config.interval, historyLimit);
        }

        // Connect to stream
        provider.connect(config, handleData, handleStatusChange);
    }, [provider, shouldFetchHistory, historyLimit, fetchHistoryFn, handleData, handleStatusChange]);

    /**
     * Disconnect from stream
     */
    const disconnect = useCallback(() => {
        provider.disconnect();
        setStatus('disconnected');
    }, [provider]);

    /**
     * Clear data buffer
     */
    const clearData = useCallback(() => {
        setData([]);
    }, []);

    /**
     * Add data point manually
     */
    const addDataPoint = useCallback((point: CandlestickDataPoint) => {
        handleData(point, false);
    }, [handleData]);

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (autoConnect && streamConfig) {
            connect();
        }

        return () => {
            mountedRef.current = false;
            provider.disconnect();
        };
    }, []); // Only run on mount

    // Reconnect when config changes
    useEffect(() => {
        if (streamConfig && status === 'connected') {
            // Disconnect and reconnect with new config
            disconnect();
            setTimeout(() => connect(), 100);
        }
    }, [streamConfig?.symbol, streamConfig?.interval]);

    return {
        data,
        status,
        isLoading,
        error,
        connect,
        disconnect,
        fetchHistory: fetchHistoryFn,
        clearData,
        addDataPoint,
    };
}

export default useDataProvider;
