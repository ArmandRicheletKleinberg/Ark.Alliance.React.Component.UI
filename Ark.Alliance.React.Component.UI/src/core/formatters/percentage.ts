/**
 * @fileoverview Percentage Formatter
 * @module core/formatters/percentage
 * 
 * Utilities for formatting percentages with locale support.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

import type { NumberFormatOptions } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// PERCENTAGE FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format number as percentage
 * 
 * Expects value as decimal (0.1234 = 12.34%)
 * 
 * @param value - Decimal value to format (0.5 = 50%)
 * @param options - Formatting options
 * @returns Formatted percentage string
 * 
 * @example
 * ```typescript
 * formatPercentage(0.1234)
 * // => "12.34%"
 * 
 * formatPercentage(0.5)
 * // => "50%"
 * 
 * formatPercentage(0.5, { maximumFractionDigits: 0 })
 * // => "50%"
 * 
 * formatPercentage(0.12345, { minimumFractionDigits: 3 })
 * // => "12.345%"
 * 
 * formatPercentage(0.5, { locale: 'fr-FR' })
 * // => "50 %"
 * ```
 */
export function formatPercentage(
    value: number | null | undefined,
    options: NumberFormatOptions = {}
): string {
    if (value === null || value === undefined) return '—';
    if (isNaN(value)) return 'NaN';

    const {
        locale = 'en-US',
        minimumFractionDigits = 0,
        maximumFractionDigits = 2,
    } = options;

    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);
}

/**
 * Format number with percentage sign (does not multiply by 100)
 * 
 * Use when value is already in percentage form (50 = 50%)
 * 
 * @param value - Value in percentage form (50 = 50%)
 * @param options - Formatting options
 * @returns Formatted percentage string
 * 
 * @example
 * ```typescript
 * formatPercentageRaw(50)
 * // => "50%"
 * 
 * formatPercentageRaw(12.34)
 * // => "12.34%"
 * ```
 */
export function formatPercentageRaw(
    value: number | null | undefined,
    options: Omit<NumberFormatOptions, 'locale'> = {}
): string {
    if (value === null || value === undefined) return '—';
    if (isNaN(value)) return 'NaN';

    const {
        minimumFractionDigits = 0,
        maximumFractionDigits = 2,
    } = options;

    return `${value.toFixed(maximumFractionDigits)}%`;
}
