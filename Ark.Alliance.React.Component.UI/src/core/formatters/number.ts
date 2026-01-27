/**
 * @fileoverview Number and Currency Formatters
 * @module core/formatters/number
 * 
 * Utilities for formatting numbers and currencies with locale support.
 * Uses Intl.NumberFormat for standards-compliant formatting.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

import type { NumberFormatOptions, CurrencyFormatOptions } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format number with locale-specific separators and precision
 * 
 * @param value - Number to format (null/undefined returns '—')
 * @param options - Formatting options
 * @returns Formatted number string
 * 
 * @example
 * ```typescript
 * formatNumber(1234.56)
 * // => "1,234.56" (en-US)
 * 
 * formatNumber(1234.56, { locale: 'de-DE' })
 * // => "1.234,56" (German formatting)
 * 
 * formatNumber(1234.56, { maximumFractionDigits: 0 })
 * // => "1,235"
 * 
 * formatNumber(1234.56, { useGrouping: false })
 * // => "1234.56"
 * ```
 */
export function formatNumber(
    value: number | null | undefined,
    options: NumberFormatOptions = {}
): string {
    if (value === null || value === undefined) return '—';
    if (isNaN(value)) return 'NaN';

    const {
        locale = 'en-US',
        minimumFractionDigits = 0,
        maximumFractionDigits = 2,
        useGrouping = true,
    } = options;

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping,
    }).format(value);
}

// ═══════════════════════════════════════════════════════════════════════════
// CURRENCY FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format currency with symbol and locale-specific formatting
 * 
 * @param value - Amount to format (null/undefined returns '—')
 * @param options - Currency formatting options
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56)
 * // => "$1,234.56"
 * 
 * formatCurrency(1234.56, { currency: 'EUR', locale: 'fr-FR' })
 * // => "1 234,56 €"
 * 
 * formatCurrency(1234.56, { currency: 'JPY' })
 * // => "¥1,235" (JPY has 0 decimal places by default)
 * 
 * formatCurrency(1234.56, { currencyDisplay: 'code' })
 * // => "USD 1,234.56"
 * ```
 */
export function formatCurrency(
    value: number | null | undefined,
    options: CurrencyFormatOptions = {}
): string {
    if (value === null || value === undefined) return '—';
    if (isNaN(value)) return 'NaN';

    const {
        locale = 'en-US',
        currency = 'USD',
        currencyDisplay = 'symbol',
        minimumFractionDigits,
        maximumFractionDigits,
    } = options;

    // Let Intl.NumberFormat handle currency-specific defaults
    const formatOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        currencyDisplay,
    };

    // Only set fraction digits if explicitly provided
    if (minimumFractionDigits !== undefined) {
        formatOptions.minimumFractionDigits = minimumFractionDigits;
    }
    if (maximumFractionDigits !== undefined) {
        formatOptions.maximumFractionDigits = maximumFractionDigits;
    }

    return new Intl.NumberFormat(locale, formatOptions).format(value);
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT NOTATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format number using compact notation (K, M, B, T)
 * 
 * @param value - Number to format (null/undefined returns '—')
 * @param options - Formatting options
 * @returns Compactly formatted number
 * 
 * @example
 * ```typescript
 * formatCompact(1234)
 * // => "1.2K"
 * 
 * formatCompact(1234567)
 * // => "1.2M"
 * 
 * formatCompact(1234567890)
 * // => "1.2B"
 * 
 * formatCompact(999)
 * // => "999" (no compacting below 1000)
 * ```
 */
export function formatCompact(
    value: number | null | undefined,
    options: NumberFormatOptions = {}
): string {
    if (value === null || value === undefined) return '—';
    if (isNaN(value)) return 'NaN';

    const { locale = 'en-US' } = options;

    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
    }).format(value);
}

// ═══════════════════════════════════════════════════════════════════════════
// DECIMAL FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format number as decimal with fixed precision
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted decimal string
 * 
 * @example
 * ```typescript
 * formatDecimal(1.2345, 2)
 * // => "1.23"
 * 
 * formatDecimal(1.2, 4)
 * // => "1.2000"
 * ```
 */
export function formatDecimal(
    value: number | null | undefined,
    decimals: number = 2
): string {
    if (value === null || value === undefined) return '—';
    if (isNaN(value)) return 'NaN';

    return value.toFixed(decimals);
}
