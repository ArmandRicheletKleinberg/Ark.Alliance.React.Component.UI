/**
 * @fileoverview SideBarMenu Component Model
 * @module components/SideBar/SideBarMenu
 * 
 * Model for collapsible sidebar menu with hamburger toggle.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Menu item schema
 */
export const MenuItemSchema: z.ZodType<MenuItem> = z.object({
    /** Unique key */
    key: z.string(),
    /** Display label */
    label: z.string(),
    /** Optional icon (emoji or component name) */
    icon: z.string().optional(),
    /** Nested items - defined as any[] for recursive support */
    children: z.array(z.any()).optional(),
    /** Disabled state */
    disabled: z.boolean().optional(),
    /** Badge count */
    badge: z.number().optional(),
});

/** Menu item type */
export interface MenuItem {
    key: string;
    label: string;
    icon?: string;
    children?: MenuItem[];
    disabled?: boolean;
    badge?: number;
}

/**
 * Menu category/family schema
 */
export const MenuCategorySchema = z.object({
    /** Category name */
    name: z.string(),
    /** Category icon */
    icon: z.string(),
    /** Items in category */
    items: z.array(MenuItemSchema),
});

/**
 * SideBarMenu variant styles
 */
export const SideBarMenuVariant = z.enum(['default', 'minimal', 'neon', 'glass']);

/**
 * SideBarMenu position
 */
export const SideBarMenuPosition = z.enum(['left', 'right']);

/**
 * SideBarMenu model schema
 */
export const SideBarMenuModelSchema = extendSchema({
    /** Menu categories */
    categories: z.array(MenuCategorySchema).default([]),

    /** Menu title/logo */
    title: z.string().optional(),

    /** Visual variant */
    variant: SideBarMenuVariant.default('default'),

    /** Position */
    position: SideBarMenuPosition.default('left'),

    /** Collapsed state */
    collapsed: z.boolean().default(false),

    /** Width when expanded */
    expandedWidth: z.number().default(280),

    /** Width when collapsed */
    collapsedWidth: z.number().default(60),

    /** Show hamburger toggle */
    showHamburger: z.boolean().default(true),

    /** Dark mode */
    isDark: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// MenuItem interface is defined above (line 34)
export type MenuCategory = z.infer<typeof MenuCategorySchema>;
export type SideBarMenuVariantType = z.infer<typeof SideBarMenuVariant>;
export type SideBarMenuPositionType = z.infer<typeof SideBarMenuPosition>;
export type SideBarMenuModel = z.infer<typeof SideBarMenuModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultSideBarMenuModel: Omit<SideBarMenuModel, 'categories'> & { categories: MenuCategory[] } = {
    categories: [],
    title: 'Menu',
    variant: 'default',
    position: 'left',
    collapsed: false,
    expandedWidth: 280,
    collapsedWidth: 60,
    showHamburger: true,
    isDark: true,
    disabled: false,
    loading: false,
    focusable: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

/**
 * Create a menu model
 */
export function createSideBarMenuModel(data: Partial<SideBarMenuModel> = {}): SideBarMenuModel {
    return SideBarMenuModelSchema.parse({ ...defaultSideBarMenuModel, ...data });
}
