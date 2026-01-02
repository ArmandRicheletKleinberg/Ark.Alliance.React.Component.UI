/**
 * @fileoverview TabItem Component Model
 * @module components/TabControl/TabItem
 * 
 * Defines the data structure for individual tab items.
 * Extends BaseModel for consistent property inheritance.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { HorizontalPositionSchema, ComponentSizeSchema } from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabItem model schema extending base model
 * 
 * Inherits from BaseModel:
 * - disabled, loading, tooltip, tooltipPosition, tooltipDelay
 * - className, style, testId, ariaLabel
 * - clickable, focusable, draggable
 */
export const TabItemModelSchema = extendSchema({
    /** Unique identifier for the tab */
    tabKey: z.string(),

    /** Display label text */
    label: z.string(),

    /** Icon name from IconRegistry */
    icon: z.string().optional(),

    /** Icon position relative to label */
    iconPosition: HorizontalPositionSchema.default('left'),

    /** Whether this tab is currently active */
    isActive: z.boolean().default(false),

    /** Badge text or count */
    badge: z.union([z.string(), z.number()]).optional(),

    /** Badge variant for styling */
    badgeVariant: z.enum(['default', 'primary', 'success', 'warning', 'error']).default('default'),

    /** Whether the tab can be closed */
    closeable: z.boolean().default(false),

    /** Size variant */
    size: ComponentSizeSchema.default('md'),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TabItemModel = z.infer<typeof TabItemModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default TabItem model values
 */
export const defaultTabItemModel: Omit<TabItemModel, 'tabKey' | 'label'> & { tabKey?: string; label?: string } = {
    tabKey: undefined,
    label: undefined,
    iconPosition: 'left',
    isActive: false,
    badgeVariant: 'default',
    closeable: false,
    size: 'md',
    disabled: false,
    loading: false,
    focusable: true,
    clickable: true,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

/**
 * Create a TabItem model with custom values
 */
export function createTabItemModel(data: Partial<TabItemModel> & { tabKey: string; label: string }): TabItemModel {
    return TabItemModelSchema.parse(data);
}
