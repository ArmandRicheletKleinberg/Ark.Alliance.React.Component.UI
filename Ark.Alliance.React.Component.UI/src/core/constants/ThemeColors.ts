/**
 * Theme Color Constants
 * Single source of truth for brand colors.
 */
export const THEME_COLORS = {
    primary: {
        hex: '#00d4ff',
        rgb: [0, 212, 255] as const,
        cssVar: 'var(--ark-primary, #00d4ff)',
    },
    secondary: {
        hex: '#8b5cf6',
        rgb: [139, 92, 246] as const,
        cssVar: 'var(--ark-secondary, #8b5cf6)',
    },
    accent: {
        hex: '#f472b6',
        rgb: [244, 114, 182] as const,
        cssVar: 'var(--ark-accent, #f472b6)',
    },
    background: {
        dark: '#0f172a',
        light: '#ffffff',
        cssVar: 'var(--ark-bg, #0f172a)',
    },
    text: {
        dark: '#f3f4f6',
        light: '#111827',
        cssVar: 'var(--ark-text, #f3f4f6)',
    }
} as const;
