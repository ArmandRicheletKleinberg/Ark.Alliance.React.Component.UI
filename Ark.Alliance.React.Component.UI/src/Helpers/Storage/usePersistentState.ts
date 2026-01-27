/**
 * @fileoverview Persistent State Hook
 * @module Helpers/Storage
 * 
 * React hook for state persistence using CookieHelper.
 * 
 * @example Basic Usage
 * ```tsx
 * function MyComponent() {
 *     const [theme, setTheme, clearTheme] = usePersistentState(
 *         'user-theme',
 *         'light',
 *         { expires: 30 }
 *     );
 *     
 *     return (
 *         <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *             Toggle Theme: {theme}
 *         </button>
 *     );
 * }
 * ```
 * 
 * @example Grid Column Widths
 * ```tsx
 * const [columnWidths, setColumnWidths] = usePersistentState(
 *     'grid-orders-columns',
 *     { orderId: 100, price: 80, amount: 120 },
 *     { fallbackToLocalStorage: true }
 * );
 * ```
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { CookieHelper, type StorageOptions } from './CookieHelper';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for usePersistentState hook.
 */
export interface UsePersistentStateOptions extends StorageOptions {
    /** Whether to sync state across browser tabs */
    syncTabs?: boolean;
    /** Debounce time in ms for persistence (prevents rapid writes) */
    debounceMs?: number;
}

/**
 * Return type of usePersistentState hook.
 */
export type UsePersistentStateResult<T> = [
    /** Current state value */
    T,
    /** State setter function */
    (value: T | ((prev: T) => T)) => void,
    /** Clear persisted state and reset to default */
    () => void,
];

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * React hook for persisting state to cookies/localStorage.
 * 
 * Similar to useState but automatically persists to storage and
 * restores on mount. Supports tab synchronization and debouncing.
 * 
 * @param key - Storage key
 * @param defaultValue - Default value when nothing is stored
 * @param options - Persistence options
 * @returns Tuple of [value, setValue, clearValue]
 * 
 * @example
 * ```tsx
 * // Simple usage
 * const [count, setCount] = usePersistentState('counter', 0);
 * 
 * // With options
 * const [prefs, setPrefs, clearPrefs] = usePersistentState(
 *     'user-prefs',
 *     { theme: 'dark', language: 'en' },
 *     { expires: 365, syncTabs: true }
 * );
 * ```
 */
export function usePersistentState<T>(
    key: string,
    defaultValue: T,
    options: UsePersistentStateOptions = {}
): UsePersistentStateResult<T> {
    const {
        syncTabs = false,
        debounceMs = 0,
        ...storageOptions
    } = options;

    // Track if this is the initial mount
    const isInitialMount = useRef(true);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Initialize state from storage or default
    const [state, setState] = useState<T>(() => {
        const stored = CookieHelper.get<T>(key);
        return stored !== null ? stored : defaultValue;
    });

    // Persist to storage when state changes
    useEffect(() => {
        // Skip initial mount (we just loaded from storage)
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const persist = () => {
            CookieHelper.set(key, state, {
                ...storageOptions,
                fallbackToLocalStorage: storageOptions.fallbackToLocalStorage ?? true,
            });
        };

        if (debounceMs > 0) {
            // Debounced persistence
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(persist, debounceMs);
        } else {
            // Immediate persistence
            persist();
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [key, state, debounceMs, storageOptions]);

    // Tab synchronization via storage event
    useEffect(() => {
        if (!syncTabs || typeof window === 'undefined') return;

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    // Handle our wrapper format from CookieHelper
                    const newValue = parsed.value !== undefined ? parsed.value : parsed;
                    setState(newValue as T);
                } catch {
                    // Ignore parse errors
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, syncTabs]);

    // Setter that handles both direct values and updater functions
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setState(prev => {
            const newValue = typeof value === 'function'
                ? (value as (prev: T) => T)(prev)
                : value;
            return newValue;
        });
    }, []);

    // Clear persisted state and reset to default
    const clearValue = useCallback(() => {
        CookieHelper.remove(key);
        setState(defaultValue);
    }, [key, defaultValue]);

    return [state, setValue, clearValue];
}

// ═══════════════════════════════════════════════════════════════════════════
// GRID-SPECIFIC HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for persisting grid column widths.
 * 
 * @param gridId - Unique grid identifier
 * @param defaultWidths - Default column widths
 * @returns Tuple of [widths, setWidth, resetWidths]
 * 
 * @example
 * ```tsx
 * const [widths, setWidth, resetWidths] = useGridColumnWidths(
 *     'orders-grid',
 *     { id: 80, symbol: 100, price: 120 }
 * );
 * 
 * // Update single column
 * setWidth('price', 150);
 * ```
 */
export function useGridColumnWidths(
    gridId: string,
    defaultWidths: Record<string, number>
): [
        Record<string, number>,
        (column: string, width: number) => void,
        () => void,
    ] {
    const [widths, setWidths, clearWidths] = usePersistentState(
        `grid-${gridId}-columns`,
        defaultWidths,
        { fallbackToLocalStorage: true, debounceMs: 300 }
    );

    const setColumnWidth = useCallback((column: string, width: number) => {
        setWidths(prev => ({ ...prev, [column]: width }));
    }, [setWidths]);

    return [widths, setColumnWidth, clearWidths];
}

/**
 * Hook for persisting grid sort state.
 * 
 * @param gridId - Unique grid identifier
 * @returns Tuple of [sortState, setSortState, clearSort]
 */
export function useGridSortState(
    gridId: string,
): [
        { field: string; direction: 'asc' | 'desc' } | null,
        (sort: { field: string; direction: 'asc' | 'desc' } | null) => void,
        () => void,
    ] {
    return usePersistentState(
        `grid-${gridId}-sort`,
        null,
        { fallbackToLocalStorage: true }
    );
}

/**
 * Hook for persisting grid page size.
 * 
 * @param gridId - Unique grid identifier
 * @param defaultPageSize - Default page size
 * @returns Tuple of [pageSize, setPageSize, resetPageSize]
 */
export function useGridPageSize(
    gridId: string,
    defaultPageSize: number = 50
): [number, (size: number) => void, () => void] {
    return usePersistentState(
        `grid-${gridId}-pageSize`,
        defaultPageSize,
        { fallbackToLocalStorage: true }
    );
}

export default usePersistentState;
