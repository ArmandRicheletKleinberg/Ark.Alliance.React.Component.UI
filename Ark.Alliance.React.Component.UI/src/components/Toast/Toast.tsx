/**
 * @fileoverview Toast Component
 * @module components/Toast
 * 
 * Toast notification component with accessibility support.
 * Renders individual toast items within a positioned container.
 */

import { forwardRef, memo, useMemo, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { Label } from '../Label';
import {
    type ToastItem,
    type ToastTypeValue,
    TOAST_TYPE_ICONS,
} from './Toast.model';
import { type UseToastResult } from './Toast.viewmodel';
import './Toast.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ToastContainer props
 */
export interface ToastContainerProps {
    /** Toast ViewModel result */
    toasts: ToastItem[];
    /** Remove toast handler */
    removeToast: (id: string) => void;
    /** Container class */
    containerClasses: string;
    /** Pause handler for hover */
    pause?: () => void;
    /** Resume handler for hover */
    resume?: () => void;
    /** Whether to pause on hover */
    pauseOnHover?: boolean;
    /** Additional class name */
    className?: string;
    /** Light theme variant */
    light?: boolean;
}

/**
 * Individual Toast item props
 */
export interface ToastItemProps {
    /** Toast data */
    toast: ToastItem;
    /** Remove handler */
    onRemove: (id: string) => void;
    /** Custom icon renderer */
    renderIcon?: (type: ToastTypeValue) => ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Individual Toast notification
 */
export const ToastNotification = memo(forwardRef<HTMLDivElement, ToastItemProps>(
    function ToastNotification({ toast, onRemove, renderIcon }, ref) {
        const iconName = toast.icon || TOAST_TYPE_ICONS[toast.type];

        return (
            <div
                ref={ref}
                className={`ark-toast ark-toast--${toast.type}`}
                role="alert"
                aria-live="polite"
                aria-atomic="true"
            >
                {/* Icon */}
                <div className="ark-toast__icon">
                    {renderIcon ? (
                        renderIcon(toast.type)
                    ) : (
                        <Icon name={iconName} size="sm" />
                    )}
                </div>

                {/* Content */}
                <div className="ark-toast__content">
                    {toast.title && (
                        <h4 className="ark-toast__title">
                            <Label text={toast.title} weight="semibold" size="md" />
                        </h4>
                    )}
                    <p className="ark-toast__message">{toast.message}</p>

                    {/* Action button */}
                    {toast.action && (
                        <div className="ark-toast__action">
                            <button
                                className="ark-toast__action-btn"
                                onClick={toast.action.onClick}
                                type="button"
                            >
                                {toast.action.label}
                            </button>
                        </div>
                    )}
                </div>

                {/* Close button */}
                {toast.dismissible && (
                    <button
                        className="ark-toast__close"
                        onClick={() => onRemove(toast.id)}
                        type="button"
                        aria-label="Close notification"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
        );
    }
));

ToastNotification.displayName = 'ToastNotification';

// ═══════════════════════════════════════════════════════════════════════════
// TOAST CONTAINER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toast Container - Renders all active toasts
 * 
 * @example
 * ```tsx
 * function App() {
 *   const toast = useToast({ position: 'top-right' });
 *   
 *   return (
 *     <>
 *       <button onClick={() => toast.showToast('Hello!', 'success')}>
 *         Show Toast
 *       </button>
 *       <ToastContainer {...toast} />
 *     </>
 *   );
 * }
 * ```
 */
export const ToastContainer = memo(forwardRef<HTMLDivElement, ToastContainerProps>(
    function ToastContainer(props, ref) {
        const {
            toasts,
            removeToast,
            containerClasses,
            pause,
            resume,
            pauseOnHover = true,
            className = '',
            light = false,
        } = props;

        const containerClassName = useMemo(() => {
            const classes = [containerClasses, className];
            if (light) classes.push('ark-toast-container--light');
            return classes.filter(Boolean).join(' ');
        }, [containerClasses, className, light]);

        // Don't render if no toasts
        if (toasts.length === 0) {
            return null;
        }

        return (
            <div
                ref={ref}
                className={containerClassName}
                onMouseEnter={pauseOnHover ? pause : undefined}
                onMouseLeave={pauseOnHover ? resume : undefined}
                onFocus={pauseOnHover ? pause : undefined}
                onBlur={pauseOnHover ? resume : undefined}
            >
                {toasts.map(toast => (
                    <ToastNotification
                        key={toast.id}
                        toast={toast}
                        onRemove={removeToast}
                    />
                ))}
            </div>
        );
    }
));

ToastContainer.displayName = 'ToastContainer';

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL TOAST CONTAINER (uses context)
// ═══════════════════════════════════════════════════════════════════════════

import { useToastContext } from './Toast.viewmodel';

/**
 * GlobalToastContainer - Uses ToastProvider context
 * 
 * Place this once in your app, wrapped by ToastProvider.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ToastProvider position="top-right">
 *       <Router>...</Router>
 *       <GlobalToastContainer />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export const GlobalToastContainer: React.FC<{ light?: boolean; className?: string }> = ({
    light,
    className,
}) => {
    const toast = useToastContext();

    return (
        <ToastContainer
            toasts={toast.toasts}
            removeToast={toast.removeToast}
            containerClasses={toast.containerClasses}
            pause={toast.pause}
            resume={toast.resume}
            pauseOnHover={toast.model.pauseOnHover}
            light={light}
            className={className}
        />
    );
};

GlobalToastContainer.displayName = 'GlobalToastContainer';

export default ToastContainer;
