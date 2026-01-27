/**
 * @fileoverview Button Component Model
 * @module components/Buttons/Button
 * 
 * Defines the data structure, validation, and defaults for the Button component.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import {
    ButtonVariantSchema,
    ComponentSizeSchema,
    type ButtonVariant,
    type ComponentSize,
} from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Button model schema extending base model
 * 
 * Uses consolidated enums from @core/enums:
 * - ButtonVariantSchema (replaces custom ButtonVariant)
 * - ComponentSizeSchema (replaces custom ButtonSize)
 */
export const ButtonModelSchema = extendSchema({
    /** Visual variant (from core/enums) */
    variant: ButtonVariantSchema.default('primary'),

    /** Size of the button (from core/enums) */
    size: ComponentSizeSchema.default('md'),

    /** Button type attribute */
    type: z.enum(['button', 'submit', 'reset']).default('button'),

    /** Full width button */
    fullWidth: z.boolean().default(false),

    /** Icon name to display before text (left position) */
    iconLeft: z.string().optional(),

    /** Custom React Element to display before text (left position) */
    iconLeftElement: z.any().optional(),

    /** Icon name to display after text (right position) */
    iconRight: z.string().optional(),

    /** Custom React Element to display after text (right position) */
    iconRightElement: z.any().optional(),

    /** Icon name for centered icon (use with iconOnly) */
    iconCenter: z.string().optional(),

    /** Icon only button (no text label, just icon) */
    iconOnly: z.boolean().default(false),

    /** Custom icon color (CSS color value) */
    iconColor: z.string().optional(),

    /** Icon color when button is disabled */
    iconColorDisabled: z.string().optional(),

    /** Pill-shaped button (fully rounded) */
    pill: z.boolean().default(false),

    /** Dark mode (optional, auto-detected if not provided) */
    isDark: z.boolean().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ButtonVariantType = ButtonVariant;
export type ButtonSizeType = ComponentSize;
export type ButtonTypeType = z.infer<typeof ButtonModelSchema>['type'];
export type ButtonModel = z.infer<typeof ButtonModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default button model values
 */
export const defaultButtonModel: ButtonModel = ButtonModelSchema.parse({});

/**
 * Create a button model with custom values
 */
export function createButtonModel(data: Partial<ButtonModel> = {}): ButtonModel {
    return ButtonModelSchema.parse(data);
}
