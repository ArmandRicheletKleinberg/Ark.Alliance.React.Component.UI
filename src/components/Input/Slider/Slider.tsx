/**
 * @fileoverview Slider Component View
 * @module components/Input/Slider
 */

import { forwardRef, memo } from 'react';
import { useSlider, type UseSliderOptions } from './Slider.viewmodel';
import './Slider.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SliderProps extends UseSliderOptions {
    /** Additional CSS class */
    className?: string;
    /** Input id */
    id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Slider - Range input with neon styling
 * 
 * @example
 * ```tsx
 * <Slider 
 *   label="Volume" 
 *   min={0} max={100} 
 *   value={volume} 
 *   onChange={setVolume} 
 *   unit="%" 
 * />
 * ```
 */
export const Slider = memo(forwardRef<HTMLDivElement, SliderProps>(
    function Slider(props, ref) {
        const { className = '', id, ...sliderOptions } = props;
        const vm = useSlider(sliderOptions);

        return (
            <div
                ref={ref}
                className={`${vm.wrapperClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {/* Header with label and value */}
                {(vm.model.label || vm.model.showValue) && (
                    <div className="ark-slider__header">
                        {vm.model.label && (
                            <label className="ark-slider__label" htmlFor={id}>
                                {vm.model.label}
                            </label>
                        )}
                        {vm.model.showValue && (
                            <span className="ark-slider__value">
                                {vm.displayValue}
                            </span>
                        )}
                    </div>
                )}

                {/* Slider track */}
                <div className="ark-slider__container">
                    <div className={vm.trackClasses}>
                        <div
                            className="ark-slider__progress"
                            style={{ width: `${vm.progressPercent}%` }}
                        />
                    </div>
                    <input
                        type="range"
                        id={id}
                        className="ark-slider__input"
                        min={vm.model.min}
                        max={vm.model.max}
                        step={vm.model.step}
                        value={vm.model.value}
                        onChange={vm.handleChange}
                        disabled={vm.model.disabled}
                    />
                </div>

                {/* Range labels */}
                {vm.model.showRange && (
                    <div className="ark-slider__range">
                        <span>{vm.model.min}</span>
                        <span>{vm.model.max}</span>
                    </div>
                )}
            </div>
        );
    }
));

Slider.displayName = 'Slider';

export default Slider;
