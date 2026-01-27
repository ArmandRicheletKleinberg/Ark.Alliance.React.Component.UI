/**
 * Semantic Color Constants
 * Single source of truth for success, warning, error, info colors.
 */
export const SEMANTIC_COLORS = {
    success: {
        hex: '#10b981',
        rgb: [16, 185, 129] as const,
        cssVar: 'var(--ark-success, #10b981)',
    },
    warning: {
        hex: '#f59e0b',
        rgb: [245, 158, 11] as const,
        cssVar: 'var(--ark-warning, #f59e0b)',
    },
    error: {
        hex: '#ef4444',
        rgb: [239, 68, 68] as const,
        cssVar: 'var(--ark-error, #ef4444)',
    },
    info: {
        hex: '#3b82f6',
        rgb: [59, 130, 246] as const,
        cssVar: 'var(--ark-info, #3b82f6)',
    },
} as const;
