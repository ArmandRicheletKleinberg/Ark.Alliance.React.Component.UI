/**
 * @fileoverview Byte Size Formatter
 * @module core/formatters/bytes
 * 
 * Utilities for formatting byte sizes as human-readable strings.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

// ═══════════════════════════════════════════════════════════════════════════
// BYTE FORMATTING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format bytes as human-readable file size
 * 
 * @param bytes - Number of bytes (null/undefined returns '—')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted byte string with unit
 * 
 * @example
 * ```typescript
 * formatBytes(0)
 * // => "0 Bytes"
 * 
 * formatBytes(1024)
 * // => "1 KB"
 * 
 * formatBytes(1536)
 * // => "1.5 KB"
 * 
 * formatBytes(1048576)
 * // => "1 MB"
 * 
 * formatBytes(1234567890)
 * // => "1.15 GB"
 * 
 * formatBytes(1234567890, 0)
 * // => "1 GB"
 * ```
 */
export function formatBytes(
    bytes: number | null | undefined,
    decimals: number = 2
): string {
    if (bytes === null || bytes === undefined) return '—';
    if (isNaN(bytes)) return 'NaN';
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    const size = sizes[Math.min(i, sizes.length - 1)];

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${size}`;
}

/**
 * Format bytes using SI units (powers of 1000)
 * 
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted byte string with SI unit
 * 
 * @example
 * ```typescript
 * formatBytesSI(1000)
 * // => "1 kB"
 * 
 * formatBytesSI(1000000)
 * // => "1 MB"
 * ```
 */
export function formatBytesSI(
    bytes: number | null | undefined,
    decimals: number = 2
): string {
    if (bytes === null || bytes === undefined) return '—';
    if (isNaN(bytes)) return 'NaN';
    if (bytes === 0) return '0 Bytes';

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    const size = sizes[Math.min(i, sizes.length - 1)];

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${size}`;
}
