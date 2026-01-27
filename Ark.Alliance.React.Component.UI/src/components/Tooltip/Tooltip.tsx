/**
 * @fileoverview Tooltip Component
 * @module components/Tooltip
 * 
 * A lightweight tooltip component that can be used by any component
 * with tooltip properties inherited from BaseComponentModel.
 * Follows MVVM pattern with Tooltip viewmodel.
 */

import { type ReactNode } from 'react';
import { useTooltip, type UseTooltipOptions } from './Tooltip.viewmodel';
import './Tooltip.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends UseTooltipOptions {
    /** Tooltip content (text or ReactNode) */
    content: ReactNode;
    /** The element that triggers the tooltip */
    children: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tooltip - Displays contextual information on hover
 * 
 * @example
 * ```tsx
 * <Tooltip content="Click to save" position="top">
 *   <button>Save</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
    content,
    position = 'top',
    delay = 300,
    children,
    disabled = false,
    className = '',
}: TooltipProps) {
    const vm = useTooltip({
        content,
        position,
        delay,
        disabled,
    });

    const handleMouseEnter = () => {
        if (vm.triggerRef.current) {
            const rect = vm.triggerRef.current.getBoundingClientRect();
            vm.showTooltip(rect);
        }
    };

    const handleFocus = () => {
        if (vm.triggerRef.current) {
            const rect = vm.triggerRef.current.getBoundingClientRect();
            vm.showTooltip(rect);
        }
    };

    if (!vm.shouldShow) {
        return <>{children}</>;
    }

    return (
        <div
            ref={vm.triggerRef}
            className={`ark-tooltip-trigger ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={vm.hideTooltip}
            onFocus={handleFocus}
            onBlur={vm.hideTooltip}
        >
            {children}
            {vm.model.isVisible && (
                <div
                    ref={vm.tooltipRef}
                    className={`ark-tooltip ark-tooltip--${vm.model.position}`}
                    style={{
                        position: 'fixed',
                        left: vm.model.coords.x,
                        top: vm.model.coords.y,
                    }}
                    role="tooltip"
                >
                    {content}
                    <div className="ark-tooltip__arrow" />
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// WRAPPER HOC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Higher-order component to wrap any component with tooltip support
 * Uses the tooltip properties from BaseComponentModel
 */
export interface WithTooltipProps {
    tooltip?: string;
    tooltipPosition?: TooltipPosition;
    tooltipDelay?: number;
}

export function withTooltip<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P & WithTooltipProps> {
    return function WithTooltipWrapper({
        tooltip,
        tooltipPosition = 'top',
        tooltipDelay = 300,
        ...props
    }: P & WithTooltipProps) {
        if (!tooltip) {
            return <WrappedComponent {...(props as P)} />;
        }

        return (
            <Tooltip content={tooltip} position={tooltipPosition} delay={tooltipDelay}>
                <WrappedComponent {...(props as P)} />
            </Tooltip>
        );
    };
}

export default Tooltip;

