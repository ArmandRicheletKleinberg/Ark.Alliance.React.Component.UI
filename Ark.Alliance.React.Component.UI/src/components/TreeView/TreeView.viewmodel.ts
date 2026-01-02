/**
 * @fileoverview TreeView ViewModel
 * @module components/TreeView
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { TreeViewModel, TreeSelectionModeType } from './TreeView.model';
import { TreeViewModelSchema, createTreeViewModel } from './TreeView.model';

export interface UseTreeViewOptions extends Partial<TreeViewModel> {
    /** Callback when nodes are expanded/collapsed */
    onExpand?: (expandedKeys: string[]) => void;
    /** Callback when selection changes */
    onSelectionChange?: (selectedKeys: string[]) => void;
}

export interface UseTreeViewResult extends BaseViewModelResult<TreeViewModel> {
    handleToggle: (key: string, expanded: boolean) => void;
    handleSelect: (key: string, selected: boolean) => void;
    treeClasses: string;
    contextValue: {
        expandedKeys: string[];
        selectedKeys: string[];
        onToggle: (key: string, expanded: boolean) => void;
        onSelect: (key: string, selected: boolean) => void;
        selectionMode: TreeSelectionModeType;
        showLines: boolean;
    };
}

export function useTreeView(options: UseTreeViewOptions): UseTreeViewResult {
    const { onExpand, onSelectionChange, ...modelData } = options;

    const modelOptions = useMemo(() => {
        return createTreeViewModel(modelData);
    }, [modelData]);

    const base = useBaseViewModel<TreeViewModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'tree-view',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [expandedKeys, setExpandedKeys] = useState<string[]>(base.model.expandedKeys);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(base.model.selectedKeys);

    // Sync props to state if they change externally (controlled mode support)
    useEffect(() => {
        setExpandedKeys(base.model.expandedKeys);
    }, [base.model.expandedKeys]); // Note: array comparison might need deep equal or ref check if strictly controlled

    useEffect(() => {
        setSelectedKeys(base.model.selectedKeys);
    }, [base.model.selectedKeys]);

    // ═══════════════════════════════════════════════════════════════════════
    // LOGIC
    // ═══════════════════════════════════════════════════════════════════════

    const handleToggle = useCallback((key: string, shouldExpand: boolean) => {
        setExpandedKeys(prev => {
            const next = shouldExpand
                ? [...prev, key]
                : prev.filter(k => k !== key);

            // Notify
            onExpand?.(next);
            base.emit('expand', { keys: next });
            return next;
        });
    }, [base, onExpand]);

    const handleSelect = useCallback((key: string, shouldSelect: boolean) => {
        const mode = base.model.selectionMode;
        if (mode === 'none') return;

        setSelectedKeys(prev => {
            let next: string[] = [];

            if (mode === 'single') {
                // In single mode, if clicking selected, deselect? Or always select?
                // Usually allow deselect if same key, or simply replace.
                // Standard behavior: Toggle if same, Replace if different.
                if (shouldSelect) {
                    next = [key]; // Replace
                } else {
                    next = []; // Deselect
                }

                // If expecting toggle logic from TreeNode (it passes !selected):
                // If it passes true (select this), we replace.
                // If it passes false (deselect this), we clear IF it makes sense.
            } else if (mode === 'multiple') {
                if (shouldSelect) {
                    next = [...prev, key];
                } else {
                    next = prev.filter(k => k !== key);
                }
            }

            onSelectionChange?.(next);
            base.emit('select', { keys: next });
            return next;
        });
    }, [base, base.model.selectionMode, onSelectionChange]);

    // ═══════════════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const treeClasses = useMemo(() => {
        const classes = ['ark-tree-view'];
        if (base.model.showLines) classes.push('ark-tree-view--show-lines');
        if (base.model.size) classes.push(`ark-tree-view--${base.model.size}`);
        if (base.model.isDark) classes.push('ark-tree-view--dark');
        return classes.join(' ');
    }, [base.model.showLines, base.model.size, base.model.isDark]);

    const contextValue = useMemo(() => ({
        expandedKeys,
        selectedKeys,
        onToggle: handleToggle,
        onSelect: handleSelect,
        selectionMode: base.model.selectionMode,
        showLines: base.model.showLines
    }), [expandedKeys, selectedKeys, handleToggle, handleSelect, base.model.selectionMode, base.model.showLines]);

    return {
        ...base,
        handleToggle,
        handleSelect,
        treeClasses,
        contextValue
    };
}
