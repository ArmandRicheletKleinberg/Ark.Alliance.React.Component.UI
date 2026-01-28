/**
 * @fileoverview Date and Time Formatters
 * @module core/formatters/date
 * 
 * Utilities for formatting dates and times with locale support.
 * Uses Intl.DateTimeFormat and Intl.RelativeTimeFormat.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

import type { DateFormatOptions } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// DATE FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format date with locale-specific style
 * 
 * @param value - Date to format (Date object, ISO string, or timestamp)
 * @param options - Formatting options
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate(new Date('2026-01-27'))
 * // => "Jan 27, 2026" (en-US, medium)
 * 
 * formatDate('2026-01-27', { dateStyle: 'short' })
 * // => "1/27/26"
 * 
 * formatDate('2026-01-27', { dateStyle: 'full', locale: 'fr-FR' })
 * // => "lundi 27 janvier 2026"
 * 
 * formatDate(new Date(), { format: 'datetime', timeStyle: 'short' })
 * // => "Jan 27, 2026, 1:30 PM"
 * 
 * formatDate(new Date(), { format: 'relative' })
 * // => "2 hours ago" or "in 3 days"
 * ```
 */
export function formatDate(
    value: Date | string | number | null | undefined,
    options: DateFormatOptions = {}
): string {
    if (value === null || value === undefined) return '—';

    // Convert to Date object
    const date = typeof value === 'string' || typeof value === 'number'
        ? new Date(value)
        : value;

    // Validate date
    if (isNaN(date.getTime())) return 'Invalid Date';

    const {
        locale = 'en-US',
        dateStyle = 'medium',
        timeStyle,
        timeZone,
        format = 'date',
    } = options;

    // Handle relative time formatting
    if (format === 'relative') {
        return formatRelativeTime(date, locale);
    }

    // Build format options
    const formatOptions: Intl.DateTimeFormatOptions = {};

    if (timeZone) {
        formatOptions.timeZone = timeZone;
    }

    if (format === 'datetime' || format === 'time') {
        formatOptions.timeStyle = timeStyle || 'short';
    }

    if (format === 'datetime' || format === 'date') {
        formatOptions.dateStyle = dateStyle;
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATIVE TIME FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format date as relative time (e.g., "2 hours ago", "in 3 days")
 * 
 * @param date - Date to format relative to now
 * @param locale - Locale identifier
 * @returns Relative time string
 * 
 * @example
 * ```typescript
 * const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
 * formatRelativeTime(twoHoursAgo)
 * // => "2 hours ago"
 * 
 * const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
 * formatRelativeTime(inThreeDays)
 * // => "in 3 days"
 * ```
 */
export function formatRelativeTime(date: Date, locale: string = 'en-US'): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    // Calculate differences
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);
    const diffWeek = Math.round(diffDay / 7);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    // Choose appropriate unit
    if (Math.abs(diffYear) > 0) return rtf.format(diffYear, 'year');
    if (Math.abs(diffMonth) > 0) return rtf.format(diffMonth, 'month');
    if (Math.abs(diffWeek) > 0) return rtf.format(diffWeek, 'week');
    if (Math.abs(diffDay) > 0) return rtf.format(diffDay, 'day');
    if (Math.abs(diffHr) > 0) return rtf.format(diffHr, 'hour');
    if (Math.abs(diffMin) > 0) return rtf.format(diffMin, 'minute');
    return rtf.format(diffSec, 'second');
}

// ═══════════════════════════════════════════════════════════════════════════
// TIME FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format time only (no date)
 * 
 * @param value - Date/time to format
 * @param options - Formatting options
 * @returns Formatted time string
 * 
 * @example
 * ```typescript
 * formatTime(new Date('2026-01-27T14:30:00'))
 * // => "2:30 PM" (en-US, short)
 * 
 * formatTime(new Date(), { timeStyle: 'medium', locale: 'fr-FR' })
 * // => "14:30:45"
 * ```
 */
export function formatTime(
    value: Date | string | number | null | undefined,
    options: Omit<DateFormatOptions, 'format'> = {}
): string {
    return formatDate(value, { ...options, format: 'time' });
}

// ═══════════════════════════════════════════════════════════════════════════
// DATETIME FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format both date and time
 * 
 * @param value - Date/time to format
 * @param options - Formatting options
 * @returns Formatted datetime string
 * 
 * @example
 * ```typescript
 * formatDateTime(new Date('2026-01-27T14:30:00'))
 * // => "Jan 27, 2026, 2:30 PM"
 * 
 * formatDateTime(new Date(), { dateStyle: 'full', timeStyle: 'long' })
 * // => "Monday, January 27, 2026 at 2:30:45 PM EST"
 * ```
 */
export function formatDateTime(
    value: Date | string | number | null | undefined,
    options: Omit<DateFormatOptions, 'format'> = {}
): string {
    return formatDate(value, { ...options, format: 'datetime' });
}
