/**
 * @fileoverview TreeView Context
 * @module components/TreeView
 */

import { createContext, useContext } from 'react';
import type { TreeViewModel } from './TreeView.model';

export interface TreeViewContextValue {
    expandedKeys: string[];
    selectedKeys: string[];
    onToggle: (key: string, expanded: boolean) => void;
    onSelect: (key: string, selected: boolean) => void;
    selectionMode: TreeViewModel['selectionMode'];
    showLines: boolean;
}

export const TreeViewContext = createContext<TreeViewContextValue | null>(null);

export const useTreeViewContext = () => {
    const context = useContext(TreeViewContext);
    if (!context) {
        throw new Error('useTreeViewContext must be used within a TreeView');
    }
    return context;
};
