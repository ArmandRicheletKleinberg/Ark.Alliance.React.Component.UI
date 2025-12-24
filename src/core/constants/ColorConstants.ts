/**
 * @fileoverview Color Constants
 * @module core/constants/ColorConstants
 * 
 * Reusable color palettes, variants, and glow utilities for components.
 * Theme-agnostic: components use CSS variables or accept isDark prop.
 */

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Primary variant colors with glow support
 */
export const VARIANT_COLORS = {
    primary: {
        base: '#00d4ff',
        glow: 'rgba(0, 212, 255, 0.6)',
        bgDark: 'rgba(0, 212, 255, 0.1)',
        bgLight: 'rgba(0, 212, 255, 0.08)',
    },
    secondary: {
        base: '#8b5cf6',
        glow: 'rgba(139, 92, 246, 0.6)',
        bgDark: 'rgba(139, 92, 246, 0.1)',
        bgLight: 'rgba(139, 92, 246, 0.08)',
    },
    success: {
        base: '#10b981',
        glow: 'rgba(16, 185, 129, 0.6)',
        bgDark: 'rgba(16, 185, 129, 0.1)',
        bgLight: 'rgba(16, 185, 129, 0.08)',
    },
    danger: {
        base: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.6)',
        bgDark: 'rgba(239, 68, 68, 0.1)',
        bgLight: 'rgba(239, 68, 68, 0.08)',
    },
    warning: {
        base: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.6)',
        bgDark: 'rgba(245, 158, 11, 0.1)',
        bgLight: 'rgba(245, 158, 11, 0.08)',
    },
    info: {
        base: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.6)',
        bgDark: 'rgba(59, 130, 246, 0.1)',
        bgLight: 'rgba(59, 130, 246, 0.08)',
    },
    ghost: {
        base: '#9ca3af',
        glow: 'rgba(156, 163, 175, 0.3)',
        bgDark: 'rgba(156, 163, 175, 0.05)',
        bgLight: 'rgba(156, 163, 175, 0.03)',
    },
} as const;

export type VariantType = keyof typeof VARIANT_COLORS;

// ═══════════════════════════════════════════════════════════════════════════
// GAUGE COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gauge and chart color gradients
 */
export const GAUGE_COLORS = {
    blue: { start: '#3b82f6', end: '#60a5fa', glow: 'rgba(59, 130, 246, 0.5)' },
    green: { start: '#10b981', end: '#34d399', glow: 'rgba(16, 185, 129, 0.5)' },
    red: { start: '#ef4444', end: '#f87171', glow: 'rgba(239, 68, 68, 0.5)' },
    cyan: { start: '#06b6d4', end: '#22d3ee', glow: 'rgba(34, 211, 238, 0.5)' },
    yellow: { start: '#f59e0b', end: '#fbbf24', glow: 'rgba(245, 158, 11, 0.5)' },
    purple: { start: '#8b5cf6', end: '#a78bfa', glow: 'rgba(139, 92, 246, 0.5)' },
} as const;

export type GaugeColorType = keyof typeof GAUGE_COLORS;

// ═══════════════════════════════════════════════════════════════════════════
// STATUS COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Status indicator colors
 */
export const STATUS_COLORS = {
    running: {
        label: 'Running',
        bg: 'rgba(34, 197, 94, 0.15)',
        text: '#4ade80',
        border: 'rgba(34, 197, 94, 0.4)',
    },
    stopped: {
        label: 'Stopped',
        bg: 'rgba(156, 163, 175, 0.15)',
        text: '#9ca3af',
        border: 'rgba(156, 163, 175, 0.4)',
    },
    error: {
        label: 'Error',
        bg: 'rgba(239, 68, 68, 0.15)',
        text: '#f87171',
        border: 'rgba(239, 68, 68, 0.4)',
    },
    pending: {
        label: 'Pending',
        bg: 'rgba(251, 191, 36, 0.15)',
        text: '#fbbf24',
        border: 'rgba(251, 191, 36, 0.4)',
    },
    paused: {
        label: 'Paused',
        bg: 'rgba(59, 130, 246, 0.15)',
        text: '#60a5fa',
        border: 'rgba(59, 130, 246, 0.4)',
    },
    idle: {
        label: 'Idle',
        bg: 'rgba(107, 114, 128, 0.15)',
        text: '#6b7280',
        border: 'rgba(107, 114, 128, 0.4)',
    },
} as const;

export type StatusType = keyof typeof STATUS_COLORS;

// ═══════════════════════════════════════════════════════════════════════════
// CARD STATUS COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Card status with theme-aware border and glow
 */
export const CARD_STATUS_COLORS = {
    idle: {
        borderDark: 'border-gray-800',
        borderLight: 'border-gray-200',
        glowDark: 'rgba(59, 130, 246, 0.15)',
        glowLight: 'rgba(59, 130, 246, 0.1)',
    },
    success: {
        borderDark: 'border-green-500/30',
        borderLight: 'border-green-300',
        glowDark: 'rgba(34, 197, 94, 0.15)',
        glowLight: 'rgba(34, 197, 94, 0.1)',
    },
    warning: {
        borderDark: 'border-yellow-500/30',
        borderLight: 'border-yellow-300',
        glowDark: 'rgba(234, 179, 8, 0.15)',
        glowLight: 'rgba(234, 179, 8, 0.1)',
    },
    error: {
        borderDark: 'border-red-500/30',
        borderLight: 'border-red-300',
        glowDark: 'rgba(239, 68, 68, 0.15)',
        glowLight: 'rgba(239, 68, 68, 0.1)',
    },
    info: {
        borderDark: 'border-blue-500/30',
        borderLight: 'border-blue-300',
        glowDark: 'rgba(59, 130, 246, 0.20)',
        glowLight: 'rgba(59, 130, 246, 0.15)',
    },
} as const;

export type CardStatusColorType = keyof typeof CARD_STATUS_COLORS;

// ═══════════════════════════════════════════════════════════════════════════
// SIZE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Common size values
 */
export const SIZE_CLASSES = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
} as const;

export type SizeType = keyof typeof SIZE_CLASSES;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get variant color configuration
 */
export function getVariantColor(variant: VariantType, isDark = true) {
    const colors = VARIANT_COLORS[variant];
    return {
        color: colors.base,
        glow: colors.glow,
        bg: isDark ? colors.bgDark : colors.bgLight,
    };
}

/**
 * Get gauge color configuration
 */
export function getGaugeColor(color: GaugeColorType) {
    return GAUGE_COLORS[color];
}

/**
 * Get status color configuration
 */
export function getStatusColor(status: StatusType) {
    return STATUS_COLORS[status];
}

/**
 * Get card status color configuration
 */
export function getCardStatusColor(status: CardStatusColorType, isDark = true) {
    const colors = CARD_STATUS_COLORS[status];
    return {
        border: isDark ? colors.borderDark : colors.borderLight,
        glow: isDark ? colors.glowDark : colors.glowLight,
    };
}

export default {
    VARIANT_COLORS,
    GAUGE_COLORS,
    STATUS_COLORS,
    CARD_STATUS_COLORS,
    SIZE_CLASSES,
    getVariantColor,
    getGaugeColor,
    getStatusColor,
    getCardStatusColor,
};
