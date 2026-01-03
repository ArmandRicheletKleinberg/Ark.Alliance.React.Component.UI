/**
 * @fileoverview Test Chart Component Wrapper
 * @module infrastructure/wrappers/TestChartWrapper
 * 
 * Generates simulated price data with markers and thresholds for TestChart showcase.
 */

import React, { useMemo } from 'react';
import { TestChart, TestChartModel } from 'ark-alliance-react-ui';

interface TestChartWrapperProps extends Omit<TestChartModel, 'prices' | 'markers' | 'thresholds'> {
    pointCount: number;
    basePrice: number;
    volatility: number;
}

export const TestChartWrapper: React.FC<TestChartWrapperProps> = ({
    pointCount = 50,
    basePrice = 1000,
    volatility = 10,
    ...props
}) => {

    const { prices, markers, thresholds } = useMemo(() => {
        const p = [];
        let current = basePrice;
        for (let i = 0; i < pointCount; i++) {
            current += (Math.random() - 0.5) * volatility;
            p.push({
                index: i,
                price: current
            });
        }

        const m = [];
        // Add some random markers
        for (let i = 5; i < pointCount; i += 10) {
            m.push({
                stepIndex: i,
                label: `Step ${i}`,
                type: 'info' as const,
                status: 'passed' as const
            });
        }

        const t = [
            { label: 'Target', value: basePrice + volatility * 5, type: 'target' as const },
            { label: 'Stop', value: basePrice - volatility * 5, type: 'inversion' as const }
        ];

        return { prices: p, markers: m, thresholds: t };
    }, [pointCount, basePrice, volatility]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <TestChart
                prices={prices}
                markers={markers}
                thresholds={thresholds}
                {...props}
            />
        </div>
    );
};
