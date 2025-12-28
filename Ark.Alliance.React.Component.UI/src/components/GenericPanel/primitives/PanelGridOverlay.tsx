/**
 * @fileoverview Panel Grid Overlay Primitive
 * @module components/GenericPanel/primitives
 * 
 * Tech-style grid pattern overlay for GenericPanel.
 */

import React, { memo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PanelGridOverlayProps {
    /** Grid cell size in pixels */
    size?: number;
    /** Grid line color */
    color?: string;
    /** Opacity (0-1) */
    opacity?: number;
    /** Additional className */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PanelGridOverlay - Tech-style grid pattern overlay
 * 
 * @example
 * ```tsx
 * <PanelGridOverlay size={20} color="rgba(255,255,255,0.1)" />
 * ```
 */
export const PanelGridOverlay = memo<PanelGridOverlayProps>(function PanelGridOverlay({
    size = 20,
    color = 'rgba(255,255,255,0.1)',
    opacity = 0.1,
    className = '',
}) {
    const gridStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
    };

    return (
        <div
            className={`ark-panel-grid-overlay ${className}`}
            style={gridStyle}
            aria-hidden="true"
        />
    );
});

PanelGridOverlay.displayName = 'PanelGridOverlay';

export default PanelGridOverlay;
