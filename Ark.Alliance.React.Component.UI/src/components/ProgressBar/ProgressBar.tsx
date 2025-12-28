/**
 * @fileoverview ProgressBar Component
 * @module components/ProgressBar
 * 
 * Linear progress indicator with MVVM pattern.
 */

import { forwardRef, memo } from 'react';
import { useProgressBar, type UseProgressBarOptions } from './ProgressBar.viewmodel';
import './ProgressBar.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ProgressBarProps extends UseProgressBarOptions {
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ProgressBar - Linear progress indicator
 * 
 * Features:
 * - Multiple size variants (xs, sm, md, lg)
 * - Multiple visual styles (default, neon, gradient, striped)
 * - Color zones for dynamic coloring
 * - Indeterminate mode for loading states
 * - Animated progress
 * - Dark/light theme support
 * 
 * @example
 * ```tsx
 * <ProgressBar 
 *   value={75}
 *   max={100}
 *   showPercentage
 *   variant="neon"
 *   color="cyan"
 * />
 * ```
 */
export const ProgressBar = memo(forwardRef<HTMLDivElement, ProgressBarProps>(
    function ProgressBar(props, ref) {
        const { className = '', ...options } = props;

        const vm = useProgressBar(options);

        return (
            <div
                ref={ref}
                className={`ark-progress ${vm.sizeClass} ${vm.variantClass} ${vm.colorClass} ${vm.themeClass} ${vm.stateClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {(vm.model.label || vm.model.showValue || vm.model.showPercentage) && (
                    <div className="ark-progress__header">
                        {vm.model.label && (
                            <span className="ark-progress__label">{vm.model.label}</span>
                        )}
                        {(vm.model.showValue || vm.model.showPercentage) && (
                            <span className="ark-progress__value">
                                {vm.model.showPercentage
                                    ? `${Math.round(vm.percentage)}%`
                                    : `${vm.model.value}/${vm.model.max}`
                                }
                            </span>
                        )}
                    </div>
                )}
                <div
                    className="ark-progress__track"
                    role="progressbar"
                    aria-valuenow={vm.model.value}
                    aria-valuemin={0}
                    aria-valuemax={vm.model.max}
                >
                    <div
                        className="ark-progress__bar"
                        style={{ width: vm.model.indeterminate ? undefined : `${vm.percentage}%` }}
                    />
                </div>
            </div>
        );
    }
));

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;

