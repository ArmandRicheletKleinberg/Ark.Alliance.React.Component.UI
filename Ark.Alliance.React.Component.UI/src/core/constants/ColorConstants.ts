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

import { THEME_COLORS } from './ThemeColors';
import { SEMANTIC_COLORS } from './SemanticColors';

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Primary variant colors with glow support
 */
export const VARIANT_COLORS = {
    primary: {
        base: THEME_COLORS.primary.hex,
        glow: `rgba(${THEME_COLORS.primary.rgb.join(', ')}, 0.6)`,
        bgDark: `rgba(${THEME_COLORS.primary.rgb.join(', ')}, 0.1)`,
        bgLight: `rgba(${THEME_COLORS.primary.rgb.join(', ')}, 0.08)`,
        cssVar: THEME_COLORS.primary.cssVar,
    },
    secondary: {
        base: THEME_COLORS.secondary.hex,
        glow: `rgba(${THEME_COLORS.secondary.rgb.join(', ')}, 0.6)`,
        bgDark: `rgba(${THEME_COLORS.secondary.rgb.join(', ')}, 0.1)`,
        bgLight: `rgba(${THEME_COLORS.secondary.rgb.join(', ')}, 0.08)`,
        cssVar: THEME_COLORS.secondary.cssVar,
    },
    success: {
        base: SEMANTIC_COLORS.success.hex,
        glow: `rgba(${SEMANTIC_COLORS.success.rgb.join(', ')}, 0.6)`,
        bgDark: `rgba(${SEMANTIC_COLORS.success.rgb.join(', ')}, 0.1)`,
        bgLight: `rgba(${SEMANTIC_COLORS.success.rgb.join(', ')}, 0.08)`,
        cssVar: SEMANTIC_COLORS.success.cssVar,
    },
    danger: {
        base: SEMANTIC_COLORS.error.hex,
        glow: `rgba(${SEMANTIC_COLORS.error.rgb.join(', ')}, 0.6)`,
        bgDark: `rgba(${SEMANTIC_COLORS.error.rgb.join(', ')}, 0.1)`,
        bgLight: `rgba(${SEMANTIC_COLORS.error.rgb.join(', ')}, 0.08)`,
        cssVar: SEMANTIC_COLORS.error.cssVar,
    },
    warning: {
        base: SEMANTIC_COLORS.warning.hex,
        glow: `rgba(${SEMANTIC_COLORS.warning.rgb.join(', ')}, 0.6)`,
        bgDark: `rgba(${SEMANTIC_COLORS.warning.rgb.join(', ')}, 0.1)`,
        bgLight: `rgba(${SEMANTIC_COLORS.warning.rgb.join(', ')}, 0.08)`,
        cssVar: SEMANTIC_COLORS.warning.cssVar,
    },
    info: {
        base: SEMANTIC_COLORS.info.hex,
        glow: `rgba(${SEMANTIC_COLORS.info.rgb.join(', ')}, 0.6)`,
        bgDark: `rgba(${SEMANTIC_COLORS.info.rgb.join(', ')}, 0.1)`,
        bgLight: `rgba(${SEMANTIC_COLORS.info.rgb.join(', ')}, 0.08)`,
        cssVar: SEMANTIC_COLORS.info.cssVar,
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
    blue: {
        start: 'var(--ark-gauge-blue-start, #3b82f6)',
        end: 'var(--ark-gauge-blue-end, #60a5fa)',
        glow: 'var(--ark-gauge-blue-glow, rgba(59, 130, 246, 0.5))'
    },
    green: {
        start: 'var(--ark-gauge-green-start, #10b981)',
        end: 'var(--ark-gauge-green-end, #34d399)',
        glow: 'var(--ark-gauge-green-glow, rgba(16, 185, 129, 0.5))'
    },
    red: {
        start: 'var(--ark-gauge-red-start, #ef4444)',
        end: 'var(--ark-gauge-red-end, #f87171)',
        glow: 'var(--ark-gauge-red-glow, rgba(239, 68, 68, 0.5))'
    },
    cyan: {
        start: 'var(--ark-gauge-cyan-start, #06b6d4)',
        end: 'var(--ark-gauge-cyan-end, #22d3ee)',
        glow: 'var(--ark-gauge-cyan-glow, rgba(34, 211, 238, 0.5))'
    },
    yellow: {
        start: 'var(--ark-gauge-yellow-start, #f59e0b)',
        end: 'var(--ark-gauge-yellow-end, #fbbf24)',
        glow: 'var(--ark-gauge-yellow-glow, rgba(245, 158, 11, 0.5))'
    },
    purple: {
        start: 'var(--ark-gauge-purple-start, #8b5cf6)',
        end: 'var(--ark-gauge-purple-end, #a78bfa)',
        glow: 'var(--ark-gauge-purple-glow, rgba(139, 92, 246, 0.5))'
    },
} as const;

export type GaugeColorType = keyof typeof GAUGE_COLORS;

// ═══════════════════════════════════════════════════════════════════════════
// STATUS COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detailed status indicator colors with label, background, text, and border
 * Includes both system statuses and priority indicators
 *
 * NOTE: For simple color mappings, use STATUS_COLORS from core/enums/Status
 */
export const DETAILED_STATUS_COLORS = {
    // System statuses
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
    // Priority indicators (for feature toggles)
    success: {
        label: 'Success',
        bg: 'rgba(16, 185, 129, 0.15)',
        text: '#10b981',
        border: 'rgba(16, 185, 129, 0.4)',
    },
    warning: {
        label: 'Warning',
        bg: 'rgba(245, 158, 11, 0.15)',
        text: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.4)',
    },
    danger: {
        label: 'Danger',
        bg: 'rgba(239, 68, 68, 0.15)',
        text: '#ef4444',
        border: 'rgba(239, 68, 68, 0.4)',
    },
    info: {
        label: 'Info',
        bg: 'rgba(59, 130, 246, 0.15)',
        text: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.4)',
    },
    neutral: {
        label: 'Neutral',
        bg: 'rgba(107, 114, 128, 0.15)',
        text: '#9ca3af',
        border: 'rgba(107, 114, 128, 0.4)',
    },
    // Extended statuses
    active: {
        label: 'Active',
        bg: 'rgba(59, 130, 246, 0.15)',
        text: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.4)',
    },
    completed: {
        label: 'Completed',
        bg: 'rgba(16, 185, 129, 0.15)',
        text: '#10b981',
        border: 'rgba(16, 185, 129, 0.4)',
    },
    maintenance: {
        label: 'Maintenance',
        bg: 'rgba(168, 85, 247, 0.15)',
        text: '#a855f7',
        border: 'rgba(168, 85, 247, 0.4)',
    },
} as const;

export type DetailedStatusType = keyof typeof DETAILED_STATUS_COLORS;

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
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
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
 * Get detailed status color configuration
 */
export function getStatusColor(status: DetailedStatusType) {
    return DETAILED_STATUS_COLORS[status];
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
    DETAILED_STATUS_COLORS,
    CARD_STATUS_COLORS,
    SIZE_CLASSES,
    getVariantColor,
    getGaugeColor,
    getStatusColor,
    getCardStatusColor,
};
