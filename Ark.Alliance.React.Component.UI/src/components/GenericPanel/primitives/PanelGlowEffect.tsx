/**
 * @fileoverview Panel Glow Effect Primitive
 * @module components/GenericPanel/primitives
 * 
 * Ambient glow effect wrapper for GenericPanel.
 */

import React, { memo, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PanelGlowEffectProps {
    /** Content to wrap */
    children: ReactNode;
    /** Glow color */
    color?: string;
    /** Glow spread in pixels */
    spread?: number;
    /** Glow opacity (0-1) */
    opacity?: number;
    /** Border radius to match parent */
    borderRadius?: number;
    /** Additional className */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PanelGlowEffect - Ambient glow wrapper
 * 
 * @example
 * ```tsx
 * <PanelGlowEffect color="#3b82f6" spread={20}>
 *   <Panel>Content</Panel>
 * </PanelGlowEffect>
 * ```
 */
export const PanelGlowEffect = memo<PanelGlowEffectProps>(function PanelGlowEffect({
    children,
    color = 'rgba(59, 130, 246, 0.5)',
    spread = 20,
    opacity = 0.25,
    borderRadius = 8,
    className = '',
}) {
    const glowStyle: React.CSSProperties = {
        position: 'absolute',
        inset: `-${Math.round(spread / 4)}px`,
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
        opacity,
        borderRadius: `${borderRadius + 4}px`,
        filter: `blur(${spread}px)`,
        pointerEvents: 'none',
        zIndex: -1,
    };

    return (
        <div className={`ark-panel-glow-wrapper ${className}`} style={{ position: 'relative' }}>
            <div
                className="ark-panel-glow-effect"
                style={glowStyle}
                aria-hidden="true"
            />
            {children}
        </div>
    );
});

PanelGlowEffect.displayName = 'PanelGlowEffect';

export default PanelGlowEffect;
