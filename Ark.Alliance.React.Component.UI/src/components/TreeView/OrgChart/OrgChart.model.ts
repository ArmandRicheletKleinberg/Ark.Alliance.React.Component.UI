/**
 * @fileoverview OrgChart Model
 * @module components/TreeView/OrgChart
 * 
 * Data model for organizational chart components.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Individual node in the org chart
 */
export interface OrgChartNodeData {
    id: string;
    name: string;
    position: string;
    department?: string;
    avatarUrl?: string;
    email?: string;
    children?: OrgChartNodeData[];
}

/**
 * OrgChart component model
 */
export interface OrgChartModel {
    /** Root nodes of the tree */
    rootNodes: OrgChartNodeData[];
    /** Organization name */
    organizationName?: string;
    /** Total member count */
    totalCount?: number;
    /** Line color for connections */
    lineColor: string;
    /** Line width in pixels */
    lineWidth: number;
    /** Currently selected node ID */
    selectedId?: string;
    /** Compact mode for mobile */
    compact: boolean;
    /** Test ID */
    testId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ZOD SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

const OrgChartNodeDataSchema: z.ZodType<OrgChartNodeData> = z.lazy(() =>
    z.object({
        id: z.string(),
        name: z.string(),
        position: z.string(),
        department: z.string().optional(),
        avatarUrl: z.string().optional(),
        email: z.string().optional(),
        children: z.array(OrgChartNodeDataSchema).optional(),
    })
);

export const OrgChartModelSchema = z.object({
    rootNodes: z.array(OrgChartNodeDataSchema),
    organizationName: z.string().optional(),
    totalCount: z.number().optional(),
    lineColor: z.string().default('var(--primary-color, #3b82f6)'),
    lineWidth: z.number().default(2),
    selectedId: z.string().optional(),
    compact: z.boolean().default(false),
    testId: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultOrgChartModel: OrgChartModel = {
    rootNodes: [],
    lineColor: 'var(--primary-color, #3b82f6)',
    lineWidth: 2,
    compact: false,
};

export default OrgChartModelSchema;
