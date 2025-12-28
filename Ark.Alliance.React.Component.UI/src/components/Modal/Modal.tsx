/**
 * @fileoverview Modal Component View
 * @module components/Modal
 */

import { forwardRef, memo, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useBaseViewModel } from '../../core/base';
import { ModalModelSchema, defaultModalModel, type ModalModel } from './Modal.model';
import './Modal.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ModalProps extends Partial<ModalModel> {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Modal = memo(forwardRef<HTMLDivElement, ModalProps>(
    function Modal(props, ref) {
        const { className = '', children, footer, isOpen, onClose, ...modelData } = props;

        const modelOptions = useMemo(() => {
            return ModalModelSchema.parse({ ...defaultModalModel, ...modelData, isOpen });
        }, [modelData, isOpen]);

        const base = useBaseViewModel<ModalModel>(modelOptions, {
            model: modelOptions,
            eventChannel: 'modal',
        });

        // Escape key handler
        const handleKeyDown = useCallback((e: KeyboardEvent) => {
            if (e.key === 'Escape' && base.model.closeOnEscape) {
                onClose();
            }
        }, [base.model.closeOnEscape, onClose]);

        useEffect(() => {
            if (isOpen) {
                document.addEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'hidden';
            }
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
            };
        }, [isOpen, handleKeyDown]);

        const handleBackdropClick = useCallback((e: React.MouseEvent) => {
            if (e.target === e.currentTarget && base.model.closeOnBackdrop) {
                onClose();
            }
        }, [base.model.closeOnBackdrop, onClose]);

        if (!isOpen) return null;

        const sizeClass = `ark-modal--${base.model.size}`;
        const themeClass = base.model.isDark ? 'ark-modal--dark' : 'ark-modal--light';
        const centeredClass = base.model.centered ? 'ark-modal--centered' : '';

        const modalContent = (
            <div
                className={`ark-modal__backdrop ${themeClass}`}
                onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby={base.model.title ? 'modal-title' : undefined}
            >
                <div
                    ref={ref}
                    className={`ark-modal__container ${sizeClass} ${centeredClass} ${className}`}
                    data-testid={base.model.testId}
                >
                    {(base.model.title || base.model.showClose) && (
                        <div className="ark-modal__header">
                            <div className="ark-modal__header-content">
                                {base.model.title && (
                                    <h2 id="modal-title" className="ark-modal__title">{base.model.title}</h2>
                                )}
                                {base.model.subtitle && (
                                    <p className="ark-modal__subtitle">{base.model.subtitle}</p>
                                )}
                            </div>
                            {base.model.showClose && (
                                <button
                                    className="ark-modal__close"
                                    onClick={onClose}
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    )}

                    <div className="ark-modal__body">
                        {children}
                    </div>

                    {footer && (
                        <div className="ark-modal__footer">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        );

        return createPortal(modalContent, document.body);
    }
));

Modal.displayName = 'Modal';

export default Modal;
