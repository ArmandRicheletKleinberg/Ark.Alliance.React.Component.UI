/**
 * @fileoverview Base ViewModel Hook
 * @module core/base/BaseViewModel
 * 
 * Foundation for all component ViewModels implemented as React hooks.
 * Provides state management, lifecycle hooks, and event handling.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { BaseModel } from './BaseComponentModel';
import { useEventBus } from '../events';
import type { ComponentEvent } from '../events';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lifecycle phase for components
 */
export type LifecyclePhase = 'mounting' | 'mounted' | 'updating' | 'unmounting' | 'unmounted';

/**
 * Base ViewModel state
 */
export interface BaseViewModelState {
    /** Current lifecycle phase */
    phase: LifecyclePhase;

    /** Loading state */
    isLoading: boolean;

    /** Error state */
    error: Error | null;

    /** Whether the component is mounted */
    isMounted: boolean;
}

/**
 * Options for the base ViewModel hook
 */
export interface UseBaseViewModelOptions<T extends BaseModel> {
    /** Initial model data */
    model?: Partial<T>;

    /** Called when component mounts */
    onMount?: () => void | Promise<void>;

    /** Called when component unmounts */
    onUnmount?: () => void;

    /** Called when model updates */
    onUpdate?: (prevModel: T, newModel: T) => void;

    /** Event channel for cross-component communication */
    eventChannel?: string;
}

/**
 * Return type for the base ViewModel hook
 */
export interface BaseViewModelResult<T extends BaseModel> {
    /** Current model state */
    model: T;

    /** ViewModel state */
    state: BaseViewModelState;

    /** Update model data */
    updateModel: (updates: Partial<T>) => void;

    /** Set loading state */
    setLoading: (loading: boolean) => void;

    /** Set error state */
    setError: (error: Error | null) => void;

    /** Emit an event */
    emit: <E>(eventType: string, payload: E) => void;

    /** Subscribe to an event */
    subscribe: <E>(eventType: string, handler: (event: ComponentEvent<E>) => void) => () => void;

    /** Execute an async action with loading/error handling */
    executeAsync: <R>(action: () => Promise<R>) => Promise<R | null>;
}

// ═══════════════════════════════════════════════════════════════════════════
// BASE VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base ViewModel hook that provides common functionality for all components.
 * 
 * Features:
 * - Lifecycle management (mount, update, unmount)
 * - State management (loading, error)
 * - Event bus integration
 * - Async action execution with error handling
 * 
 * @example
 * ```tsx
 * function useMyComponent(options: MyComponentOptions) {
 *   const base = useBaseViewModel<MyModel>(myDefaultModel, options);
 *   
 *   const handleClick = useCallback(() => {
 *     base.emit('click', { id: base.model.id });
 *   }, [base]);
 *   
 *   return { ...base, handleClick };
 * }
 * ```
 */
export function useBaseViewModel<T extends BaseModel>(
    defaultModel: T,
    options: UseBaseViewModelOptions<T> = {}
): BaseViewModelResult<T> {
    // Merge default model with provided model
    const initialModel = useMemo(
        () => ({ ...defaultModel, ...options.model }) as T,
        [] // Only compute once
    );

    // Core state
    const [model, setModel] = useState<T>(initialModel);
    const [state, setState] = useState<BaseViewModelState>({
        phase: 'mounting',
        isLoading: false,
        error: null,
        isMounted: false,
    });

    // Refs for tracking previous values and cleanup
    const prevModelRef = useRef<T>(model);
    const mountedRef = useRef(false);

    // Event bus hook
    const { emit: busEmit, subscribe: busSubscribe } = useEventBus(options.eventChannel);

    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════

    // Mount effect
    useEffect(() => {
        mountedRef.current = true;
        setState(prev => ({ ...prev, phase: 'mounted', isMounted: true }));

        // Call onMount callback
        if (options.onMount) {
            const result = options.onMount();
            if (result instanceof Promise) {
                result.catch(err => {
                    if (mountedRef.current) {
                        setState(prev => ({ ...prev, error: err }));
                    }
                });
            }
        }

        // Cleanup on unmount
        return () => {
            mountedRef.current = false;
            setState(prev => ({ ...prev, phase: 'unmounting', isMounted: false }));

            if (options.onUnmount) {
                options.onUnmount();
            }

            setState(prev => ({ ...prev, phase: 'unmounted' }));
        };
    }, []);

    // Update effect
    useEffect(() => {
        if (state.phase === 'mounted' && prevModelRef.current !== model) {
            setState(prev => ({ ...prev, phase: 'updating' }));

            if (options.onUpdate) {
                options.onUpdate(prevModelRef.current, model);
            }

            prevModelRef.current = model;
            setState(prev => ({ ...prev, phase: 'mounted' }));
        }
    }, [model, state.phase, options.onUpdate]);

    // ═══════════════════════════════════════════════════════════════════════
    // STATE UPDATERS
    // ═══════════════════════════════════════════════════════════════════════

    const updateModel = useCallback((updates: Partial<T>) => {
        if (mountedRef.current) {
            setModel(prev => ({ ...prev, ...updates }));
        }
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        if (mountedRef.current) {
            setState(prev => ({ ...prev, isLoading: loading }));
        }
    }, []);

    const setError = useCallback((error: Error | null) => {
        if (mountedRef.current) {
            setState(prev => ({ ...prev, error }));
        }
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLING
    // ═══════════════════════════════════════════════════════════════════════

    const emit = useCallback(<E,>(eventType: string, payload: E) => {
        busEmit(eventType, payload);
    }, [busEmit]);

    const subscribe = useCallback(<E,>(
        eventType: string,
        handler: (event: ComponentEvent<E>) => void
    ) => {
        return busSubscribe(eventType, handler);
    }, [busSubscribe]);

    // ═══════════════════════════════════════════════════════════════════════
    // ASYNC EXECUTION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Execute an async action with automatic loading/error handling
     */
    const executeAsync = useCallback(async <R,>(action: () => Promise<R>): Promise<R | null> => {
        if (!mountedRef.current) return null;

        setLoading(true);
        setError(null);

        try {
            const result = await action();
            if (mountedRef.current) {
                setLoading(false);
            }
            return result;
        } catch (err) {
            if (mountedRef.current) {
                setError(err as Error);
                setLoading(false);
            }
            return null;
        }
    }, [setLoading, setError]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        model,
        state,
        updateModel,
        setLoading,
        setError,
        emit,
        subscribe,
        executeAsync,
    };
}

export default useBaseViewModel;
