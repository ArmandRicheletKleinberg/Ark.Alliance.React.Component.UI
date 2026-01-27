/**
 * @fileoverview TabControl Component Model
 * @module components/TabControl
 * 
 * Defines the data structure for the TabControl container.
 * Manages tab collection, active state, and layout configuration.
 * 
 * Uses consolidated enums from core/enums.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import {
    ComponentSizeSchema,
    TabVariantSchema,
    OrientationSchema,
    AlignmentSchema,
    type TabVariant,
    type Orientation,
    type Alignment,
} from '../../core/enums';
import { TabItemModelSchema, type TabItemModel } from './TabItem/TabItem.model';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabControl model schema extending base model
 * 
 * Uses consolidated enums:
 * - TabVariantSchema from core/enums/Variant
 * - OrientationSchema from core/enums/Position
 * - AlignmentSchema from core/enums/Position
 */
export const TabControlModelSchema = extendSchema({
    /** Array of tab items */
    items: z.array(TabItemModelSchema).default([]),

    /** Currently active tab tabKey */
    activeKey: z.string().optional(),

    /** Default active tabKey (uncontrolled mode) */
    defaultActiveKey: z.string().optional(),

    /** Visual variant */
    variant: TabVariantSchema.default('default'),

    /** Tab orientation */
    orientation: OrientationSchema.default('horizontal'),

    /** Tab alignment within container */
    alignment: AlignmentSchema.default('start'),

    /** Size variant */
    size: ComponentSizeSchema.default('md'),

    /** Whether to fill available width/height */
    fill: z.boolean().default(false),

    /** Whether tabs are scrollable when overflow */
    scrollable: z.boolean().default(false),

    /** Gap between tabs in pixels */
    gap: z.number().default(4),

    /** Show close button on tabs */
    closeable: z.boolean().default(false),

    /** Animation duration in ms */
    animationDuration: z.number().default(200),

    /** Show icons only (hide labels) */
    iconsOnly: z.boolean().default(false),

    /** Dark mode variant */
    isDark: z.boolean().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TabVariantType = TabVariant;
export type TabOrientationType = Orientation;
export type TabAlignmentType = Alignment;
export type TabControlModel = z.infer<typeof TabControlModelSchema>;

// Re-export TabItem types for convenience
export type { TabItemModel } from './TabItem/TabItem.model';

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default TabControl model values
 */
export const defaultTabControlModel: TabControlModel = TabControlModelSchema.parse({});

/**
 * Create a TabControl model with custom values
 */
export function createTabControlModel(data: Partial<TabControlModel> = {}): TabControlModel {
    return TabControlModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tab padding by size
 */
export const TAB_SIZE_PADDING: Record<string, { x: number; y: number }> = {
    xs: { x: 8, y: 4 },
    sm: { x: 12, y: 6 },
    md: { x: 16, y: 8 },
    lg: { x: 20, y: 10 },
    xl: { x: 24, y: 12 },
};

/**
 * Tab font size by size
 */
export const TAB_SIZE_FONT: Record<string, string> = {
    xs: '0.75rem',
    sm: '0.8125rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '1.125rem',
};
