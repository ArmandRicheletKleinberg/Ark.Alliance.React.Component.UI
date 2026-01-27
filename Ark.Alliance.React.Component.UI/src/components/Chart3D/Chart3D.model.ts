/**
 * @fileoverview Chart3D Component Model
 * @module components/Chart3D
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export const ShapeTypeEnum = z.enum([
    'Cuboid',
    'Cylinder',
    'Bubble',
    'Candle',
    'Lines Only',
    'Surface'
]);

export type ShapeType = z.infer<typeof ShapeTypeEnum>;

// ═══════════════════════════════════════════════════════════════════════════
// DATA POINT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Schema for a 3D data point in the chart.
 * Supports both generic visualization and trading-specific data.
 */
export const DataPointSchema = z.object({
    /** Unique identifier for the data point */
    id: z.string(),
    /** X-axis position (typically time/sequence index) */
    x: z.number(),
    /** Y-axis position (normalized value/height) */
    y: z.number(),
    /** Z-axis position (series/depth index) */
    z: z.number(),
    /** Optional custom color override */
    color: z.string().optional(),
    /** Optional open value for candle visualization */
    open: z.number().optional(),
    /** Optional close value for candle visualization */
    close: z.number().optional(),
    /** Optional original price value (for trading data) */
    price: z.number().optional(),
    /** Optional Unix timestamp in milliseconds */
    timestamp: z.number().optional(),
});

export type DataPoint = z.infer<typeof DataPointSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// PRICE THRESHOLD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Line style for threshold indicators.
 */
export const ThresholdLineStyleEnum = z.enum(['solid', 'dashed', 'dotted']);
export type ThresholdLineStyle = z.infer<typeof ThresholdLineStyleEnum>;

/**
 * Schema for horizontal price threshold lines.
 * Used to display indicator levels such as take-profit, stop-loss, or custom levels.
 */
export const PriceThresholdSchema = z.object({
    /** Unique identifier for the threshold */
    id: z.string().optional(),
    /** Display label for the threshold line */
    label: z.string(),
    /** Price value for Y-axis positioning */
    price: z.number(),
    /** Line color (defaults to theme color if not specified) */
    color: z.string().optional(),
    /** Line style - solid, dashed, or dotted */
    lineStyle: ThresholdLineStyleEnum.default('dashed'),
    /** Whether to show the price label on the line */
    showPrice: z.boolean().default(true),
});

export type PriceThreshold = z.infer<typeof PriceThresholdSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// EVENT MARKERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Event types for 3D chart markers.
 * Extensible to support custom event types.
 */
export const ChartEventTypeEnum = z.enum([
    'click',      // Click/action events (typically green)
    'order',      // Order execution events (typically red/green based on side)
    'inversion',  // Position inversion events (typically purple)
    'custom',     // Custom event type
]);

export type ChartEventType = z.infer<typeof ChartEventTypeEnum>;

/**
 * Schema for 3D event markers (animated bubbles).
 * Displays significant events on the chart with hover/click details.
 */
export const ChartEventMarkerSchema = z.object({
    /** Unique identifier for the marker */
    id: z.string(),
    /** Type of event */
    type: ChartEventTypeEnum,
    /** Price value for Y-axis positioning */
    price: z.number(),
    /** Unix timestamp in milliseconds */
    timestamp: z.number(),
    /** Marker color */
    color: z.string(),
    /** Optional display label (shown on hover/selection) */
    label: z.string().optional(),
    /** Optional side indicator (BUY/SELL for order events) */
    side: z.enum(['BUY', 'SELL']).optional(),
    /** Optional quantity for order events */
    quantity: z.number().optional(),
    /** Optional PnL value at event time */
    pnl: z.number().optional(),
    /** Optional click count for click events */
    clickCount: z.number().optional(),
    /** Optional inversion count */
    inversionCount: z.number().optional(),
    /** Optional symbol/instrument identifier */
    symbol: z.string().optional(),
    /** Extensible metadata for custom event data */
    metadata: z.record(z.unknown()).optional(),
});

export type ChartEventMarker = z.infer<typeof ChartEventMarkerSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// PRICE RANGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Schema for price range used in Y-axis normalization.
 */
export const PriceRangeSchema = z.object({
    /** Minimum price value */
    min: z.number(),
    /** Maximum price value */
    max: z.number(),
});

export type PriceRange = z.infer<typeof PriceRangeSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CHART CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export const Chart3DModelSchema = extendSchema({
    /** Shape type for data visualization */
    shape: ShapeTypeEnum.default('Cuboid'),
    /** Show ribbon surface */
    showSurface: z.boolean().default(true),
    /** Show grid lines */
    showGrid: z.boolean().default(true),
    /** Enable real-time streaming */
    isStreaming: z.boolean().default(true),
    /** Update speed in ms */
    speed: z.number().min(100).max(2000).default(500),
    /** Y-axis scale multiplier */
    scaleY: z.number().min(0.5).max(2).default(1.0),
    /** Number of series (Z-axis) */
    seriesCount: z.number().min(1).max(5).default(2),
    /** Number of X-axis points */
    xResolution: z.number().min(20).max(200).default(100),
    /** Bloom/glow intensity */
    bloomIntensity: z.number().min(0).max(4).default(1.5),
    /** Shape opacity */
    shapeOpacity: z.number().min(0.1).max(1).default(0.9),
    /** Line thickness in px */
    lineThickness: z.number().min(0.5).max(10).default(3),
    /** Shape metalness */
    metalness: z.number().min(0).max(1).default(0.8),
    /** Surface roughness */
    roughness: z.number().min(0).max(1).default(0.2),
    /** Grid brightness */
    gridBrightness: z.number().min(0).max(1).default(0.5),
    /** Background image opacity */
    bgImageOpacity: z.number().min(0).max(1).default(0.35),
    /** Background image URL */
    bgImageUrl: z.string().nullable().default(null),
    /** Background image scale */
    bgImageScale: z.number().min(0.1).max(3).default(1.0),
    /** Font family */
    fontFamily: z.string().default('Inter'),
    /** Label font size */
    fontSizeLabels: z.number().min(0.2).max(2).default(0.8),
    /** Value font size */
    fontSizeValues: z.number().min(0.1).max(1).default(0.5),
    /** Dark mode */
    isDark: z.boolean().default(true),

    // ─────────────────────────────────────────────────────────────────────────
    // FULLSCREEN & HEADER OPTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /** Enable fullscreen toggle button */
    fullscreenEnabled: z.boolean().default(true),
    /** Show header overlay with title and status */
    showHeader: z.boolean().default(false),
    /** Header title text */
    headerTitle: z.string().optional(),
    /** Header subtitle or symbol */
    headerSubtitle: z.string().optional(),
    /** Show connection status indicator in header */
    showConnectionStatus: z.boolean().default(false),
    /** Connection status (for external control) */
    isConnected: z.boolean().default(false),
    /** Current value to display in header */
    currentValue: z.number().optional(),
    /** Value change percentage */
    valueChange: z.number().optional(),
});

export type Chart3DModel = z.infer<typeof Chart3DModelSchema>;

export const defaultChart3DModel: Chart3DModel = {
    shape: 'Cuboid',
    showSurface: true,
    showGrid: true,
    isStreaming: true,
    speed: 500,
    scaleY: 1.0,
    seriesCount: 2,
    xResolution: 100,
    bloomIntensity: 1.5,
    shapeOpacity: 0.9,
    lineThickness: 3,
    metalness: 0.8,
    roughness: 0.2,
    gridBrightness: 0.5,
    bgImageOpacity: 0.35,
    bgImageUrl: null,
    bgImageScale: 1.0,
    fontFamily: 'Inter',
    fontSizeLabels: 0.8,
    fontSizeValues: 0.5,
    isDark: true,
    fullscreenEnabled: true,
    showHeader: false,
    headerTitle: undefined,
    headerSubtitle: undefined,
    showConnectionStatus: false,
    isConnected: false,
    currentValue: undefined,
    valueChange: undefined,
    disabled: false,
    loading: false,
    focusable: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};
