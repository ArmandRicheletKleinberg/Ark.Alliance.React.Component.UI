/**
 * @fileoverview Chart3D Constants
 * @module components/Chart3D
 */

// ═══════════════════════════════════════════════════════════════════════════
// GRID CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const GRID_SIZE_X = 20;
export const GRID_SIZE_Z = 10;
export const MAX_HEIGHT = 20;

// ═══════════════════════════════════════════════════════════════════════════
// THEME COLORS
// ═══════════════════════════════════════════════════════════════════════════

export const THEME_COLORS = {
    grid: '#1e293b',
    secondary: '#3b82f6',
    text: '#94a3b8',
    bg: '#02040a',
};

// ═══════════════════════════════════════════════════════════════════════════
// COLOR GRADIENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get height-based color gradient
 * Low = blue/cyan, Mid = cyan/green, High = yellow/red
 */
export function getHeightColor(value: number, maxHeight: number): string {
    const ratio = value / maxHeight;

    if (ratio < 0.2) return '#38bdf8'; // sky blue
    if (ratio < 0.4) return '#22d3ee'; // cyan
    if (ratio < 0.6) return '#34d399'; // emerald
    if (ratio < 0.75) return '#fde047'; // yellow
    if (ratio < 0.9) return '#fb923c'; // orange
    return '#f43f5e'; // rose/red
}

// ═══════════════════════════════════════════════════════════════════════════
// FONT URLS
// ═══════════════════════════════════════════════════════════════════════════

export const FONT_URLS: Record<string, string> = {
    'Inter': '/fonts/Inter-Regular.woff',
    'JetBrains Mono': '/fonts/JetBrainsMono-Regular.woff',
    'Roboto': '/fonts/Roboto-Regular.woff',
    'Poppins': '/fonts/Poppins-Regular.woff',
};

// ═══════════════════════════════════════════════════════════════════════════
// SHAPE ICONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Emoji icons for shapes (legacy, for fallback)
 * @deprecated Use SHAPE_FA_ICONS instead
 */
export const SHAPE_ICONS = {
    'Cuboid': '📦',
    'Cylinder': '🔩',
    'Bubble': '🔮',
    'Candle': '📊',
    'Lines Only': '📈',
    'Surface': '🌊',
};

/**
 * FontAwesome icon names for shape types.
 * Used with FAIcon component for consistent library styling.
 */
export const SHAPE_FA_ICONS = {
    'Cuboid': 'cube',
    'Cylinder': 'database',
    'Bubble': 'circle',
    'Candle': 'chart-bar',
    'Lines Only': 'chart-line',
    'Surface': 'water',
} as const;

/**
 * Shape type short labels for UI display.
 */
export const SHAPE_LABELS = {
    'Cuboid': 'Box',
    'Cylinder': 'Cyl',
    'Bubble': 'Bub',
    'Candle': 'Cdl',
    'Lines Only': 'Lines',
    'Surface': 'Surf',
} as const;

