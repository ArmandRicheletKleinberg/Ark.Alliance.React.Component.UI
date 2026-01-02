/**
 * @fileoverview Toast Component ViewModel
 * @module components/Toast
 * 
 * Business logic and state management for the Toast notification system.
 * Provides queue management, auto-dismiss, and positioning.
 */

import { useState, useCallback, useRef, useEffect, useMemo, createContext, useContext, ReactNode } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import {
    ToastModelSchema,
    ToastItemSchema,
    createToastItem,
    type ToastModel,
    type ToastItem,
    type ToastTypeValue,
    defaultToastModel,
} from './Toast.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toast ViewModel options
 */
export interface UseToastOptions extends Partial<ToastModel> {
    /** Initial toasts to display */
    initialToasts?: ToastItem[];
    /** Callback when toast is added */
    onToastAdd?: (toast: ToastItem) => void;
    /** Callback when toast is removed */
    onToastRemove?: (toast: ToastItem) => void;
}

/**
 * Toast ViewModel result
 */
export interface UseToastResult extends BaseViewModelResult<ToastModel> {
    /** Current active toasts */
    toasts: ToastItem[];
    /** Add a new toast */
    showToast: (message: string, type?: ToastTypeValue, options?: Partial<ToastItem>) => string;
    /** Remove a toast by ID */
    removeToast: (id: string) => void;
    /** Remove all toasts */
    clearAll: () => void;
    /** Pause auto-dismiss timers */
    pause: () => void;
    /** Resume auto-dismiss timers */
    resume: () => void;
    /** Whether timers are paused */
    isPaused: boolean;
    /** Container CSS classes */
    containerClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toast ViewModel hook.
 * 
 * Manages toast queue, auto-dismiss, and positioning.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToast({ position: 'top-right' });
 *   
 *   const handleSave = () => {
 *     toast.showToast('Saved successfully!', 'success');
 *   };
 *   
 *   return (
 *     <>
 *       <button onClick={handleSave}>Save</button>
 *       <ToastContainer {...toast} />
 *     </>
 *   );
 * }
 * ```
 */
export function useToast(options: UseToastOptions = {}): UseToastResult {
    const { initialToasts = [], onToastAdd, onToastRemove, ...modelOptions } = options;

    // Parse model with defaults
    const parsedModel = useMemo(
        () => ToastModelSchema.parse({ ...defaultToastModel, ...modelOptions }),
        [JSON.stringify(modelOptions)]
    );

    // Base ViewModel
    const base = useBaseViewModel<ToastModel>(parsedModel, {});

    // Toasts state
    const [toasts, setToasts] = useState<ToastItem[]>(initialToasts);
    const [isPaused, setIsPaused] = useState(false);
    const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const remainingTimeRef = useRef<Map<string, number>>(new Map());
    const pauseStartRef = useRef<number | null>(null);

    // ═══════════════════════════════════════════════════════════════════════
    // TIMER MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Start auto-dismiss timer for a toast
     */
    const startTimer = useCallback((toast: ToastItem) => {
        if (toast.duration === 0) return; // Manual dismiss only

        const remaining = remainingTimeRef.current.get(toast.id) || toast.duration;

        const timer = setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
            timersRef.current.delete(toast.id);
            remainingTimeRef.current.delete(toast.id);
            onToastRemove?.(toast);
        }, remaining);

        timersRef.current.set(toast.id, timer);
        remainingTimeRef.current.set(toast.id, remaining);
    }, [onToastRemove]);

    /**
     * Clear timer for a toast
     */
    const clearTimer = useCallback((id: string) => {
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // PUBLIC METHODS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Show a new toast notification
     */
    const showToast = useCallback((
        message: string,
        type: ToastTypeValue = 'info',
        toastOptions: Partial<ToastItem> = {}
    ): string => {
        const toast = createToastItem({
            message,
            type,
            duration: base.model.pauseOnHover ? 4000 : 4000,
            ...toastOptions,
        });

        setToasts(prev => {
            const newToasts = base.model.stacked
                ? [...prev, toast]
                : [toast];

            // Limit to maxToasts
            return newToasts.slice(-base.model.maxToasts);
        });

        if (!isPaused) {
            startTimer(toast);
        }

        onToastAdd?.(toast);
        return toast.id;
    }, [base.model.stacked, base.model.maxToasts, base.model.pauseOnHover, isPaused, startTimer, onToastAdd]);

    /**
     * Remove a toast by ID
     */
    const removeToast = useCallback((id: string) => {
        clearTimer(id);
        remainingTimeRef.current.delete(id);

        setToasts(prev => {
            const toast = prev.find(t => t.id === id);
            if (toast) {
                onToastRemove?.(toast);
            }
            return prev.filter(t => t.id !== id);
        });
    }, [clearTimer, onToastRemove]);

    /**
     * Clear all toasts
     */
    const clearAll = useCallback(() => {
        timersRef.current.forEach((timer, id) => {
            clearTimeout(timer);
        });
        timersRef.current.clear();
        remainingTimeRef.current.clear();
        setToasts([]);
    }, []);

    /**
     * Pause all auto-dismiss timers
     */
    const pause = useCallback(() => {
        if (isPaused) return;

        setIsPaused(true);
        pauseStartRef.current = Date.now();

        // Clear all active timers and track remaining time
        toasts.forEach(toast => {
            const timer = timersRef.current.get(toast.id);
            if (timer) {
                clearTimeout(timer);
                const elapsed = toast.createdAt
                    ? Date.now() - toast.createdAt
                    : 0;
                const remaining = Math.max(0, toast.duration - elapsed);
                remainingTimeRef.current.set(toast.id, remaining);
            }
        });
        timersRef.current.clear();
    }, [isPaused, toasts]);

    /**
     * Resume all auto-dismiss timers
     */
    const resume = useCallback(() => {
        if (!isPaused) return;

        setIsPaused(false);
        pauseStartRef.current = null;

        // Restart timers with remaining time
        toasts.forEach(toast => {
            startTimer(toast);
        });
    }, [isPaused, toasts, startTimer]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Container CSS classes based on position
     */
    const containerClasses = useMemo(() => {
        const classes = ['ark-toast-container'];
        classes.push(`ark-toast-container--${base.model.position}`);
        return classes.join(' ');
    }, [base.model.position]);

    // ═══════════════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        return () => {
            timersRef.current.forEach(timer => clearTimeout(timer));
            timersRef.current.clear();
        };
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        toasts,
        showToast,
        removeToast,
        clearAll,
        pause,
        resume,
        isPaused,
        containerClasses,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT (for global toast access)
// ═══════════════════════════════════════════════════════════════════════════

const ToastContext = createContext<UseToastResult | null>(null);

/**
 * Toast Provider Props
 */
export interface ToastProviderProps extends UseToastOptions {
    children: ReactNode;
}

/**
 * Toast Provider component for global toast access
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ToastProvider position="top-right">
 *       <MyApp />
 *       <ToastContainer />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export function ToastProvider({ children, ...options }: ToastProviderProps): JSX.Element {
    const toast = useToast(options);

    return (
        <ToastContext.Provider value={toast}>
            {children}
        </ToastContext.Provider>
    );
}

/**
 * Hook to access global toast context
 * 
 * @throws Error if used outside ToastProvider
 */
export function useToastContext(): UseToastResult {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
}

export default useToast;
