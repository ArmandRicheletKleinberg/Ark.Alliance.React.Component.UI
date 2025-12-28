/**
 * @fileoverview ScaleCalculations Math Helper Unit Tests
 * @module tests/Helpers/Math/ScaleCalculations
 * 
 * Tests for chart scale calculations and coordinate transformations.
 */

import { describe, it, expect } from 'vitest';
import {
    calculateChartScale,
    extendScaleForPrices,
    createCoordinateTransform,
    timeToX,
    priceToY,
    generateLinePath,
    generateAreaPath,
    type OHLCDataPoint,
    type ChartScale,
    type Point,
} from '@lib/Helpers/Math/ScaleCalculations';

// ═══════════════════════════════════════════════════════════════════════════
// TEST DATA
// ═══════════════════════════════════════════════════════════════════════════

const sampleOHLC: OHLCDataPoint[] = [
    { time: 1000, open: 100, high: 105, low: 98, close: 103 },
    { time: 2000, open: 103, high: 108, low: 101, close: 106 },
    { time: 3000, open: 106, high: 110, low: 104, close: 108 },
];

// ═══════════════════════════════════════════════════════════════════════════
// SCALE CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateChartScale', () => {
    it('should return default scale for empty data', () => {
        const result = calculateChartScale([]);

        expect(result.x.min).toBe(0);
        expect(result.x.max).toBe(1);
        expect(result.x.range).toBe(1);
        expect(result.y.min).toBe(0);
        expect(result.y.max).toBe(1);
        expect(result.y.range).toBe(1);
    });

    it('should calculate correct X axis scale from time values', () => {
        const result = calculateChartScale(sampleOHLC);

        expect(result.x.min).toBe(1000);
        expect(result.x.max).toBe(3000);
        expect(result.x.range).toBe(2000);
    });

    it('should calculate correct Y axis scale from high/low values', () => {
        const result = calculateChartScale(sampleOHLC, 0);

        // Without padding: min=98, max=110
        expect(result.y.min).toBe(98);
        expect(result.y.max).toBe(110);
        expect(result.y.range).toBe(12);
    });

    it('should apply padding to Y axis', () => {
        const result = calculateChartScale(sampleOHLC, 0.1); // 10% padding

        // Without padding: range = 110-98 = 12
        // Padding = 12 * 0.1 = 1.2
        expect(result.y.min).toBeCloseTo(98 - 1.2, 1);
        expect(result.y.max).toBeCloseTo(110 + 1.2, 1);
    });

    it('should use 5% default padding', () => {
        const result = calculateChartScale(sampleOHLC);

        // Range = 12, padding = 0.6
        expect(result.y.min).toBeCloseTo(97.4, 1);
        expect(result.y.max).toBeCloseTo(110.6, 1);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// EXTEND SCALE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('extendScaleForPrices', () => {
    it('should return original scale when no additional prices', () => {
        const scale = calculateChartScale(sampleOHLC);
        const result = extendScaleForPrices(scale, []);

        expect(result).toEqual(scale);
    });

    it('should extend scale to include higher threshold', () => {
        const scale = calculateChartScale(sampleOHLC, 0);
        const result = extendScaleForPrices(scale, [120], 0);

        expect(result.y.max).toBe(120);
    });

    it('should extend scale to include lower threshold', () => {
        const scale = calculateChartScale(sampleOHLC, 0);
        const result = extendScaleForPrices(scale, [90], 0);

        expect(result.y.min).toBe(90);
    });

    it('should handle multiple additional prices', () => {
        const scale = calculateChartScale(sampleOHLC, 0);
        const result = extendScaleForPrices(scale, [90, 120], 0);

        expect(result.y.min).toBe(90);
        expect(result.y.max).toBe(120);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COORDINATE TRANSFORM TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('createCoordinateTransform', () => {
    const scale: ChartScale = {
        x: { min: 0, max: 100, range: 100 },
        y: { min: 0, max: 100, range: 100 },
    };
    const svgWidth = 500;
    const svgHeight = 300;
    const padding = 50;

    it('should transform min values to top-left of chart area', () => {
        const transform = createCoordinateTransform(scale, svgWidth, svgHeight, padding);
        const point = transform(0, 100); // min X, max Y (top-left of data)

        expect(point.x).toBe(padding);
        expect(point.y).toBe(padding);
    });

    it('should transform max values to bottom-right of chart area', () => {
        const transform = createCoordinateTransform(scale, svgWidth, svgHeight, padding);
        const point = transform(100, 0); // max X, min Y (bottom-right of data)

        expect(point.x).toBe(svgWidth - padding);
        expect(point.y).toBe(svgHeight - padding);
    });

    it('should transform center values to center of chart area', () => {
        const transform = createCoordinateTransform(scale, svgWidth, svgHeight, padding);
        const point = transform(50, 50); // Center

        const expectedX = padding + (400 / 2); // 50 + 200 = 250
        const expectedY = padding + (200 / 2); // 50 + 100 = 150

        expect(point.x).toBe(expectedX);
        expect(point.y).toBe(expectedY);
    });
});

describe('timeToX', () => {
    const scale: ChartScale = {
        x: { min: 0, max: 100, range: 100 },
        y: { min: 0, max: 100, range: 100 },
    };

    it('should convert time to X coordinate', () => {
        const x = timeToX(50, scale, 400, 50);

        // 50 + (50/100) * 400 = 50 + 200 = 250
        expect(x).toBe(250);
    });
});

describe('priceToY', () => {
    const scale: ChartScale = {
        x: { min: 0, max: 100, range: 100 },
        y: { min: 0, max: 100, range: 100 },
    };

    it('should convert price to Y coordinate (inverted)', () => {
        const y = priceToY(75, scale, 200, 50);

        // 50 + 200 - (75/100) * 200 = 50 + 200 - 150 = 100
        expect(y).toBe(100);
    });

    it('should have Y=padding for max price', () => {
        const y = priceToY(100, scale, 200, 50);
        expect(y).toBe(50);
    });

    it('should have Y=padding+chartHeight for min price', () => {
        const y = priceToY(0, scale, 200, 50);
        expect(y).toBe(250);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// PATH GENERATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('generateLinePath', () => {
    it('should return empty string for empty data', () => {
        const result = generateLinePath([], (t, v) => ({ x: t, y: v }));
        expect(result).toBe('');
    });

    it('should generate valid SVG path for single point', () => {
        const data = [{ time: 100, value: 50 }];
        const result = generateLinePath(data, (t, v) => ({ x: t, y: v }));

        expect(result).toBe('M 100 50');
    });

    it('should generate valid SVG path for multiple points', () => {
        const data = [
            { time: 0, value: 0 },
            { time: 100, value: 50 },
            { time: 200, value: 100 },
        ];
        const result = generateLinePath(data, (t, v) => ({ x: t, y: v }));

        expect(result).toBe('M 0 0 L 100 50 L 200 100');
    });
});

describe('generateAreaPath', () => {
    it('should return empty string for empty path', () => {
        const result = generateAreaPath('', 0, 100, 200);
        expect(result).toBe('');
    });

    it('should close path for area chart', () => {
        const linePath = 'M 0 50 L 100 75 L 200 60';
        const result = generateAreaPath(linePath, 0, 200, 300);

        expect(result).toBe('M 0 50 L 100 75 L 200 60 L 200 300 L 0 300 Z');
    });
});
