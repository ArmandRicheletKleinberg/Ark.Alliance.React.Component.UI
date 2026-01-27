/**
 * @fileoverview String Manipulation Formatters
 * @module core/formatters/string
 * 
 * Utilities for string formatting and manipulation.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

// ═══════════════════════════════════════════════════════════════════════════
// STRING FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Truncate string to specified length with ellipsis
 * 
 * @param value - String to truncate
 * @param maxLength - Maximum length including ellipsis
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated string
 * 
 * @example
 * ```typescript
 * truncate('Hello World', 8)
 * // => "Hello..."
 * 
 * truncate('Short', 10)
 * // => "Short"
 * 
 * truncate('Hello World', 8, '…')
 * // => "Hello W…"
 * ```
 */
export function truncate(
    value: string | null | undefined,
    maxLength: number,
    ellipsis: string = '...'
): string {
    if (value === null || value === undefined) return '—';
    if (value.length <= maxLength) return value;

    return value.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Capitalize first letter of string
 * 
 * @param value - String to capitalize
 * @returns Capitalized string
 * 
 * @example
 * ```typescript
 * capitalize('hello world')
 * // => "Hello world"
 * ```
 */
export function capitalize(value: string | null | undefined): string {
    if (value === null || value === undefined) return '—';
    if (value.length === 0) return value;

    return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Convert camelCase or snake_case to Title Case
 * 
 * @param value - String to convert
 * @returns Title cased string
 * 
 * @example
 * ```typescript
 * toTitleCase('helloWorld')
 * // => "Hello World"
 * 
 * toTitleCase('hello_world')
 * // => "Hello World"
 * ```
 */
export function toTitleCase(value: string | null | undefined): string {
    if (value === null || value === undefined) return '—';

    return value
        .replace(/([A-Z])/g, ' $1') // Add space before capitals
        .replace(/_/g, ' ') // Replace underscores
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
