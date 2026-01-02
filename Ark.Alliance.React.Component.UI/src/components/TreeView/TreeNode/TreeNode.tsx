/**
 * @fileoverview TreeNode Component View
 * @module components/TreeView/TreeNode
 */

import { forwardRef, memo, ReactNode } from 'react';
import { useTreeNode, type UseTreeNodeOptions } from './TreeNode.viewmodel';
import { Icon } from '../../Icon';
import './TreeNode.styles.css';

export interface TreeNodeProps extends Omit<UseTreeNodeOptions, 'id'> {
    className?: string;
    /** Custom render for node label */
    titleRender?: (node: UseTreeNodeOptions['node']) => ReactNode;
}

export const TreeNode = memo(forwardRef<HTMLDivElement, TreeNodeProps>((props, ref) => {
    const {
        className = '',
        titleRender,
        ...options
    } = props;

    const vm = useTreeNode(options);
    const { node } = vm.model;

    return (
        <div
            ref={ref}
            className={`${vm.nodeClasses} ${className}`}
            role="treeitem"
            aria-expanded={vm.hasChildren ? vm.isExpanded : undefined}
            aria-selected={vm.isSelected}
            aria-disabled={vm.model.disabled}
            data-key={node.key}
        >
            {/* Node Content Row */}
            <div
                className="ark-tree-node__content"
                style={vm.indentStyle}
                onClick={vm.handleClick}
                onDoubleClick={vm.toggleExpanded}
            >
                {/* Expander Switcher */}
                <div
                    className={`ark-tree-node__switcher ${!vm.hasChildren ? 'ark-tree-node__switcher--leaf' : ''}`}
                    onClick={vm.toggleExpanded}
                >
                    {vm.hasChildren && (
                        <Icon
                            name={vm.isExpanded ? (node.collapseIcon || 'chevron-down') : (node.expandIcon || 'chevron-right')}
                            size="sm"
                        />
                    )}
                </div>

                {/* Node Icon */}
                {node.icon && (
                    <div className="ark-tree-node__icon">
                        <Icon name={node.icon} size="sm" />
                    </div>
                )}

                {/* Label */}
                <span className="ark-tree-node__label">
                    {titleRender ? titleRender(node) : node.label}
                </span>

                {/* Badge (Optional) */}
                {node.badge !== undefined && (
                    <span className="ark-tree-node__badge">{node.badge}</span>
                )}
            </div>

            {/* Children (Recursive) */}
            {vm.hasChildren && vm.isExpanded && (
                <div className="ark-tree-node__children" role="group">
                    {node.children?.map(child => (
                        <TreeNode
                            key={child.key}
                            node={child}
                            level={vm.model.level + 1}
                            titleRender={titleRender}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}));

TreeNode.displayName = 'TreeNode';
