/**
 * @fileoverview TreeView Component Model
 * @module components/TreeView
 * 
 * Defines the data structure for the TreeView container.
 * Manages tree nodes, selection mode, and expansion state.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { TreeNodeSchema } from './TreeNode/TreeNode.model';
import { ComponentSizeSchema } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tree selection mode
 */
export const TreeSelectionMode = z.enum(['none', 'single', 'multiple']);

/**
 * TreeView model schema extending base model
 */
export const TreeViewModelSchema = extendSchema({
    /** Tree nodes data */
    items: z.array(TreeNodeSchema).default([]),

    /** Currently selected keys */
    selectedKeys: z.array(z.string()).default([]),

    /** Currently expanded keys */
    expandedKeys: z.array(z.string()).default([]),

    /** Selection mode */
    selectionMode: TreeSelectionMode.default('single'),

    /** Size variant */
    size: ComponentSizeSchema.default('md'),

    /** Whether to show lines connecting nodes */
    showLines: z.boolean().default(false),

    /** Whether to auto-expand parent when child selected */
    autoExpandParent: z.boolean().default(true),

    /** Custom height for virtualization (optional) */
    height: z.number().optional(),

    /** Dark mode variant */
    isDark: z.boolean().default(true),
});

export type TreeViewModel = z.infer<typeof TreeViewModelSchema>;
export type TreeSelectionModeType = z.infer<typeof TreeSelectionMode>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export function createTreeViewModel(data: Partial<TreeViewModel> = {}): TreeViewModel {
    return TreeViewModelSchema.parse(data);
}
