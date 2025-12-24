/**
 * @fileoverview ProgressBar Component
 * @module components/ProgressBar
 * 
 * Linear progress indicator with MVVM pattern.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { forwardRef, memo, useMemo } from 'react';
import { useBaseViewModel } from '../../core/base';
import './ProgressBar.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// MODEL
// ═══════════════════════════════════════════════════════════════════════════

export const ProgressBarModelSchema = extendSchema({
    value: z.number().min(0).default(0),
    max: z.number().min(1).default(100),
    label: z.string().optional(),
    showValue: z.boolean().default(false),
    showPercentage: z.boolean().default(false),
    size: z.enum(['xs', 'sm', 'md', 'lg']).default('md'),
    variant: z.enum(['default', 'neon', 'gradient', 'striped']).default('default'),
    color: z.enum(['blue', 'green', 'red', 'cyan', 'purple', 'yellow']).default('cyan'),
    animated: z.boolean().default(false),
    indeterminate: z.boolean().default(false),
    isDark: z.boolean().default(true),
});

export type ProgressBarModel = z.infer<typeof ProgressBarModelSchema>;

export const defaultProgressBarModel: ProgressBarModel = {
    value: 0,
    max: 100,
    label: undefined,
    showValue: false,
    showPercentage: false,
    size: 'md',
    variant: 'default',
    color: 'cyan',
    animated: false,
    indeterminate: false,
    isDark: true,
    disabled: false,
    loading: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface ProgressBarProps extends Partial<ProgressBarModel> {
    className?: string;
}

export const ProgressBar = memo(forwardRef<HTMLDivElement, ProgressBarProps>(
    function ProgressBar(props, ref) {
        const { className = '', ...modelData } = props;

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const modelOptions = useMemo(() => {
            return ProgressBarModelSchema.parse({ ...defaultProgressBarModel, ...modelData });
        }, [JSON.stringify(modelData)]);

        const base = useBaseViewModel<ProgressBarModel>(modelOptions, {
            model: modelOptions,
            eventChannel: 'progressbar',
        });

        const percentage = useMemo(() => {
            return Math.min(100, Math.max(0, (base.model.value / base.model.max) * 100));
        }, [base.model.value, base.model.max]);

        const sizeClass = `ark-progress--${base.model.size}`;
        const variantClass = `ark-progress--${base.model.variant}`;
        const colorClass = `ark-progress--${base.model.color}`;
        const themeClass = base.model.isDark ? 'ark-progress--dark' : 'ark-progress--light';
        const stateClasses = [
            base.model.animated && 'ark-progress--animated',
            base.model.indeterminate && 'ark-progress--indeterminate',
        ].filter(Boolean).join(' ');

        return (
            <div
                ref={ref}
                className={`ark-progress ${sizeClass} ${variantClass} ${colorClass} ${themeClass} ${stateClasses} ${className}`}
                data-testid={base.model.testId}
            >
                {(base.model.label || base.model.showValue || base.model.showPercentage) && (
                    <div className="ark-progress__header">
                        {base.model.label && (
                            <span className="ark-progress__label">{base.model.label}</span>
                        )}
                        {(base.model.showValue || base.model.showPercentage) && (
                            <span className="ark-progress__value">
                                {base.model.showPercentage ? `${Math.round(percentage)}%` : `${base.model.value}/${base.model.max}`}
                            </span>
                        )}
                    </div>
                )}
                <div className="ark-progress__track" role="progressbar" aria-valuenow={base.model.value} aria-valuemin={0} aria-valuemax={base.model.max}>
                    <div
                        className="ark-progress__bar"
                        style={{ width: base.model.indeterminate ? undefined : `${percentage}%` }}
                    />
                </div>
            </div>
        );
    }
));

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
