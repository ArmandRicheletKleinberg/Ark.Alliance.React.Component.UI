/**
 * @fileoverview OrgChartTree Primitive Model
 * @module components/TreeView/OrgChart/primitives
 * 
 * Defines the data model for the organizational chart tree layout engine.
 * This primitive handles recursive rendering of hierarchical node structures.
 */

import { z } from 'zod';
import type { OrgChartNodeData } from '../OrgChart.model';

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tree orientation options
 */
export const TreeOrientationSchema = z.enum([
    /** Vertical tree (top to bottom) */
    'vertical',
    /** Horizontal tree (left to right) */
    'horizontal',
]);

export type TreeOrientation = z.infer<typeof TreeOrientationSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OrgChartTree model schema
 */
export const OrgChartTreeModelSchema = z.object({
    /** Current depth level in tree (0 = root) */
    level: z.preprocess(
        (val) => (val === undefined || val === null ? 0 : Number(val)),
        z.number().min(0)
    ).default(0),

    /** Parent node ID (undefined for root) */
    parentId: z.string().optional(),

    /** Line color for connections */
    lineColor: z.string().default('var(--primary-color, #3b82f6)'),

    /** Line width in pixels */
    lineWidth: z.preprocess(
        (val) => (val === undefined || val === null ? 2 : Number(val)),
        z.number().min(1).max(10)
    ).default(2),

    /** Tree orientation */
    orientation: TreeOrientationSchema.default('vertical'),

    /** Horizontal spacing between sibling nodes in pixels */
    nodeSpacing: z.preprocess(
        (val) => (val === undefined || val === null ? 24 : Number(val)),
        z.number().min(0)
    ).default(24),

    /** Vertical spacing between levels in pixels */
    levelSpacing: z.preprocess(
        (val) => (val === undefined || val === null ? 80 : Number(val)),
        z.number().min(0)
    ).default(80),

    /** Compact mode for smaller screens */
    compact: z.boolean().default(false),

    /** Currently selected node ID */
    selectedId: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type OrgChartTreeModel = z.infer<typeof OrgChartTreeModelSchema>;

/**
 * Props interface for OrgChartTree component
 */
export interface OrgChartTreeProps extends Partial<OrgChartTreeModel> {
    /** Node data to render */
    node: OrgChartNodeData;
    /** Node click callback */
    onNodeClick?: (nodeId: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default tree model
 */
export const defaultOrgChartTreeModel: OrgChartTreeModel = {
    level: 0,
    lineColor: 'var(--primary-color, #3b82f6)',
    lineWidth: 2,
    orientation: 'vertical',
    nodeSpacing: 24,
    levelSpacing: 80,
    compact: false,
};

/**
 * Create a tree model with custom values
 * 
 * @param data - Partial tree model data
 * @returns Validated tree model
 */
export function createOrgChartTreeModel(
    data: Partial<OrgChartTreeModel> = {}
): OrgChartTreeModel {
    return OrgChartTreeModelSchema.parse(data);
}
