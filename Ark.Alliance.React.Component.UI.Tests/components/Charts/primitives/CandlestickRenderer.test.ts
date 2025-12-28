/**
 * @fileoverview CandlestickRenderer Component Unit Tests
 * @module tests/components/Charts/primitives/CandlestickRenderer
 * 
 * Tests for CandlestickRenderer model and viewmodel.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import {
    CandlestickDataPointSchema,
    CandlestickColorsSchema,
    CandlestickRendererModelSchema,
} from '@components/Charts/primitives/CandlestickRenderer.model';
import { useCandlestickRenderer } from '@components/Charts/primitives/CandlestickRenderer.viewmodel';

// ═══════════════════════════════════════════════════════════════════════════
// TEST DATA
// ═══════════════════════════════════════════════════════════════════════════

const sampleCandles = [
    { time: 1000, open: 100, high: 105, low: 98, close: 103 },   // Bullish
    { time: 2000, open: 103, high: 106, low: 100, close: 101 },  // Bearish
    { time: 3000, open: 101, high: 102, low: 100, close: 101 },  // Doji
];

// ═══════════════════════════════════════════════════════════════════════════
// MODEL SCHEMA TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('CandlestickDataPointSchema', () => {
    it('should parse valid OHLCV data', () => {
        const data = {
            time: 1000,
            open: 100,
            high: 110,
            low: 95,
            close: 105,
            volume: 1000000,
        };

        const result = CandlestickDataPointSchema.parse(data);

        expect(result.time).toBe(1000);
        expect(result.open).toBe(100);
        expect(result.high).toBe(110);
        expect(result.low).toBe(95);
        expect(result.close).toBe(105);
        expect(result.volume).toBe(1000000);
    });

    it('should make volume optional', () => {
        const data = {
            time: 1000,
            open: 100,
            high: 110,
            low: 95,
            close: 105,
        };

        const result = CandlestickDataPointSchema.parse(data);
        expect(result.volume).toBeUndefined();
    });
});

describe('CandlestickColorsSchema', () => {
    it('should use default colors when not specified', () => {
        const result = CandlestickColorsSchema.parse({});

        expect(result.bullish).toBeDefined();
        expect(result.bearish).toBeDefined();
        expect(result.doji).toBeDefined();
    });

    it('should accept custom colors', () => {
        const colors = {
            bullish: '#00FF00',
            bearish: '#FF0000',
            doji: '#808080',
        };

        const result = CandlestickColorsSchema.parse(colors);

        expect(result.bullish).toBe('#00FF00');
        expect(result.bearish).toBe('#FF0000');
        expect(result.doji).toBe('#808080');
    });
});

describe('CandlestickRendererModelSchema', () => {
    it('should parse with default values', () => {
        const result = CandlestickRendererModelSchema.parse({
            data: sampleCandles,
            width: 400,
            height: 300,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
        });

        expect(result.data).toHaveLength(3);
        expect(result.padding).toBeDefined();
        expect(result.showVolume).toBe(false);
    });

    it('should accept candleWidth override', () => {
        const result = CandlestickRendererModelSchema.parse({
            data: sampleCandles,
            width: 400,
            height: 300,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
            candleWidth: 20,
        });

        expect(result.candleWidth).toBe(20);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('useCandlestickRenderer', () => {
    it('should return candles with calculated positions', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: sampleCandles,
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
        }));

        expect(result.current.candles).toHaveLength(3);
    });

    it('should correctly identify bullish candles (isBullish=true)', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: [sampleCandles[0]], // Bullish: close > open (103 > 100)
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
        }));

        expect(result.current.candles[0].isBullish).toBe(true);
        expect(result.current.candles[0].isDoji).toBe(false);
    });

    it('should correctly identify bearish candles (isBullish=false)', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: [sampleCandles[1]], // Bearish: close < open (101 < 103)
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
        }));

        expect(result.current.candles[0].isBullish).toBe(false);
        expect(result.current.candles[0].isDoji).toBe(false);
    });

    it('should correctly identify doji candles (isDoji=true)', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: [sampleCandles[2]], // Doji: close === open (101 === 101)
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
        }));

        expect(result.current.candles[0].isDoji).toBe(true);
    });

    it('should calculate proper X positions', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: sampleCandles,
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
            padding: 0,
        }));

        // First candle at time 1000 should be at X = 0
        // Last candle at time 3000 should be at X = 600
        expect(result.current.candles[0].x).toBeCloseTo(0, 0);
        expect(result.current.candles[2].x).toBeCloseTo(600, 0);
    });

    it('should calculate proper Y positions (inverted)', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: sampleCandles,
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
            padding: 0,
        }));

        // High values should have lower Y (closer to top)
        const candle = result.current.candles[0];
        expect(candle.wickTop).toBeLessThan(candle.wickBottom);
    });

    it('should return chartWidth and chartHeight', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: sampleCandles,
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
        }));

        expect(result.current.chartWidth).toBeGreaterThan(0);
        expect(result.current.chartHeight).toBeGreaterThan(0);
    });

    it('should provide color for each candle', () => {
        const { result } = renderHook(() => useCandlestickRenderer({
            data: sampleCandles,
            width: 600,
            height: 400,
            minX: 1000,
            maxX: 3000,
            minY: 95,
            maxY: 110,
        }));

        // Each candle should have a color assigned
        result.current.candles.forEach(candle => {
            expect(candle.color).toBeDefined();
            expect(typeof candle.color).toBe('string');
        });
    });
});
