/**
 * @fileoverview TreeView Component View
 * @module components/TreeView
 */

import { forwardRef, memo, ReactNode } from 'react';
import { useTreeView, type UseTreeViewOptions } from './TreeView.viewmodel';
import { TreeViewContext } from './TreeView.context';
import { TreeNode } from './TreeNode/TreeNode';
import { TreeNodeItem } from './TreeNode/TreeNode.model';
import './TreeView.scss';

export interface TreeViewProps extends UseTreeViewOptions {
    className?: string;
    /** Custom render for node label */
    titleRender?: (node: TreeNodeItem) => ReactNode;
}

export const TreeView = memo(forwardRef<HTMLDivElement, TreeViewProps>((props, ref) => {
    const {
        className = '',
        titleRender,
        icon, // Icon prop from BaseModel might conflict or be unused on root. Ignoring.
        ...options
    } = props;

    const vm = useTreeView(options);

    return (
        <TreeViewContext.Provider value={vm.contextValue}>
            <div
                ref={ref}
                className={`${vm.treeClasses} ${className}`}
                role="tree"
                data-testid={vm.model.testId}
            >
                {vm.model.items.map(node => (
                    <TreeNode
                        key={node.key}
                        node={node}
                        level={0}
                        titleRender={titleRender}
                    />
                ))}
            </div>
        </TreeViewContext.Provider>
    );
}));

TreeView.displayName = 'TreeView';
