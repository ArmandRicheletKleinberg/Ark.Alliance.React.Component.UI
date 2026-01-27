/**
 * @fileoverview TextArea Component View
 * @module components/Input/TextArea
 */

import { forwardRef, memo, useMemo } from 'react';
import { useBaseViewModel } from '../../../core/base';
import { TextAreaModelSchema, defaultTextAreaModel, type TextAreaModel } from './TextArea.model';
import './TextArea.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TextAreaProps extends Partial<TextAreaModel> {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    className?: string;
    id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const TextArea = memo(forwardRef<HTMLTextAreaElement, TextAreaProps>(
    function TextArea(props, ref) {
        const { className = '', id, onChange, onBlur, onFocus, value, ...modelData } = props;

        const modelOptions = useMemo(() => {
            return TextAreaModelSchema.parse({ ...defaultTextAreaModel, ...modelData, value: value ?? '' });
        }, [modelData, value]);

        const base = useBaseViewModel<TextAreaModel>(modelOptions, {
            model: modelOptions,
            eventChannel: 'textarea',
        });

        const sizeClass = `ark-textarea--${base.model.size}`;
        const variantClass = `ark-textarea--${base.model.variant}`;
        const themeClass = base.model.isDark ? 'ark-textarea--dark' : 'ark-textarea--light';
        const stateClasses = [
            base.model.disabled && 'ark-textarea--disabled',
            base.model.error && 'ark-textarea--error',
        ].filter(Boolean).join(' ');

        const charCount = value?.length ?? 0;

        return (
            <div className={`ark-textarea ${sizeClass} ${variantClass} ${themeClass} ${stateClasses} ${className}`}>
                {base.model.label && (
                    <label className="ark-textarea__label" htmlFor={id}>
                        {base.model.label}
                        {base.model.required && <span className="ark-textarea__required">*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={id}
                    className="ark-textarea__input"
                    value={value ?? ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    placeholder={base.model.placeholder}
                    disabled={base.model.disabled}
                    rows={base.model.rows}
                    maxLength={base.model.maxLength}
                    style={{ resize: base.model.resize }}
                    data-testid={base.model.testId}
                />

                <div className="ark-textarea__footer">
                    {(base.model.helperText || base.model.error) && (
                        <span className={`ark-textarea__helper ${base.model.error ? 'ark-textarea__helper--error' : ''}`}>
                            {base.model.error || base.model.helperText}
                        </span>
                    )}
                    {base.model.maxLength && (
                        <span className="ark-textarea__counter">
                            {charCount}/{base.model.maxLength}
                        </span>
                    )}
                </div>
            </div>
        );
    }
));

TextArea.displayName = 'TextArea';

export default TextArea;
