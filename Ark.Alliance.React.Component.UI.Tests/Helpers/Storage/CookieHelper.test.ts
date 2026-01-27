/**
 * @fileoverview CookieHelper Tests
 * @module Ark.Alliance.React.Component.UI.Tests/Helpers/Storage
 * 
 * Tests for CookieHelper and usePersistentState.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Import the utilities we're testing
import {
    CookieHelper,
    isBrowser,
    areCookiesEnabled,
    isLocalStorageAvailable,
    serialize,
    deserialize,
    getByteLength,
} from '../../../Ark.Alliance.React.Component.UI/src/Helpers/Storage/CookieHelper';

import {
    usePersistentState,
    useGridColumnWidths,
    useGridSortState,
    useGridPageSize,
} from '../../../Ark.Alliance.React.Component.UI/src/Helpers/Storage/usePersistentState';

// ═══════════════════════════════════════════════════════════════════════════
// MOCK SETUP
// ═══════════════════════════════════════════════════════════════════════════

describe('CookieHelper', () => {
    let cookieStore: Record<string, string> = {};
    let localStorageStore: Record<string, string> = {};

    beforeEach(() => {
        // Reset stores
        cookieStore = {};
        localStorageStore = {};

        // Mock document.cookie
        Object.defineProperty(document, 'cookie', {
            get: () => Object.entries(cookieStore)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                .join('; '),
            set: (value: string) => {
                const parts = value.split(';');
                const [keyValue] = parts;
                const [key, val] = keyValue.split('=');
                const decodedKey = decodeURIComponent(key);

                // Check for expiration (delete if expired)
                if (value.includes('expires=Thu, 01 Jan 1970')) {
                    delete cookieStore[decodedKey];
                } else if (val !== undefined) {
                    cookieStore[decodedKey] = decodeURIComponent(val);
                }
            },
            configurable: true,
        });

        // Mock localStorage
        const localStorageMock = {
            getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
            setItem: vi.fn((key: string, value: string) => { localStorageStore[key] = value; }),
            removeItem: vi.fn((key: string) => { delete localStorageStore[key]; }),
            clear: vi.fn(() => { localStorageStore = {}; }),
            key: vi.fn((index: number) => Object.keys(localStorageStore)[index] ?? null),
            get length() { return Object.keys(localStorageStore).length; },
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY FUNCTION TESTS
    // ═══════════════════════════════════════════════════════════════════════

    describe('Utility Functions', () => {
        it('isBrowser should return true in JSDOM', () => {
            expect(isBrowser()).toBe(true);
        });

        it('serialize should convert objects to JSON', () => {
            expect(serialize({ foo: 'bar' })).toBe('{"foo":"bar"}');
            expect(serialize([1, 2, 3])).toBe('[1,2,3]');
            expect(serialize('test')).toBe('"test"');
            expect(serialize(123)).toBe('123');
        });

        it('deserialize should parse JSON strings', () => {
            expect(deserialize('{"foo":"bar"}')).toEqual({ foo: 'bar' });
            expect(deserialize('[1,2,3]')).toEqual([1, 2, 3]);
            expect(deserialize('"test"')).toBe('test');
            expect(deserialize('123')).toBe(123);
        });

        it('deserialize should return null for invalid JSON', () => {
            expect(deserialize('not json')).toBeNull();
            expect(deserialize('{')).toBeNull();
        });

        it('getByteLength should calculate UTF-8 byte length', () => {
            expect(getByteLength('hello')).toBe(5);
            expect(getByteLength('')).toBe(0);
            // UTF-8 multibyte characters
            expect(getByteLength('日本語')).toBe(9); // 3 bytes per character
        });

        it('areCookiesEnabled should detect cookie support', () => {
            // With our mock, cookies should be enabled
            expect(areCookiesEnabled()).toBe(true);
        });

        it('isLocalStorageAvailable should detect localStorage', () => {
            expect(isLocalStorageAvailable()).toBe(true);
        });
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COOKIEHELPER TESTS
    // ═══════════════════════════════════════════════════════════════════════

    describe('CookieHelper.set', () => {
        it('should set a simple value', () => {
            const result = CookieHelper.set('testKey', 'testValue');
            expect(result).toBe(true);
            expect(cookieStore['testKey']).toBe('"testValue"');
        });

        it('should set an object value', () => {
            const result = CookieHelper.set('user', { name: 'John', age: 30 });
            expect(result).toBe(true);
            expect(cookieStore['user']).toBe('{"name":"John","age":30}');
        });

        it('should set an array value', () => {
            const result = CookieHelper.set('items', [1, 2, 3]);
            expect(result).toBe(true);
            expect(cookieStore['items']).toBe('[1,2,3]');
        });
    });

    describe('CookieHelper.get', () => {
        it('should get a simple value', () => {
            cookieStore['testKey'] = '"testValue"';
            const result = CookieHelper.get<string>('testKey');
            expect(result).toBe('testValue');
        });

        it('should get an object value', () => {
            cookieStore['user'] = '{"name":"John","age":30}';
            const result = CookieHelper.get<{ name: string; age: number }>('user');
            expect(result).toEqual({ name: 'John', age: 30 });
        });

        it('should return null for non-existent key', () => {
            const result = CookieHelper.get('nonExistent');
            expect(result).toBeNull();
        });
    });

    describe('CookieHelper.remove', () => {
        it('should remove a cookie', () => {
            cookieStore['toRemove'] = '"value"';
            CookieHelper.remove('toRemove');
            expect(cookieStore['toRemove']).toBeUndefined();
        });

        it('should also remove from localStorage', () => {
            localStorageStore['toRemove'] = JSON.stringify({ value: 'test' });
            CookieHelper.remove('toRemove');
            expect(localStorageStore['toRemove']).toBeUndefined();
        });
    });

    describe('CookieHelper.exists', () => {
        it('should return true for existing cookie', () => {
            cookieStore['exists'] = '"yes"';
            expect(CookieHelper.exists('exists')).toBe(true);
        });

        it('should return true for existing localStorage item', () => {
            localStorageStore['exists'] = JSON.stringify({ value: 'yes' });
            expect(CookieHelper.exists('exists')).toBe(true);
        });

        it('should return false for non-existent key', () => {
            expect(CookieHelper.exists('nonExistent')).toBe(false);
        });
    });

    describe('CookieHelper.getDetailed', () => {
        it('should return cookie storage type', () => {
            cookieStore['test'] = '"value"';
            const result = CookieHelper.getDetailed<string>('test');
            expect(result.success).toBe(true);
            expect(result.storage).toBe('cookie');
            expect(result.value).toBe('value');
        });

        it('should return localStorage storage type', () => {
            localStorageStore['test'] = JSON.stringify({ value: 'value' });
            const result = CookieHelper.getDetailed<string>('test');
            expect(result.success).toBe(true);
            expect(result.storage).toBe('localStorage');
            expect(result.value).toBe('value');
        });

        it('should return none for non-existent key', () => {
            const result = CookieHelper.getDetailed('nonExistent');
            expect(result.success).toBe(false);
            expect(result.storage).toBe('none');
        });
    });

    describe('CookieHelper.clearByPrefix', () => {
        it('should clear all items with prefix in localStorage', () => {
            localStorageStore['grid-orders-columns'] = '{}';
            localStorageStore['grid-orders-sort'] = '{}';
            localStorageStore['other-key'] = '{}';

            CookieHelper.clearByPrefix('grid-orders');

            expect(localStorageStore['grid-orders-columns']).toBeUndefined();
            expect(localStorageStore['grid-orders-sort']).toBeUndefined();
            expect(localStorageStore['other-key']).toBeDefined();
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// PERSISTENT STATE HOOK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('usePersistentState', () => {
    let localStorageStore: Record<string, string> = {};

    beforeEach(() => {
        localStorageStore = {};

        const localStorageMock = {
            getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
            setItem: vi.fn((key: string, value: string) => { localStorageStore[key] = value; }),
            removeItem: vi.fn((key: string) => { delete localStorageStore[key]; }),
            clear: vi.fn(() => { localStorageStore = {}; }),
            key: vi.fn((index: number) => Object.keys(localStorageStore)[index] ?? null),
            get length() { return Object.keys(localStorageStore).length; },
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    });

    it('should initialize with default value when no stored value', () => {
        const { result } = renderHook(() => usePersistentState('test-key', 'default'));
        expect(result.current[0]).toBe('default');
    });

    it('should initialize with stored value when available', () => {
        // Pre-populate localStorage with a value
        localStorageStore['test-key'] = JSON.stringify({ value: 'stored', expires: undefined });

        const { result } = renderHook(() => usePersistentState('test-key', 'default'));
        expect(result.current[0]).toBe('stored');
    });

    it('should update state when setValue is called', () => {
        const { result } = renderHook(() => usePersistentState('test-key', 'initial'));

        act(() => {
            result.current[1]('updated');
        });

        expect(result.current[0]).toBe('updated');
    });

    it('should support function updater', () => {
        const { result } = renderHook(() => usePersistentState('counter', 0));

        act(() => {
            result.current[1]((prev) => prev + 1);
        });

        expect(result.current[0]).toBe(1);

        act(() => {
            result.current[1]((prev) => prev + 10);
        });

        expect(result.current[0]).toBe(11);
    });

    it('should clear persisted state when clearValue is called', () => {
        // Use unique key to avoid state pollution
        const testKey = 'clear-test-key-' + Date.now();
        localStorageStore[testKey] = JSON.stringify({ value: 'stored' });

        const { result } = renderHook(() => usePersistentState(testKey, 'default'));

        // Should have loaded the stored value
        expect(result.current[0]).toBe('stored');

        act(() => {
            result.current[2](); // clearValue
        });

        // Should reset to default
        expect(result.current[0]).toBe('default');
    });

    it('should handle complex objects', () => {
        const defaultValue = { theme: 'light', language: 'en', notifications: true };
        const { result } = renderHook(() => usePersistentState('prefs', defaultValue));

        expect(result.current[0]).toEqual(defaultValue);

        act(() => {
            result.current[1]({ ...defaultValue, theme: 'dark' });
        });

        expect(result.current[0].theme).toBe('dark');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// GRID-SPECIFIC HOOK TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Grid-Specific Hooks', () => {
    let localStorageStore: Record<string, string> = {};

    beforeEach(() => {
        localStorageStore = {};

        const localStorageMock = {
            getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
            setItem: vi.fn((key: string, value: string) => { localStorageStore[key] = value; }),
            removeItem: vi.fn((key: string) => { delete localStorageStore[key]; }),
            clear: vi.fn(() => { localStorageStore = {}; }),
            key: vi.fn((index: number) => Object.keys(localStorageStore)[index] ?? null),
            get length() { return Object.keys(localStorageStore).length; },
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    });

    describe('useGridColumnWidths', () => {
        it('should initialize with default widths', () => {
            const defaults = { id: 80, name: 150, price: 100 };
            const { result } = renderHook(() => useGridColumnWidths('test-grid', defaults));

            expect(result.current[0]).toEqual(defaults);
        });

        it('should update single column width', () => {
            const defaults = { id: 80, name: 150, price: 100 };
            const { result } = renderHook(() => useGridColumnWidths('test-grid', defaults));

            act(() => {
                result.current[1]('name', 200);
            });

            expect(result.current[0].name).toBe(200);
            expect(result.current[0].id).toBe(80); // Others unchanged
        });

        it('should reset widths', () => {
            const defaults = { id: 80, name: 150 };
            const { result } = renderHook(() => useGridColumnWidths('test-grid', defaults));

            act(() => {
                result.current[1]('name', 300);
            });

            expect(result.current[0].name).toBe(300);

            act(() => {
                result.current[2](); // reset
            });

            expect(result.current[0]).toEqual(defaults);
        });
    });

    describe('useGridSortState', () => {
        it('should initialize with null', () => {
            const { result } = renderHook(() => useGridSortState('test-grid'));
            expect(result.current[0]).toBeNull();
        });

        it('should set sort state', () => {
            const { result } = renderHook(() => useGridSortState('test-grid'));

            act(() => {
                result.current[1]({ field: 'price', direction: 'desc' });
            });

            expect(result.current[0]).toEqual({ field: 'price', direction: 'desc' });
        });

        it('should clear sort state', () => {
            const { result } = renderHook(() => useGridSortState('test-grid'));

            act(() => {
                result.current[1]({ field: 'price', direction: 'asc' });
            });

            act(() => {
                result.current[2](); // clear
            });

            expect(result.current[0]).toBeNull();
        });
    });

    describe('useGridPageSize', () => {
        it('should initialize with default page size', () => {
            const { result } = renderHook(() => useGridPageSize('test-grid', 25));
            expect(result.current[0]).toBe(25);
        });

        it('should use 50 as default when not specified', () => {
            const { result } = renderHook(() => useGridPageSize('test-grid'));
            expect(result.current[0]).toBe(50);
        });

        it('should update page size', () => {
            const { result } = renderHook(() => useGridPageSize('test-grid', 25));

            act(() => {
                result.current[1](100);
            });

            expect(result.current[0]).toBe(100);
        });
    });
});
