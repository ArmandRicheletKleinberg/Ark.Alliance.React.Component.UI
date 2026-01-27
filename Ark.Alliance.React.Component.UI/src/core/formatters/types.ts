/**
 * @fileoverview Formatter Type Definitions
 * @module core/formatters/types
 * 
 * TypeScript interfaces and types for formatting utilities.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

import type { ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// LOCALE OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base locale options for formatters
 */
export interface LocaleOptions {
    /** Locale identifier (e.g., 'en-US', 'fr-FR', 'de-DE') */
    locale?: string;
    /** Currency code (ISO 4217, e.g., 'USD', 'EUR', 'JPY') */
    currency?: string;
    /** IANA time zone identifier */
    timeZone?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Number formatter options
 */
export interface NumberFormatOptions extends LocaleOptions {
    /** Minimum number of fraction digits */
    minimumFractionDigits?: number;
    /** Maximum number of fraction digits */
    maximumFractionDigits?: number;
    /** Use grouping separators (e.g., commas) */
    useGrouping?: boolean;
}

/**
 * Currency formatter options
 */
export interface CurrencyFormatOptions extends LocaleOptions {
    /** How to display the currency: symbol ($), code (USD), or name (US Dollar) */
    currencyDisplay?: 'symbol' | 'code' | 'name';
    /** Minimum fraction digits (default: 2 for most currencies) */
    minimumFractionDigits?: number;
    /** Maximum fraction digits (default: 2 for most currencies) */
    maximumFractionDigits?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// DATE FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Date formatter options
 */
export interface DateFormatOptions extends LocaleOptions {
    /** Date formatting style */
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    /** Time formatting style */
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    /** What to format: date only, time only, both, or relative */
    format?: 'date' | 'time' | 'datetime' | 'relative';
}

// ═══════════════════════════════════════════════════════════════════════════
// COLUMN FORMATTER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Column formatter function type for DataGrid
 * 
 * @template T The value type to format
 * @param value The value to format
 * @param row Optional full row data for context-aware formatting
 * @returns Formatted string or React node
 * 
 * @example
 * ```typescript
 * const priceFormatter: ColumnFormatter<number> = (value) => {
 *   return formatCurrency(value, { currency: 'USD' });
 * };
 * ```
 */
export type ColumnFormatter<T = unknown> = (
    value: T,
    row?: Record<string, unknown>
) => string | ReactNode;

// ═══════════════════════════════════════════════════════════════════════════
// FORMATTER RESULT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result type for useFormatter hook
 */
export interface FormatterResult {
    /** Format number with locale-specific separators */
    number: (value: number | null | undefined, options?: NumberFormatOptions) => string;

    /** Format currency with symbol */
    currency: (value: number | null | undefined, options?: CurrencyFormatOptions) => string;

    /** Format as compact notation (1.2K, 3.4M) */
    compact: (value: number | null | undefined, options?: NumberFormatOptions) => string;

    /** Format date/time */
    date: (value: Date | string | number | null | undefined, options?: DateFormatOptions) => string;

    /** Format bytes as human-readable size */
    bytes: (value: number | null | undefined, decimals?: number) => string;

    /** Format as percentage */
    percentage: (value: number | null | undefined, options?: NumberFormatOptions) => string;
}
