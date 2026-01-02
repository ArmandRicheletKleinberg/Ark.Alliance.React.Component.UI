/**
 * @fileoverview TreeNode Component Model
 * @module components/TreeView/TreeNode
 * 
 * Defines the data structure for individual tree nodes, including recursive children.
 * Extends BaseComponentModel for interaction support.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// RECURSIVE SCHEMA DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface definition for recursive type support
 */
export interface TreeNodeItem {
    key: string;
    label: string;
    icon?: string;
    expandIcon?: string;
    collapseIcon?: string;
    children?: TreeNodeItem[];
    disabled?: boolean;
    badge?: number;
    metadata?: Record<string, unknown>;
}

/**
 * Base Zod Schema for Tree Node Data
 * Recursive definition using z.lazy()
 */
export const TreeNodeSchema: z.ZodType<TreeNodeItem> = z.object({
    /** Unique key for the node */
    key: z.string(),
    /** Label text */
    label: z.string(),
    /** Icon name (uses IconRegistry) */
    icon: z.string().optional(),
    /** Icon when collapsed path (default: chevron-right) */
    expandIcon: z.string().optional(),
    /** Icon when expanded path (default: chevron-down) */
    collapseIcon: z.string().optional(),
    /** Recursive children */
    children: z.array(z.lazy(() => TreeNodeSchema)).optional(),
    /** Disabled state */
    disabled: z.boolean().optional(),
    /** Badge count */
    badge: z.number().optional(),
    /** Arbitrary metadata */
    metadata: z.record(z.unknown()).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL EXTENSION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TreeNode Model including runtime state (expanded, selected)
 */
export const TreeNodeModelSchema = extendSchema({
    /** The node data structure */
    node: TreeNodeSchema,

    /** Whether the node is expanded */
    expanded: z.boolean().default(false),

    /** Whether the node is selected */
    selected: z.boolean().default(false),

    /** Indentation level (0-based) */
    level: z.number().default(0),

    /** Parent key (internal use) */
    parentKey: z.string().optional(),
});

export type TreeNodeModel = z.infer<typeof TreeNodeModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export function createTreeNodeModel(data: Partial<TreeNodeModel>): TreeNodeModel {
    return TreeNodeModelSchema.parse(data);
}
