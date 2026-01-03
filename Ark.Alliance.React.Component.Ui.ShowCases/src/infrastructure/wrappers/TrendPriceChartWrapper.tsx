/**
 * @fileoverview Trend Price Chart Component Wrapper
 * @module infrastructure/wrappers/TrendPriceChartWrapper
 * 
 * Generates simulated price data with predictions for the TrendPriceChart showcase.
 */

import React, { useMemo } from 'react';
import { TrendPriceChart, TrendPriceChartModel } from 'ark-alliance-react-ui';

interface TrendPriceChartWrapperProps extends Omit<TrendPriceChartModel, 'priceData' | 'predictions'> {
    dataPoints: number;
    startPrice: number;
    volatility: number;
}

export const TrendPriceChartWrapper: React.FC<TrendPriceChartWrapperProps> = ({
    dataPoints = 100,
    startPrice = 50000,
    volatility = 100,
    ...props
}) => {

    const { priceData, predictions } = useMemo(() => {
        const prices = [];
        const preds = [];
        let currentPrice = startPrice;
        const now = Date.now();

        for (let i = 0; i < dataPoints; i++) {
            const timestamp = now - (dataPoints - i) * 1000;
            const change = (Math.random() - 0.5) * volatility;
            currentPrice += change;

            prices.push({
                index: i,
                price: currentPrice,
                timestamp,
                volume: Math.random() * 100
            });

            // Generate random predictions occasionally
            if (i % 20 === 0) {
                preds.push({
                    id: `pred-${i}`,
                    timestamp,
                    priceAtPrediction: currentPrice,
                    direction: Math.random() > 0.5 ? 'LONG' : 'SHORT' as any,
                    compositeScore: Math.random() * 2 - 1,
                    confidence: Math.random(),
                    isValidated: false,
                    showHorizon: true,
                    horizonMs: 60000
                });
            }
        }
        return { priceData: prices, predictions: preds };
    }, [dataPoints, startPrice, volatility]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <TrendPriceChart
                priceData={priceData}
                predictions={predictions}
                {...props}
            />
        </div>
    );
};
