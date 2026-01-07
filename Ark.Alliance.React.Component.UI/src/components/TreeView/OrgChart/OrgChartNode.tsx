/**
 * @fileoverview OrgChartNode Component
 * @module components/TreeView/OrgChart
 * 
 * Individual node in the organizational chart showing collaborator info.
 */

import { forwardRef, memo } from 'react';
import type { OrgChartNodeData } from './OrgChart.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OrgChartNodeProps {
    /** Node data */
    node: OrgChartNodeData;
    /** Click handler */
    onClick?: () => void;
    /** Whether node is selected */
    isSelected?: boolean;
    /** Compact mode for mobile */
    compact?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OrgChartNode - Individual node in organizational chart
 * 
 * @example
 * ```tsx
 * <OrgChartNode
 *   node={{ id: '1', name: 'John Doe', position: 'CEO' }}
 *   onClick={() => navigate('/team/1')}
 * />
 * ```
 */
export const OrgChartNode = memo(forwardRef<HTMLButtonElement, OrgChartNodeProps>(
    function OrgChartNode(props, ref) {
        const { node, onClick, isSelected = false, compact = false, className = '' } = props;

        const initials = node.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
            }
        };

        return (
            <button
                ref={ref}
                type="button"
                className={`
                    ark-org-node 
                    ${isSelected ? 'ark-org-node--selected' : ''} 
                    ${compact ? 'ark-org-node--compact' : ''}
                    ${className}
                `.trim().replace(/\s+/g, ' ')}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                aria-label={`${node.name}, ${node.position}${node.department ? `, ${node.department}` : ''}`}
                aria-pressed={isSelected}
                data-testid={`org-node-${node.id}`}
                data-node-id={node.id}
            >
                {node.avatarUrl ? (
                    <img
                        src={node.avatarUrl}
                        alt=""
                        className="ark-org-node__avatar"
                        loading="lazy"
                    />
                ) : (
                    <div className="ark-org-node__avatar-fallback">
                        {initials}
                    </div>
                )}

                <div className="ark-org-node__info">
                    <span className="ark-org-node__name">{node.name}</span>
                    <span className="ark-org-node__position">{node.position}</span>
                </div>
            </button>
        );
    }
));

OrgChartNode.displayName = 'OrgChartNode';

export default OrgChartNode;
