/**
 * @fileoverview Cookie and Storage Helper
 * @module Helpers/Storage
 * 
 * Provides a unified API for cookie and localStorage operations with automatic
 * fallback, JSON serialization, and expiration handling.
 * 
 * @example Basic Usage
 * ```typescript
 * import { CookieHelper } from '@/Helpers/Storage';
 * 
 * // Set a value
 * CookieHelper.set('user-preferences', { theme: 'dark' }, { expires: 30 });
 * 
 * // Get a value
 * const prefs = CookieHelper.get<UserPreferences>('user-preferences');
 * 
 * // Remove a value
 * CookieHelper.remove('user-preferences');
 * ```
 * 
 * @example With LocalStorage Fallback
 * ```typescript
 * CookieHelper.set('large-data', bigObject, { 
 *     fallbackToLocalStorage: true 
 * });
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for storage operations.
 */
export interface StorageOptions {
    /** Number of days until expiration (cookies only) */
    expires?: number;
    /** Cookie path (defaults to '/') */
    path?: string;
    /** Require HTTPS (cookies only) */
    secure?: boolean;
    /** SameSite policy (cookies only) */
    sameSite?: 'strict' | 'lax' | 'none';
    /** Automatically fall back to localStorage if cookie fails or exceeds size */
    fallbackToLocalStorage?: boolean;
}

/**
 * Result of a storage operation.
 */
export interface StorageResult<T> {
    /** Whether the operation succeeded */
    success: boolean;
    /** The stored/retrieved value */
    value?: T;
    /** Storage method used */
    storage: 'cookie' | 'localStorage' | 'none';
    /** Error message if failed */
    error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Maximum safe cookie size in bytes (4KB with safety margin) */
const MAX_COOKIE_SIZE = 3800;

/** Default cookie path */
const DEFAULT_PATH = '/';

/** Default expiration in days */
const DEFAULT_EXPIRES_DAYS = 365;

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if we're running in a browser environment.
 */
function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if cookies are available and enabled.
 */
function areCookiesEnabled(): boolean {
    if (!isBrowser()) return false;

    try {
        document.cookie = '__test_cookie__=test; path=/';
        const enabled = document.cookie.includes('__test_cookie__');
        document.cookie = '__test_cookie__=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        return enabled;
    } catch {
        return false;
    }
}

/**
 * Check if localStorage is available.
 */
function isLocalStorageAvailable(): boolean {
    if (!isBrowser()) return false;

    try {
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

/**
 * Safely serialize a value to JSON string.
 */
function serialize<T>(value: T): string {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

/**
 * Safely parse a JSON string.
 */
function deserialize<T>(value: string): T | null {
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

/**
 * Get byte length of a string (UTF-8).
 */
function getByteLength(str: string): number {
    return new Blob([str]).size;
}

/**
 * Build cookie string from parts.
 */
function buildCookieString(
    key: string,
    value: string,
    options: StorageOptions
): string {
    const parts: string[] = [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];

    const path = options.path ?? DEFAULT_PATH;
    parts.push(`path=${path}`);

    if (options.expires !== undefined) {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        parts.push(`expires=${date.toUTCString()}`);
    }

    if (options.secure) {
        parts.push('secure');
    }

    if (options.sameSite) {
        parts.push(`samesite=${options.sameSite}`);
    }

    return parts.join('; ');
}

// ═══════════════════════════════════════════════════════════════════════════
// COOKIE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Set a cookie value.
 */
function setCookie<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (!areCookiesEnabled()) return false;

    const serialized = serialize(value);
    const cookieString = buildCookieString(key, serialized, {
        expires: options.expires ?? DEFAULT_EXPIRES_DAYS,
        ...options,
    });

    // Check size limit
    if (getByteLength(cookieString) > MAX_COOKIE_SIZE) {
        return false;
    }

    try {
        document.cookie = cookieString;
        return true;
    } catch {
        return false;
    }
}

/**
 * Get a cookie value.
 */
function getCookie<T>(key: string): T | null {
    if (!areCookiesEnabled()) return null;

    try {
        const cookies = document.cookie.split(';');
        const encodedKey = encodeURIComponent(key);

        for (const cookie of cookies) {
            const [cookieKey, cookieValue] = cookie.trim().split('=');
            if (cookieKey === encodedKey && cookieValue) {
                return deserialize<T>(decodeURIComponent(cookieValue));
            }
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Remove a cookie.
 */
function removeCookie(key: string, path: string = DEFAULT_PATH): void {
    if (!isBrowser()) return;

    try {
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    } catch {
        // Silent fail
    }
}

/**
 * Check if a cookie exists.
 */
function cookieExists(key: string): boolean {
    return getCookie(key) !== null;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCALSTORAGE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Set a localStorage value with optional expiration.
 */
function setLocalStorage<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (!isLocalStorageAvailable()) return false;

    try {
        const wrapper = {
            value,
            expires: options.expires
                ? Date.now() + options.expires * 24 * 60 * 60 * 1000
                : undefined,
        };

        window.localStorage.setItem(key, serialize(wrapper));
        return true;
    } catch {
        return false;
    }
}

/**
 * Get a localStorage value, checking expiration.
 */
function getLocalStorage<T>(key: string): T | null {
    if (!isLocalStorageAvailable()) return null;

    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;

        const wrapper = deserialize<{ value: T; expires?: number }>(raw);
        if (!wrapper) return null;

        // Check expiration
        if (wrapper.expires && Date.now() > wrapper.expires) {
            window.localStorage.removeItem(key);
            return null;
        }

        return wrapper.value;
    } catch {
        return null;
    }
}

/**
 * Remove a localStorage item.
 */
function removeLocalStorage(key: string): void {
    if (!isLocalStorageAvailable()) return;

    try {
        window.localStorage.removeItem(key);
    } catch {
        // Silent fail
    }
}

/**
 * Check if a localStorage key exists.
 */
function localStorageExists(key: string): boolean {
    return getLocalStorage(key) !== null;
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED HELPER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CookieHelper - Unified storage helper with automatic fallback.
 * 
 * Provides a simple API for storing values in cookies with optional
 * localStorage fallback for large values or when cookies are unavailable.
 * 
 * @example
 * ```typescript
 * // Store user preferences
 * CookieHelper.set('prefs', { theme: 'dark' }, { expires: 30 });
 * 
 * // Retrieve with type safety
 * const prefs = CookieHelper.get<{ theme: string }>('prefs');
 * 
 * // Remove
 * CookieHelper.remove('prefs');
 * ```
 */
export const CookieHelper = {
    /**
     * Store a value in cookies (with optional localStorage fallback).
     * 
     * @param key - Storage key
     * @param value - Value to store (will be JSON serialized)
     * @param options - Storage options
     * @returns Whether the operation succeeded
     */
    set<T>(key: string, value: T, options: StorageOptions = {}): boolean {
        // Try cookie first
        if (setCookie(key, value, options)) {
            return true;
        }

        // Fallback to localStorage if enabled
        if (options.fallbackToLocalStorage) {
            return setLocalStorage(key, value, options);
        }

        return false;
    },

    /**
     * Retrieve a value from storage.
     * Checks both cookie and localStorage.
     * 
     * @param key - Storage key
     * @returns The stored value or null
     */
    get<T>(key: string): T | null {
        // Try cookie first
        const cookieValue = getCookie<T>(key);
        if (cookieValue !== null) {
            return cookieValue;
        }

        // Try localStorage
        return getLocalStorage<T>(key);
    },

    /**
     * Remove a value from both cookie and localStorage.
     * 
     * @param key - Storage key
     * @param path - Cookie path (for cookie removal)
     */
    remove(key: string, path: string = DEFAULT_PATH): void {
        removeCookie(key, path);
        removeLocalStorage(key);
    },

    /**
     * Check if a key exists in storage.
     * 
     * @param key - Storage key
     * @returns Whether the key exists
     */
    exists(key: string): boolean {
        return cookieExists(key) || localStorageExists(key);
    },

    /**
     * Get detailed result of a storage operation.
     * Useful for debugging or when you need to know which storage was used.
     * 
     * @param key - Storage key
     * @returns Detailed storage result
     */
    getDetailed<T>(key: string): StorageResult<T> {
        const cookieValue = getCookie<T>(key);
        if (cookieValue !== null) {
            return { success: true, value: cookieValue, storage: 'cookie' };
        }

        const localValue = getLocalStorage<T>(key);
        if (localValue !== null) {
            return { success: true, value: localValue, storage: 'localStorage' };
        }

        return { success: false, storage: 'none' };
    },

    /**
     * Clear all stored values with a given prefix.
     * 
     * @param prefix - Key prefix to match
     */
    clearByPrefix(prefix: string): void {
        if (!isBrowser()) return;

        // Clear localStorage
        if (isLocalStorageAvailable()) {
            const keysToRemove: string[] = [];
            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key?.startsWith(prefix)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => window.localStorage.removeItem(key));
        }

        // Clear cookies (more complex - need to parse all cookies)
        if (areCookiesEnabled()) {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [cookieKey] = cookie.trim().split('=');
                if (cookieKey && decodeURIComponent(cookieKey).startsWith(prefix)) {
                    removeCookie(decodeURIComponent(cookieKey));
                }
            }
        }
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
    isBrowser,
    areCookiesEnabled,
    isLocalStorageAvailable,
    serialize,
    deserialize,
    getByteLength,
};

export default CookieHelper;
