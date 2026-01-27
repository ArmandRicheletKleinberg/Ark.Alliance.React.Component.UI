/**
 * @fileoverview Select Component View
 * @module components/Input/Select
 */

import { forwardRef, memo } from 'react';
import { useSelect, type UseSelectOptions } from './Select.viewmodel';
import type { SelectOption } from './Select.model';
import './Select.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SelectProps extends UseSelectOptions {
    className?: string;
    id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Select = memo(forwardRef<HTMLDivElement, SelectProps>(
    function Select(props, ref) {
        const { className = '', id, ...options } = props;
        const vm = useSelect(options);

        const sizeClass = `ark-select--${vm.model.size}`;
        const variantClass = `ark-select--${vm.model.variant}`;
        const themeClass = vm.model.isDark ? 'ark-select--dark' : 'ark-select--light';
        const stateClasses = [
            vm.model.disabled && 'ark-select--disabled',
            vm.model.error && 'ark-select--error',
            vm.isOpen && 'ark-select--open',
        ].filter(Boolean).join(' ');

        return (
            <div
                ref={(node) => {
                    (vm.containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                className={`ark-select ${sizeClass} ${variantClass} ${themeClass} ${stateClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {vm.model.label && (
                    <label className="ark-select__label" htmlFor={id}>
                        {vm.model.label}
                        {vm.model.required && <span className="ark-select__required">*</span>}
                    </label>
                )}

                <div
                    className="ark-select__trigger"
                    onClick={() => !vm.model.disabled && vm.toggle()}
                    onKeyDown={vm.handleKeyDown}
                    role="combobox"
                    aria-expanded={vm.isOpen}
                    aria-haspopup="listbox"
                    tabIndex={vm.model.disabled ? -1 : 0}
                >
                    {vm.model.searchable && vm.isOpen ? (
                        <input
                            type="text"
                            className="ark-select__search"
                            value={vm.searchQuery}
                            onChange={(e) => vm.setSearchQuery(e.target.value)}
                            placeholder={vm.selectedOption?.label || vm.model.placeholder}
                            autoFocus
                        />
                    ) : (
                        <span className={`ark-select__value ${!vm.selectedOption ? 'ark-select__value--placeholder' : ''}`}>
                            {vm.selectedOption?.icon && <span className="ark-select__icon">{vm.selectedOption.icon}</span>}
                            {vm.selectedOption?.label || vm.model.placeholder}
                        </span>
                    )}
                    <span className="ark-select__arrow">▼</span>
                </div>

                {vm.isOpen && (
                    <ul className="ark-select__dropdown" role="listbox">
                        {vm.filteredOptions.length === 0 ? (
                            <li className="ark-select__empty">No options</li>
                        ) : (
                            vm.filteredOptions.map((option: SelectOption, index: number) => (
                                <li
                                    key={option.value}
                                    className={`ark-select__option ${option.disabled ? 'ark-select__option--disabled' : ''} ${option.value === vm.model.value ? 'ark-select__option--selected' : ''} ${index === vm.highlightedIndex ? 'ark-select__option--highlighted' : ''}`}
                                    onClick={() => vm.handleSelect(option)}
                                    role="option"
                                    aria-selected={option.value === vm.model.value}
                                >
                                    {option.icon && <span className="ark-select__option-icon">{option.icon}</span>}
                                    {option.label}
                                    {option.value === vm.model.value && <span className="ark-select__check">✓</span>}
                                </li>
                            ))
                        )}
                    </ul>
                )}

                {(vm.model.helperText || vm.model.error) && (
                    <span className={`ark-select__helper ${vm.model.error ? 'ark-select__helper--error' : ''}`}>
                        {vm.model.error || vm.model.helperText}
                    </span>
                )}
            </div>
        );
    }
));

Select.displayName = 'Select';

export default Select;
