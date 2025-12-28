/**
 * @fileoverview TestChart Component Model
 * @module components/Charts/TestChart
 * 
 * Model for test scenario chart visualization with price series and step markers.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Price point schema
 */
export const PricePointSchema = z.object({
    /** Index in series */
    index: z.number(),
    /** Price value */
    price: z.number(),
    /** Timestamp (optional) */
    timestamp: z.number().optional(),
});

/**
 * Step marker schema - marks a point on the chart
 */
export const StepMarkerSchema = z.object({
    /** Step index (x-axis) */
    stepIndex: z.number(),
    /** Step label */
    label: z.string().optional(),
    /** Marker type */
    type: z.enum(['click', 'inversion', 'entry', 'exit', 'info']).default('info'),
    /** Status for coloring */
    status: z.enum(['pending', 'passed', 'failed']).default('pending'),
    /** PnL value at this step */
    pnl: z.number().optional(),
});

/**
 * Threshold line schema - horizontal line
 */
export const ThresholdLineSchema = z.object({
    /** Name/label */
    label: z.string(),
    /** Y-axis value */
    value: z.number(),
    /** Line type */
    type: z.enum(['click', 'inversion', 'entry', 'target']).default('click'),
    /** Color override */
    color: z.string().optional(),
});

/**
 * TestChart model schema
 */
export const TestChartModelSchema = extendSchema({
    /** Price data points */
    prices: z.array(PricePointSchema).default([]),

    /** Step markers on chart */
    markers: z.array(StepMarkerSchema).default([]),

    /** Threshold lines */
    thresholds: z.array(ThresholdLineSchema).default([]),

    /** Entry price (horizontal line) */
    entryPrice: z.number().optional(),

    /** Current price highlight */
    currentIndex: z.number().default(-1),

    /** Chart title */
    title: z.string().optional(),

    /** Show grid lines */
    showGrid: z.boolean().default(true),

    /** Show legend */
    showLegend: z.boolean().default(true),

    /** Chart height in pixels */
    height: z.number().default(300),

    /** Animation enabled */
    animate: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type PricePoint = z.infer<typeof PricePointSchema>;
export type StepMarker = z.infer<typeof StepMarkerSchema>;
export type ThresholdLine = z.infer<typeof ThresholdLineSchema>;
export type TestChartModel = z.infer<typeof TestChartModelSchema>;

export const defaultTestChartModel: TestChartModel = TestChartModelSchema.parse({});

/**
 * Factory function to create TestChart model
 */
export function createTestChartModel(data: Partial<TestChartModel> = {}): TestChartModel {
    return TestChartModelSchema.parse(data);
}


