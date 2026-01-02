/**
 * @fileoverview TreeNode ViewModel
 * @module components/TreeView/TreeNode
 */

import { useCallback, useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TreeNodeModel, TreeNodeItem } from './TreeNode.model';
import { createTreeNodeModel } from './TreeNode.model';
import { useTreeViewContext } from '../TreeView.context';

export interface UseTreeNodeOptions extends Partial<TreeNodeModel> {
    /** The node data structure (required) */
    node: TreeNodeItem;
}

export interface UseTreeNodeResult extends BaseViewModelResult<TreeNodeModel> {
    /** Is the node expanded */
    isExpanded: boolean;
    /** Is the node selected */
    isSelected: boolean;
    /** Toggle expansion */
    toggleExpanded: (e?: React.MouseEvent) => void;
    /** Handle node click */
    handleClick: (e: React.MouseEvent) => void;
    /** Computed classes for the node */
    nodeClasses: string;
    /** Computed padding style for level indentation */
    indentStyle: React.CSSProperties;
    /** Has children (to show expander) */
    hasChildren: boolean;
}

export function useTreeNode(options: UseTreeNodeOptions): UseTreeNodeResult {
    const { ...modelData } = options;
    const context = useTreeViewContext();

    // Initialize model, syncing disabled state from node data if present
    const modelOptions = useMemo(() => {
        const options = {
            ...modelData,
            // Prioritize prop disabled, fallback to node.disabled
            disabled: modelData.disabled ?? modelData.node?.disabled
        };
        return createTreeNodeModel(options);
    }, [modelData]);

    const base = useBaseViewModel<TreeNodeModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'tree-node',
    });

    // Derive state from Context
    const isExpanded = context.expandedKeys.includes(base.model.node.key);
    const isSelected = context.selectedKeys.includes(base.model.node.key);

    const hasChildren = !!(base.model.node.children && base.model.node.children.length > 0);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const toggleExpanded = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (base.model.disabled || !hasChildren) return;

        context.onToggle(base.model.node.key, !isExpanded);

        base.emit('toggle', {
            key: base.model.node.key,
            expanded: !isExpanded
        });
    }, [base, hasChildren, isExpanded, context]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e?.stopPropagation(); // Stop propagation to parent nodes
        if (base.model.disabled) return;

        context.onSelect(base.model.node.key, !isSelected);

        base.emit('click', {
            key: base.model.node.key,
            selected: !isSelected
        });
    }, [base, context, isSelected]);

    // ═══════════════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const nodeClasses = useMemo(() => {
        const classes = ['ark-tree-node'];
        if (isExpanded) classes.push('ark-tree-node--expanded');
        if (isSelected) classes.push('ark-tree-node--selected');
        if (base.model.disabled) classes.push('ark-tree-node--disabled');
        return classes.join(' ');
    }, [isExpanded, isSelected, base.model.disabled]);

    const indentStyle = useMemo(() => ({
        paddingLeft: `${base.model.level * 20}px`
    }), [base.model.level]);

    return {
        ...base,
        isExpanded,
        isSelected,
        toggleExpanded,
        handleClick,
        nodeClasses,
        indentStyle,
        hasChildren
    };
}
