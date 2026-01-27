/**
 * @fileoverview OrgChart Component
 * @module components/TreeView/OrgChart
 * 
 * Renders organizational hierarchy using custom tree primitives.
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

import { forwardRef, memo } from 'react';
import { useOrgChart, type UseOrgChartOptions } from './OrgChart.viewmodel';
import { OrgChartTree } from './primitives/OrgChartTree';
import './OrgChart.scss';

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
 * - Tree-based hierarchy display with custom primitives
 * - Customizable line colors and widths
 * - Node selection support
 * - Compact mode for mobile
 * - Accessible with keyboard navigation
 * - React 18+ compatible
 */
export const OrgChart = memo(forwardRef<HTMLDivElement, OrgChartProps>(
    function OrgChart(props, ref) {
        const { onNodeClick, className = '', ...chartOptions } = props;

        const vm = useOrgChart(chartOptions);

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
                            <OrgChartTree
                                node={rootNode}
                                level={0}
                                lineColor={vm.lineStyle.color}
                                lineWidth={vm.lineStyle.width}
                                selectedId={vm.model.selectedId}
                                compact={vm.model.compact}
                                onNodeClick={onNodeClick}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
));

OrgChart.displayName = 'OrgChart';

export default OrgChart;
