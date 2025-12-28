/**
 * @fileoverview NumericInput Component View
 * @module components/Input/NumericInput
 */

import { forwardRef, memo } from 'react';
import { useNumericInput, type UseNumericInputOptions } from './NumericInput.viewmodel';
import './NumericInput.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface NumericInputProps extends UseNumericInputOptions {
    className?: string;
    id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NumericInput - Number input with increment/decrement controls
 * 
 * @example
 * ```tsx
 * <NumericInput 
 *   label="Quantity" 
 *   min={0} max={100} 
 *   value={qty} 
 *   onChange={setQty} 
 * />
 * ```
 */
export const NumericInput = memo(forwardRef<HTMLDivElement, NumericInputProps>(
    function NumericInput(props, ref) {
        const { className = '', id, ...options } = props;
        const vm = useNumericInput(options);

        return (
            <div
                ref={ref}
                className={`${vm.wrapperClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {/* Label */}
                {vm.model.label && (
                    <label className="ark-numeric__label" htmlFor={id}>
                        {vm.model.label}
                    </label>
                )}

                <div className="ark-numeric__container">
                    {/* Decrement button */}
                    {vm.model.showStepper && (
                        <button
                            type="button"
                            className="ark-numeric__btn ark-numeric__btn--dec"
                            onClick={vm.decrement}
                            disabled={!vm.canDecrement || vm.model.disabled}
                            aria-label="Decrease value"
                        >
                            −
                        </button>
                    )}

                    {/* Input */}
                    <input
                        type="number"
                        id={id}
                        className={vm.inputClasses}
                        value={vm.displayValue}
                        onChange={vm.handleChange}
                        min={vm.model.min}
                        max={vm.model.max}
                        step={vm.model.step}
                        placeholder={vm.model.placeholder}
                        disabled={vm.model.disabled}
                    />

                    {/* Unit */}
                    {vm.model.unit && (
                        <span className="ark-numeric__unit">{vm.model.unit}</span>
                    )}

                    {/* Increment button */}
                    {vm.model.showStepper && (
                        <button
                            type="button"
                            className="ark-numeric__btn ark-numeric__btn--inc"
                            onClick={vm.increment}
                            disabled={!vm.canIncrement || vm.model.disabled}
                            aria-label="Increase value"
                        >
                            +
                        </button>
                    )}
                </div>
            </div>
        );
    }
));

NumericInput.displayName = 'NumericInput';

export default NumericInput;
