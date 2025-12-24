/**
 * @fileoverview Icon Registry
 * @module components/Icon/icons
 * 
 * Static registry for managing SVG icon definitions.
 * Provides methods to register, retrieve, and search icons.
 */

import type { IconDefinition } from '../Icon.model';

// ═══════════════════════════════════════════════════════════════════════════
// ICON REGISTRY CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Static registry for managing icon definitions.
 * 
 * @example
 * ```ts
 * // Register icons
 * IconRegistry.register([
 *   { name: 'arrow-up', path: 'M12 19V5M12 5l-7 7M12 5l7 7' },
 *   { name: 'arrow-down', path: 'M12 5v14M12 19l-7-7M12 19l7-7' },
 * ]);
 * 
 * // Get an icon
 * const icon = IconRegistry.get('arrow-up');
 * 
 * // Search icons
 * const results = IconRegistry.search('arrow');
 * ```
 */
export class IconRegistry {
    private static icons: Map<string, IconDefinition> = new Map();

    /**
     * Register one or more icons
     */
    public static register(icons: IconDefinition | IconDefinition[]): void {
        const iconArray = Array.isArray(icons) ? icons : [icons];
        iconArray.forEach(icon => {
            if (!icon.name) {
                console.warn('[IconRegistry] Icon registration skipped: missing name');
                return;
            }
            this.icons.set(icon.name, {
                viewBox: '0 0 24 24',
                ...icon,
            });
        });
    }

    /**
     * Get an icon by name
     */
    public static get(name: string): IconDefinition | undefined {
        return this.icons.get(name);
    }

    /**
     * Check if an icon exists
     */
    public static has(name: string): boolean {
        return this.icons.has(name);
    }

    /**
     * Get all registered icons
     */
    public static getAll(): IconDefinition[] {
        return Array.from(this.icons.values());
    }

    /**
     * Get all icon names
     */
    public static getNames(): string[] {
        return Array.from(this.icons.keys());
    }

    /**
     * Get icons by category
     */
    public static getByCategory(category: string): IconDefinition[] {
        return this.getAll().filter(icon => icon.category === category);
    }

    /**
     * Search icons by name or tags
     */
    public static search(query: string): IconDefinition[] {
        const lowerQuery = query.toLowerCase();
        return this.getAll().filter(icon => {
            const nameMatch = icon.name.toLowerCase().includes(lowerQuery);
            const tagMatch = icon.tags?.some(tag =>
                tag.toLowerCase().includes(lowerQuery)
            );
            return nameMatch || tagMatch;
        });
    }

    /**
     * Unregister an icon
     */
    public static unregister(name: string): boolean {
        return this.icons.delete(name);
    }

    /**
     * Clear all icons
     */
    public static clear(): void {
        this.icons.clear();
    }

    /**
     * Get count of registered icons
     */
    public static get count(): number {
        return this.icons.size;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT ICONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default set of commonly used icons
 * Based on Feather Icons / Lucide icon style (stroke-based, 24x24 viewBox)
 */
IconRegistry.register([
    // Navigation
    { name: 'chevron-right', path: 'M9 18l6-6-6-6', category: 'navigation' },
    { name: 'chevron-left', path: 'M15 18l-6-6 6-6', category: 'navigation' },
    { name: 'chevron-down', path: 'M6 9l6 6 6-6', category: 'navigation' },
    { name: 'chevron-up', path: 'M18 15l-6-6-6 6', category: 'navigation' },
    { name: 'arrow-right', path: 'M5 12h14M12 5l7 7-7 7', category: 'navigation' },
    { name: 'arrow-left', path: 'M19 12H5M12 19l-7-7 7-7', category: 'navigation' },
    { name: 'arrow-up', path: 'M12 19V5M5 12l7-7 7 7', category: 'navigation' },
    { name: 'arrow-down', path: 'M12 5v14M5 12l7 7 7-7', category: 'navigation' },

    // Actions
    { name: 'check', path: 'M20 6L9 17l-5-5', category: 'actions' },
    { name: 'x', path: 'M18 6L6 18M6 6l12 12', category: 'actions' },
    { name: 'plus', path: 'M12 5v14M5 12h14', category: 'actions' },
    { name: 'minus', path: 'M5 12h14', category: 'actions' },
    { name: 'edit', path: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z', category: 'actions' },
    { name: 'trash', path: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6', category: 'actions' },
    { name: 'copy', path: 'M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1', category: 'actions' },
    { name: 'search', path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', category: 'actions' },
    { name: 'refresh', path: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15', category: 'actions' },

    // Interface
    { name: 'menu', path: 'M4 6h16M4 12h16M4 18h16', category: 'interface' },
    { name: 'more-horizontal', path: 'M12 12h.01M19 12h.01M5 12h.01', category: 'interface' },
    { name: 'more-vertical', path: 'M12 12v.01M12 19v.01M12 5v.01', category: 'interface' },
    { name: 'settings', path: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-1.42 3.42 2 2 0 01-1.41-.59l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z', category: 'interface' },
    { name: 'info', path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 8h.01M11 12h1v4h1', category: 'interface' },
    { name: 'alert-circle', path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v4M12 16h.01', category: 'interface' },
    { name: 'help-circle', path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01', category: 'interface' },

    // Files
    { name: 'file', path: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7zM13 2v7h7', category: 'files' },
    { name: 'folder', path: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', category: 'files' },
    { name: 'folder-open', path: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z', category: 'files' },
    { name: 'download', path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3', category: 'files' },
    { name: 'upload', path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12', category: 'files' },

    // Media
    { name: 'play', path: 'M5 3l14 9-14 9V3z', category: 'media', filled: true },
    { name: 'pause', path: 'M6 4h4v16H6zM14 4h4v16h-4z', category: 'media' },
    { name: 'stop', path: 'M6 4h12v16H6z', category: 'media' },

    // User
    { name: 'user', path: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z', category: 'user' },
    { name: 'users', path: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', category: 'user' },

    // Communication
    { name: 'mail', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6', category: 'communication' },
    { name: 'bell', path: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0', category: 'communication' },

    // Status
    { name: 'check-circle', path: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3', category: 'status' },
    { name: 'x-circle', path: 'M12 22a10 10 0 100-20 10 10 0 000 20zM15 9l-6 6M9 9l6 6', category: 'status' },
    { name: 'loader', path: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83', category: 'status' },

    // Trading specific
    { name: 'trending-up', path: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6', category: 'trading', tags: ['chart', 'up', 'growth'] },
    { name: 'trending-down', path: 'M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6', category: 'trading', tags: ['chart', 'down', 'decline'] },
    { name: 'activity', path: 'M22 12h-4l-3 9L9 3l-3 9H2', category: 'trading', tags: ['chart', 'pulse', 'heartbeat'] },
    { name: 'bar-chart', path: 'M12 20V10M18 20V4M6 20v-4', category: 'trading', tags: ['chart', 'stats'] },
    { name: 'dollar-sign', path: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', category: 'trading', tags: ['money', 'currency'] },
]);

export default IconRegistry;
