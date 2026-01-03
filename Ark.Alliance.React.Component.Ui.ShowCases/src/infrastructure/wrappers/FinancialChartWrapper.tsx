/**
 * @fileoverview Financial Chart Component Wrapper
 * @module infrastructure/wrappers/FinancialChartWrapper
 * 
 * Generates simulated candlestick data for the FinancialChart showcase.
 * Supports configurable trends, volatility, and moving average parameters.
 */

import React, { useMemo } from 'react';
import { FinancialChart, FinancialChartModel } from 'ark-alliance-react-ui';

interface FinancialChartWrapperProps extends Omit<FinancialChartModel, 'candlestickData' | 'fastMA' | 'slowMA'> {
    dataPoints: number;
    startPrice: number;
    volatility: number;
    trend: 'up' | 'down' | 'flat';

    // Flattened Fast MA
    fastMA_enabled: boolean;
    fastMA_period: number;
    fastMA_color: string;
    fastMA_type: 'SMA' | 'EMA';

    // Flattened Slow MA
    slowMA_enabled: boolean;
    slowMA_period: number;
    slowMA_color: string;
    slowMA_type: 'SMA' | 'EMA';
}

export const FinancialChartWrapper: React.FC<FinancialChartWrapperProps> = ({
    dataPoints = 50,
    startPrice = 100,
    volatility = 2,
    trend = 'flat',
    fastMA_enabled = true,
    fastMA_period = 7,
    fastMA_color = '#22c55e',
    fastMA_type = 'SMA',
    slowMA_enabled = true,
    slowMA_period = 25,
    slowMA_color = '#ef4444',
    slowMA_type = 'SMA',
    ...props
}) => {
    // Ensure numeric types from props (which might come as strings from sliders)
    const points = Number(dataPoints) || 50;
    const start = Number(startPrice) || 100;
    const vol = Number(volatility) || 2;

    const candlestickData = useMemo(() => {
        const data = [];
        let currentPrice = start;
        const now = Date.now();

        for (let i = 0; i < points; i++) {
            const time = now - (points - i) * 60000;
            const trendFactor = trend === 'up' ? 0.5 : trend === 'down' ? -0.5 : 0;
            const change = (Math.random() - 0.5 + trendFactor * 0.1) * vol;

            const open = currentPrice;
            const close = currentPrice + change;
            const high = Math.max(open, close) + Math.random() * vol * 0.5;
            const low = Math.min(open, close) - Math.random() * vol * 0.5;

            data.push({
                time: time,
                open,
                high,
                low,
                close,
                volume: Math.floor(Math.random() * 1000)
            });

            currentPrice = close;
        }
        return data;
    }, [points, start, vol, trend]);

    const fastMA = useMemo(() => ({
        enabled: fastMA_enabled,
        period: fastMA_period,
        color: fastMA_color,
        type: fastMA_type
    }), [fastMA_enabled, fastMA_period, fastMA_color, fastMA_type]);

    const slowMA = useMemo(() => ({
        enabled: slowMA_enabled,
        period: slowMA_period,
        color: slowMA_color,
        type: slowMA_type
    }), [slowMA_enabled, slowMA_period, slowMA_color, slowMA_type]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <FinancialChart
                candlestickData={candlestickData}
                fastMA={fastMA}
                slowMA={slowMA}
                {...props}
            />
        </div>
    );
};
