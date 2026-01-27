/**
 * @fileoverview DataGrid Field Model
 * @module components/Grids/DataGrid
 * 
 * Column/field configuration for the data grid.
 */

import type { CSSProperties } from 'react';
import type { GridDataType, FieldAttribute } from './GridPrimitiveTypes';

// ═══════════════════════════════════════════════════════════════════════════
// CONDITIONAL STYLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Conditional styling rule based on cell value.
 */
export interface ConditionalStyleRule {
    /** JavaScript expression that returns a boolean */
    rule: string;
    /** CSS properties to apply when rule matches */
    style: CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// GAUGE CONFIG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for gauge-type fields.
 */
export interface GaugeFieldConfig {
    min?: number;
    max?: number;
    unit?: string;
    colorRanges?: Array<{
        min: number;
        max: number;
        color: string;
    }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MINI CHART CONFIG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for sparkline/timeseries fields.
 */
export interface MiniChartConfig {
    type?: 'line' | 'area' | 'bar';
    height?: number;
    color?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// FIELD MODEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Complete field/column definition.
 */
export interface FieldModel {
    // Core
    /** Physical column/property name in data source */
    fieldKey: string;
    /** Human-readable column header label */
    displayName: string;
    /** Data type for rendering */
    dataType: GridDataType;
    /** Maximum length for string fields */
    length?: number;
    /** Database field attributes */
    attributes?: FieldAttribute[];

    // Behavior
    /** Whether column supports sorting */
    sortable?: boolean;
    /** Whether column supports filtering */
    filterable?: boolean;
    /** Whether column can be resized */
    resizable?: boolean;

    // Layout
    /** Initial column width in pixels */
    width?: number;
    /** Frozen column position */
    frozen?: 'left' | 'right';
    /** Z-index for frozen column stacking */
    zIndex?: number;
    /** Horizontal text alignment */
    horizontalAlign?: 'left' | 'center' | 'right' | 'justify';
    /** Text overflow behavior */
    textBehavior?: 'wrap' | 'nowrap' | 'ellipsis';

    // Styling
    /** Conditional styling rules */
    conditionalStyles?: ConditionalStyleRule[];

    // Visual Analytics
    /** Gauge configuration */
    gaugeConfig?: GaugeFieldConfig;
    /** Sparkline configuration */
    miniChartConfig?: MiniChartConfig;

    // Access Control
    /** Required permissions to view column */
    requiredPermissions?: string[];
}
