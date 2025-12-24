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

export const DataPointSchema = z.object({
    id: z.string(),
    x: z.number(),
    y: z.number(),
    z: z.number(),
    color: z.string().optional(),
    open: z.number().optional(),
    close: z.number().optional(),
});

export type DataPoint = z.infer<typeof DataPointSchema>;

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
    disabled: false,
    loading: false,
};
