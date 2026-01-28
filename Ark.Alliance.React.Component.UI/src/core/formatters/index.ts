/**
 * @fileoverview Formatters Module Barrel Export
 * @module core/formatters
 * 
 * Central export point for all formatting utilities.
 * Provides number, currency, date, byte, percentage, and string formatters.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 * 
 * @example
 * ```typescript
 * import { formatCurrency, formatDate, useFormatter } from '@core/formatters';
 * 
 * // Direct usage
 * const price = formatCurrency(1234.56); // "$1,234.56"
 * const date = formatDate(new Date(), { dateStyle: 'medium' }); // "Jan 27, 2026"
 * 
 * // Hook usage in React components
 * function MyComponent() {
 *   const { currency, date } = useFormatter({ locale: 'en-US', currency: 'USD' });
 *   return <div>{currency(product.price)}</div>;
 * }
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type {
    LocaleOptions,
    NumberFormatOptions,
    CurrencyFormatOptions,
    DateFormatOptions,
    ColumnFormatter,
    FormatterResult,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

export {
    formatNumber,
    formatCurrency,
    formatCompact,
    formatDecimal,
} from './number';

// ═══════════════════════════════════════════════════════════════════════════
// DATE FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

export {
    formatDate,
    formatRelativeTime,
    formatTime,
    formatDateTime,
} from './date';

// ═══════════════════════════════════════════════════════════════════════════
// BYTE FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

export {
    formatBytes,
    formatBytesSI,
} from './bytes';

// ═══════════════════════════════════════════════════════════════════════════
// PERCENTAGE FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

export {
    formatPercentage,
    formatPercentageRaw,
} from './percentage';

// ═══════════════════════════════════════════════════════════════════════════
// STRING FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

export {
    truncate,
    capitalize,
    toTitleCase,
} from './string';

// ═══════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ═══════════════════════════════════════════════════════════════════════════

export { useFormatter } from './useFormatter';
