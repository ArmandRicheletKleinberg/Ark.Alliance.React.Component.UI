/**
 * @fileoverview OrgChartConnector Primitive Model
 * @module components/TreeView/OrgChart/primitives
 * 
 * Defines the data model for organizational chart connection lines.
 * Connectors visualize the hierarchical relationships between nodes.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Types of connectors used in organizational charts
 */
export const ConnectorTypeSchema = z.enum([
    /** Vertical line from parent to horizontal bridge */
    'vertical',
    /** Horizontal line connecting siblings */
    'horizontal-bridge',
    /** Individual line from bridge to child */
    'child-branch',
]);

export type ConnectorType = z.infer<typeof ConnectorTypeSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OrgChartConnector model schema
 */
export const OrgChartConnectorModelSchema = z.object({
    /** Line color (CSS color value) */
    color: z.string().default('var(--primary-color, #3b82f6)'),

    /** Line width in pixels */
    width: z.preprocess(
        (val) => (val === undefined || val === null ? 2 : Number(val)),
        z.number().min(1).max(10)
    ).default(2),

    /** Type of connector to render */
    type: ConnectorTypeSchema.default('vertical'),

    /** Number of child nodes (for calculating bridge width) */
    childCount: z.preprocess(
        (val) => (val === undefined || val === null ? 0 : Number(val)),
        z.number().min(0)
    ).default(0),

    /** Height of vertical connector in pixels */
    height: z.preprocess(
        (val) => (val === undefined || val === null ? 40 : Number(val)),
        z.number().min(0)
    ).default(40),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type OrgChartConnectorModel = z.infer<typeof OrgChartConnectorModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default connector model
 */
export const defaultOrgChartConnectorModel: OrgChartConnectorModel = {
    color: 'var(--primary-color, #3b82f6)',
    width: 2,
    type: 'vertical',
    childCount: 0,
    height: 40,
};

/**
 * Create a connector model with custom values
 * 
 * @param data - Partial connector model data
 * @returns Validated connector model
 */
export function createOrgChartConnectorModel(
    data: Partial<OrgChartConnectorModel> = {}
): OrgChartConnectorModel {
    return OrgChartConnectorModelSchema.parse(data);
}
