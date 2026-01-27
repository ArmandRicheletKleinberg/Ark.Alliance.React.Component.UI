/**
 * @fileoverview Universal Icon Registry
 * @module components/Icon/UniversalRegistry
 * 
 * Unified registry that aggregates both internal SVG icons (IconRegistry)
 * and Font Awesome icons (FAIconCatalog).
 * Provides a single interface for searching and listing all available icons.
 */

import { IconRegistry } from './icons/IconRegistry';
import {
    FA_ICON_CATALOG,
    searchFAIcons,
    getFAIconsByCategory,
    getFAIconsByStyle
} from './icons/FAIconCatalog';
import type { IconDefinition } from './Base/Icon/Icon.model';
import type { FAIconMeta } from './icons/FAIconCatalog';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type UniversalIconDefinition =
    | { source: 'svg'; def: IconDefinition }
    | { source: 'font-awesome'; def: FAIconMeta };

// ═══════════════════════════════════════════════════════════════════════════
// UNIVERSAL REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

export class UniversalRegistry {
    /**
     * Search all icons (SVG and Font Awesome)
     */
    public static search(query: string): UniversalIconDefinition[] {
        const svgResults = IconRegistry.search(query).map(def => ({
            source: 'svg' as const,
            def
        }));

        const faResults = searchFAIcons(query).map(def => ({
            source: 'font-awesome' as const,
            def
        }));

        return [...svgResults, ...faResults];
    }

    /**
     * Get all categories from both sources
     */
    public static getCategories(): string[] {
        const svgCategories = new Set(IconRegistry.getAll().map(i => i.category || 'uncategorized'));
        const faCategories = new Set(FA_ICON_CATALOG.map(i => i.category));

        return Array.from(new Set([...svgCategories, ...faCategories])).sort();
    }

    /**
     * Get all icons by category
     */
    public static getByCategory(category: string): UniversalIconDefinition[] {
        const svgIcons = IconRegistry.getByCategory(category).map(def => ({
            source: 'svg' as const,
            def
        }));

        const faIcons = getFAIconsByCategory(category).map(def => ({
            source: 'font-awesome' as const,
            def
        }));

        return [...svgIcons, ...faIcons];
    }

    /**
     * Check if an icon exists in either registry
     */
    public static has(name: string): boolean {
        if (IconRegistry.has(name)) return true;
        return FA_ICON_CATALOG.some(icon => icon.name === name);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PROXY METHODS (Direct access to underlying registries)
    // ═══════════════════════════════════════════════════════════════════════

    public static get svg() {
        return IconRegistry;
    }

    public static get fa() {
        return {
            catalog: FA_ICON_CATALOG,
            search: searchFAIcons,
            getByCategory: getFAIconsByCategory,
            getByStyle: getFAIconsByStyle,
        };
    }
}
