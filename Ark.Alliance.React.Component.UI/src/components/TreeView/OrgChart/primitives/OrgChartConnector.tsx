/**
 * @fileoverview OrgChartConnector Primitive Component
 * @module components/TreeView/OrgChart/primitives
 * 
 * Renders connection lines between organizational chart nodes.
 * Supports vertical, horizontal, and branch connectors.
 */

import { memo } from 'react';
import type { OrgChartConnectorModel, ConnectorType } from './OrgChartConnector.model';
import './OrgChartConnector.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OrgChartConnectorProps {
    /** Connector configuration */
    config: OrgChartConnectorModel;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OrgChartConnector - Renders connection lines between nodes
 * 
 * This primitive component renders the visual connectors that show
 * hierarchical relationships in an organizational chart.
 * 
 * @example
 * ```tsx
 * <OrgChartConnector
 *   config={{
 *     type: 'vertical',
 *     color: '#3b82f6',
 *     width: 2,
 *     height: 40
 *   }}
 * />
 * ```
 */
export const OrgChartConnector = memo<OrgChartConnectorProps>(function OrgChartConnector({
    config,
    className = '',
}) {
    const { type, color, width, height } = config;

    // CSS custom properties for dynamic styling
    const style = {
        '--connector-color': color,
        '--connector-width': `${width}px`,
        '--connector-height': `${height}px`,
    } as React.CSSProperties;

    const connectorClass = `ark-org-connector ark-org-connector--${type} ${className}`;

    // Render different connector types
    switch (type) {
        case 'vertical':
            return (
                <div
                    className={connectorClass}
                    style={style}
                    aria-hidden="true"
                >
                    <div className="ark-org-connector__line ark-org-connector__line--vertical" />
                </div>
            );

        case 'horizontal-bridge':
            return (
                <div
                    className={connectorClass}
                    style={style}
                    aria-hidden="true"
                >
                    <div className="ark-org-connector__line ark-org-connector__line--horizontal" />
                </div>
            );

        case 'child-branch':
            return (
                <div
                    className={connectorClass}
                    style={style}
                    aria-hidden="true"
                >
                    <div className="ark-org-connector__line ark-org-connector__line--branch" />
                </div>
            );

        default:
            return null;
    }
});

OrgChartConnector.displayName = 'OrgChartConnector';

export default OrgChartConnector;
