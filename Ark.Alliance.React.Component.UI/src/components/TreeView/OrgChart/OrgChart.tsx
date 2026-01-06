/**
 * @fileoverview OrgChart Component
 * @module components/TreeView/OrgChart
 * 
 * Renders organizational hierarchy using react-organizational-chart.
 * 
 * @example
 * ```tsx
 * import { OrgChart } from 'ark-alliance-react-ui';
 * 
 * <OrgChart
 *   rootNodes={[{
 *     id: '1',
 *     name: 'CEO',
 *     position: 'Chief Executive Officer',
 *     children: [
 *       { id: '2', name: 'CTO', position: 'Chief Technology Officer' }
 *     ]
 *   }]}
 *   onNodeClick={(id) => console.log('Selected:', id)}
 * />
 * ```
 */

import { forwardRef, memo, useCallback } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { useOrgChart, type UseOrgChartOptions } from './OrgChart.viewmodel';
import { OrgChartNode } from './OrgChartNode';
import type { OrgChartNodeData } from './OrgChart.model';
import './OrgChart.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OrgChartProps extends UseOrgChartOptions {
    /** Callback when a node is clicked */
    onNodeClick?: (nodeId: string) => void;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OrgChart - Organizational hierarchy visualization
 * 
 * Features:
 * - Tree-based hierarchy display
 * - Customizable line colors and widths
 * - Node selection support
 * - Compact mode for mobile
 * - Accessible with keyboard navigation
 */
export const OrgChart = memo(forwardRef<HTMLDivElement, OrgChartProps>(
    function OrgChart(props, ref) {
        const { onNodeClick, className = '', ...chartOptions } = props;

        const vm = useOrgChart(chartOptions);

        // Render a tree node recursively
        const renderNode = useCallback((node: OrgChartNodeData): React.ReactNode => {
            const hasChildren = node.children && node.children.length > 0;

            const nodeElement = (
                <OrgChartNode
                    node={node}
                    onClick={() => onNodeClick?.(node.id)}
                    isSelected={vm.isNodeSelected(node.id)}
                    compact={vm.model.compact}
                />
            );

            if (!hasChildren) {
                return <TreeNode key={node.id} label={nodeElement} />;
            }

            return (
                <TreeNode key={node.id} label={nodeElement}>
                    {node.children!.map(child => renderNode(child))}
                </TreeNode>
            );
        }, [onNodeClick, vm]);

        // Empty state
        if (vm.isEmpty) {
            return (
                <div
                    ref={ref}
                    className={`ark-org-chart ark-org-chart--empty ${className}`.trim()}
                    role="img"
                    aria-label="Empty organization chart"
                    data-testid={vm.model.testId || 'org-chart'}
                >
                    <div className="ark-org-chart__empty-message">
                        <span className="ark-org-chart__empty-icon">👥</span>
                        <p>No team members to display</p>
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className={`ark-org-chart ${className}`.trim()}
                role="tree"
                aria-label={`Organization chart${vm.model.organizationName ? ` for ${vm.model.organizationName}` : ''}`}
                data-testid={vm.model.testId || 'org-chart'}
            >
                {/* Stats bar */}
                <div className="ark-org-chart__stats" aria-hidden="true">
                    <span>{vm.nodeCount} team members</span>
                </div>

                {/* Chart content */}
                <div className="ark-org-chart__content">
                    {vm.model.rootNodes.map((rootNode) => (
                        <div key={rootNode.id} className="ark-org-chart__tree">
                            <Tree
                                lineWidth={vm.lineStyle.width}
                                lineColor={vm.lineStyle.color}
                                lineBorderRadius="8px"
                                label={
                                    <OrgChartNode
                                        node={rootNode}
                                        onClick={() => onNodeClick?.(rootNode.id)}
                                        isSelected={vm.isNodeSelected(rootNode.id)}
                                        compact={vm.model.compact}
                                    />
                                }
                            >
                                {rootNode.children?.map(child => renderNode(child))}
                            </Tree>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
));

OrgChart.displayName = 'OrgChart';

export default OrgChart;
