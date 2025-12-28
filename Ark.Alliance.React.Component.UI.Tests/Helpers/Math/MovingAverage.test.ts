/**
 * @fileoverview MovingAverage Math Helper Unit Tests
 * @module tests/Helpers/Math/MovingAverage
 * 
 * Tests for SMA, EMA, and MA crossover detection functions.
 */

import { describe, it, expect } from 'vitest';
import {
    calculateSMA,
    calculateEMA,
    calculateMA,
    detectMACrossover,
    type PriceDataPoint,
    type MADataPoint,
} from '@lib/Helpers/Math/MovingAverage';

// ═══════════════════════════════════════════════════════════════════════════
// TEST DATA
// ═══════════════════════════════════════════════════════════════════════════

const sampleData: PriceDataPoint[] = [
    { time: 1, close: 100 },
    { time: 2, close: 102 },
    { time: 3, close: 101 },
    { time: 4, close: 104 },
    { time: 5, close: 103 },
    { time: 6, close: 106 },
    { time: 7, close: 105 },
    { time: 8, close: 108 },
    { time: 9, close: 107 },
    { time: 10, close: 110 },
];

// ═══════════════════════════════════════════════════════════════════════════
// SMA TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateSMA', () => {
    it('should return empty array when data length < period', () => {
        const data = [{ time: 1, close: 100 }];
        const result = calculateSMA(data, 3);
        expect(result).toEqual([]);
    });

    it('should return empty array when period < 1', () => {
        const result = calculateSMA(sampleData, 0);
        expect(result).toEqual([]);
    });

    it('should calculate correct 3-period SMA', () => {
        const data: PriceDataPoint[] = [
            { time: 1, close: 100 },
            { time: 2, close: 102 },
            { time: 3, close: 101 },
        ];
        const result = calculateSMA(data, 3);

        expect(result).toHaveLength(1);
        expect(result[0].time).toBe(3);
        expect(result[0].value).toBeCloseTo(101, 2); // (100+102+101)/3
    });

    it('should calculate correct 2-period SMA for longer dataset', () => {
        const result = calculateSMA(sampleData, 2);

        expect(result).toHaveLength(9); // 10 - 2 + 1
        expect(result[0].time).toBe(2);
        expect(result[0].value).toBeCloseTo(101, 2); // (100+102)/2
        expect(result[1].time).toBe(3);
        expect(result[1].value).toBeCloseTo(101.5, 2); // (102+101)/2
    });

    it('should calculate correct 5-period SMA', () => {
        const result = calculateSMA(sampleData, 5);

        expect(result).toHaveLength(6); // 10 - 5 + 1
        expect(result[0].time).toBe(5);
        expect(result[0].value).toBeCloseTo(102, 2); // (100+102+101+104+103)/5
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// EMA TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateEMA', () => {
    it('should return empty array when data length < period', () => {
        const data = [{ time: 1, close: 100 }];
        const result = calculateEMA(data, 3);
        expect(result).toEqual([]);
    });

    it('should return empty array when period < 1', () => {
        const result = calculateEMA(sampleData, 0);
        expect(result).toEqual([]);
    });

    it('should start with SMA for first EMA value', () => {
        const data: PriceDataPoint[] = [
            { time: 1, close: 100 },
            { time: 2, close: 102 },
            { time: 3, close: 101 },
        ];

        // First EMA value = SMA of first 'period' values
        const result = calculateEMA(data, 3);

        expect(result).toHaveLength(1);
        expect(result[0].time).toBe(3);
        expect(result[0].value).toBeCloseTo(101, 2); // Same as SMA
    });

    it('should weight recent prices more heavily than SMA', () => {
        // Create data with a recent spike
        const data: PriceDataPoint[] = [
            { time: 1, close: 100 },
            { time: 2, close: 100 },
            { time: 3, close: 100 },
            { time: 4, close: 100 },
            { time: 5, close: 150 }, // Big spike
        ];

        const sma = calculateSMA(data, 3);
        const ema = calculateEMA(data, 3);

        // EMA should react more to the spike than SMA
        const lastSMA = sma[sma.length - 1].value;
        const lastEMA = ema[ema.length - 1].value;

        expect(lastEMA).toBeGreaterThan(lastSMA);
    });

    it('should calculate EMA with correct multiplier', () => {
        // 2-period EMA, multiplier = 2/(2+1) = 0.6667
        const data: PriceDataPoint[] = [
            { time: 1, close: 100 },
            { time: 2, close: 110 },
            { time: 3, close: 120 },
        ];

        const result = calculateEMA(data, 2);

        // First value: SMA of first 2 = (100+110)/2 = 105
        expect(result[0].value).toBeCloseTo(105, 2);

        // Second value: (120 - 105) * 0.6667 + 105 = 115
        expect(result[1].value).toBeCloseTo(115, 2);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// calculateMA TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateMA', () => {
    it('should default to SMA when type not specified', () => {
        const smaResult = calculateSMA(sampleData, 3);
        const maResult = calculateMA(sampleData, 3);

        expect(maResult).toEqual(smaResult);
    });

    it('should calculate SMA when type is SMA', () => {
        const smaResult = calculateSMA(sampleData, 3);
        const maResult = calculateMA(sampleData, 3, 'SMA');

        expect(maResult).toEqual(smaResult);
    });

    it('should calculate EMA when type is EMA', () => {
        const emaResult = calculateEMA(sampleData, 3);
        const maResult = calculateMA(sampleData, 3, 'EMA');

        expect(maResult).toEqual(emaResult);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// CROSSOVER DETECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('detectMACrossover', () => {
    it('should return null when data is insufficient', () => {
        const fastMA: MADataPoint[] = [{ time: 1, value: 100 }];
        const slowMA: MADataPoint[] = [{ time: 1, value: 100 }];

        expect(detectMACrossover(fastMA, slowMA)).toBeNull();
    });

    it('should detect bullish crossover (fast crosses above slow)', () => {
        const fastMA: MADataPoint[] = [
            { time: 1, value: 98 }, // Below slow
            { time: 2, value: 102 }, // Now above slow
        ];
        const slowMA: MADataPoint[] = [
            { time: 1, value: 100 },
            { time: 2, value: 100 },
        ];

        expect(detectMACrossover(fastMA, slowMA)).toBe('BULLISH');
    });

    it('should detect bearish crossover (fast crosses below slow)', () => {
        const fastMA: MADataPoint[] = [
            { time: 1, value: 102 }, // Above slow
            { time: 2, value: 98 }, // Now below slow
        ];
        const slowMA: MADataPoint[] = [
            { time: 1, value: 100 },
            { time: 2, value: 100 },
        ];

        expect(detectMACrossover(fastMA, slowMA)).toBe('BEARISH');
    });

    it('should return null when no crossover', () => {
        const fastMA: MADataPoint[] = [
            { time: 1, value: 102 },
            { time: 2, value: 104 }, // Still above
        ];
        const slowMA: MADataPoint[] = [
            { time: 1, value: 100 },
            { time: 2, value: 100 },
        ];

        expect(detectMACrossover(fastMA, slowMA)).toBeNull();
    });

    it('should handle equal values correctly', () => {
        const fastMA: MADataPoint[] = [
            { time: 1, value: 100 }, // Equal
            { time: 2, value: 102 }, // Now above
        ];
        const slowMA: MADataPoint[] = [
            { time: 1, value: 100 },
            { time: 2, value: 100 },
        ];

        expect(detectMACrossover(fastMA, slowMA)).toBe('BULLISH');
    });
});
