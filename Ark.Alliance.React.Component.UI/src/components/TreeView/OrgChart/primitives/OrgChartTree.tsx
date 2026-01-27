/**
 * @fileoverview OrgChartTree Primitive Component
 * @module components/TreeView/OrgChart/primitives
 * 
 * Tree layout engine for rendering hierarchical organizational chart structures.
 * Handles recursive node rendering with connection lines.
 */

import { memo, useCallback } from 'react';
import type { OrgChartTreeProps } from './OrgChartTree.model';
import { useOrgChartTree } from './OrgChartTree.viewmodel';
import { OrgChartConnector } from './OrgChartConnector';
import { OrgChartNode } from '../OrgChartNode';
import './OrgChartTree.scss';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OrgChartTree - Recursive tree layout for organizational charts
 * 
 * This primitive component handles the hierarchical rendering of organizational
 * chart nodes with proper spacing, connections, and layout.
 * 
 * @example
 * ```tsx
 * <OrgChartTree
 *   node={rootNode}
 *   level={0}
 *   lineColor="#3b82f6"
 *   lineWidth={2}
 *   onNodeClick={(id) => console.log('Clicked:', id)}
 * />
 * ```
 */
export const OrgChartTree = memo<OrgChartTreeProps>(function OrgChartTree(props) {
    const { node, onNodeClick, ...treeConfig } = props;

    const vm = useOrgChartTree({ node, ...treeConfig });

    // Handle node click
    const handleNodeClick = useCallback(() => {
        if (onNodeClick) {
            onNodeClick(node.id);
        }
    }, [onNodeClick, node.id]);

    // Calculate spacing CSS variables
    const style = {
        '--node-spacing': `${vm.model.nodeSpacing}px`,
        '--level-spacing': `${vm.model.levelSpacing}px`,
    } as React.CSSProperties;

    return (
        <div className="ark-org-tree" style={style}>
            {/* Node wrapper */}
            <div className="ark-org-tree__node-wrapper">
                {/* Render the current node */}
                <OrgChartNode
                    node={node}
                    onClick={handleNodeClick}
                    isSelected={vm.isNodeSelected(node.id)}
                    compact={vm.model.compact}
                />

                {/* Render connectors and children if they exist */}
                {vm.hasChildren && (
                    <>
                        {/* Vertical connector from parent to children */}
                        <OrgChartConnector config={vm.verticalConnector} />

                        {/* Children container */}
                        <div className="ark-org-tree__children">
                            {/* Horizontal bridge across all children */}
                            {vm.children.length > 1 && (
                                <div className="ark-org-tree__bridge">
                                    <OrgChartConnector config={vm.horizontalBridgeConnector} />
                                </div>
                            )}

                            {/* Render each child with its own tree */}
                            {vm.children.map((child) => (
                                <div key={child.id} className="ark-org-tree__child">
                                    {/* Branch connector from bridge to child */}
                                    {vm.children.length > 1 && (
                                        <OrgChartConnector config={vm.childBranchConnector} />
                                    )}

                                    {/* Recursive tree for child */}
                                    <OrgChartTree
                                        node={child}
                                        level={vm.model.level + 1}
                                        parentId={node.id}
                                        lineColor={vm.model.lineColor}
                                        lineWidth={vm.model.lineWidth}
                                        orientation={vm.model.orientation}
                                        nodeSpacing={vm.model.nodeSpacing}
                                        levelSpacing={vm.model.levelSpacing}
                                        compact={vm.model.compact}
                                        selectedId={vm.model.selectedId}
                                        onNodeClick={onNodeClick}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

OrgChartTree.displayName = 'OrgChartTree';

export default OrgChartTree;
