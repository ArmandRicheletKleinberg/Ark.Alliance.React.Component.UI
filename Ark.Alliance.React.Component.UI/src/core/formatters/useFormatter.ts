/**
 * @fileoverview Formatter React Hook
 * @module core/formatters/useFormatter
 * 
 * React hook for getting formatter functions with consistent locale settings.
 * Optimized with useMemo to prevent recreating formatter functions on every render.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

import { useMemo } from 'react';
import { formatNumber, formatCurrency, formatCompact } from './number';
import { formatDate } from './date';
import { formatBytes } from './bytes';
import { formatPercentage } from './percentage';
import type { LocaleOptions, FormatterResult } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for getting formatter functions with consistent locale settings
 * 
 * Returns memoized formatter functions that use the provided locale options.
 * All formatters preserve locale context while allowing per-call overrides.
 * 
 * @param options - Default locale options for all formatters
 * @returns Object with formatter functions
 * 
 * @example
 * ```typescript
 * // US English with USD currency
 * const { number, currency, date } = useFormatter({
 *   locale: 'en-US',
 *   currency: 'USD'
 * });
 * 
 * const price = currency(99.99); // "$99.99"
 * const count = number(1234.56); // "1,234.56"
 * const when = date(new Date(), { dateStyle: 'medium' }); // "Jan 27, 2026"
 * ```
 * 
 * @example
 * ```typescript
 * // French locale with Euro currency
 * const { currency, number } = useFormatter({
 *   locale: 'fr-FR',
 *   currency: 'EUR'
 * });
 * 
 * const price = currency(1234.56); // "1 234,56 €"
 * const amount = number(1234.56); // "1 234,56"
 * ```
 * 
 * @example
 * ```typescript
 * // Override locale per call
 * const { currency } = useFormatter({ locale: 'en-US' });
 * 
 * const usd = currency(99.99); // "$99.99"
 * const eur = currency(99.99, { currency: 'EUR', locale: 'fr-FR' }); // "99,99 €"
 * ```
 */
export function useFormatter(options: LocaleOptions = {}): FormatterResult {
    const { locale = 'en-US', currency = 'USD', timeZone } = options;

    return useMemo(
        () => ({
            /**
             * Format number with locale-specific separators
             */
            number: (value, opts = {}) =>
                formatNumber(value, { locale, ...opts }),

            /**
             * Format currency with symbol
             */
            currency: (value, opts = {}) =>
                formatCurrency(value, { locale, currency, ...opts }),

            /**
             * Format as compact notation (1.2K, 3.4M)
             */
            compact: (value, opts = {}) =>
                formatCompact(value, { locale, ...opts }),

            /**
             * Format date/time
             */
            date: (value, opts = {}) =>
                formatDate(value, { locale, timeZone, ...opts }),

            /**
             * Format bytes as human-readable size
             */
            bytes: (value, decimals?) =>
                formatBytes(value, decimals),

            /**
             * Format as percentage
             */
            percentage: (value, opts = {}) =>
                formatPercentage(value, { locale, ...opts }),
        }),
        [locale, currency, timeZone]
    );
}
