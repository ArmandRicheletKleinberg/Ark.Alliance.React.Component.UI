/**
 * @fileoverview Label Component Model
 * @module components/Label
 * 
 * Defines the data structure, validation, and defaults for the Label component.
 * Uses Zod for runtime validation and type safety.
 */

import { z } from 'zod';
import { extendSchema } from '../../../../core/base';
import {
    ComponentSizeSchema,
    FontWeightSchema,
    TextTransformSchema,
    HorizontalPositionSchema,
    PositionSchema,
    type ComponentSize,
    type FontWeight,
    type TextTransform,
    type HorizontalPosition,
    type Position,
} from '../../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Label semantic variants (component-specific, not centralized)
 */
export const LabelVariant = z.enum([
    'default',
    'subtle',
    'muted',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
]);

/**
 * Label size variants
 * @deprecated Use ComponentSizeSchema from '@core/enums' instead
 */
export const LabelSize = ComponentSizeSchema;

/**
 * Font weight options
 * @deprecated Use FontWeightSchema from '@core/enums' instead
 */
export const LabelWeight = FontWeightSchema;

/**
 * Text transform options
 * @deprecated Use TextTransformSchema from '@core/enums' instead
 */
export const LabelTransform = TextTransformSchema;

/**
 * Icon position relative to label text
 * @deprecated Use HorizontalPositionSchema from '@core/enums' instead
 */
export const LabelIconPosition = HorizontalPositionSchema;

/**
 * Label model schema extending base model
 */
export const LabelModelSchema = extendSchema({
    /** Label text content */
    text: z.string(),

    /** Associated form element ID (for accessibility) */
    htmlFor: z.string().optional(),

    /** Semantic variant for color styling */
    variant: LabelVariant.default('default'),

    /** Size of the label */
    size: ComponentSizeSchema.default('md'),

    /** Font weight */
    weight: FontWeightSchema.default('medium'),

    /** Text transform */
    transform: TextTransformSchema.default('none'),

    /** Shows required indicator (*) */
    required: z.boolean().default(false),

    /** Optional description text for required field */
    requiredText: z.string().optional(),

    /** Custom text color (overrides variant) */
    color: z.string().optional(),

    /** Custom font family */
    fontFamily: z.string().optional(),

    /** Icon name to display (from IconRegistry) */
    icon: z.string().optional(),

    /** Icon position relative to text */
    iconPosition: HorizontalPositionSchema.default('left'),

    /** Custom icon color */
    iconColor: z.string().optional(),

    /** Tooltip text on hover */
    tooltip: z.string().optional(),

    /** Tooltip position */
    tooltipPosition: PositionSchema.default('top'),

    /** Whether to truncate with ellipsis */
    truncate: z.boolean().default(false),

    /** Max width for truncation */
    maxWidth: z.string().optional(),

    /** Whether label text should wrap */
    noWrap: z.boolean().default(false),

    /** Custom line height */
    lineHeight: z.union([z.string(), z.number()]).optional(),

    /** Letter spacing */
    letterSpacing: z.string().optional(),

    /** Makes the label inline-flex for icon alignment */
    inline: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type LabelVariantType = z.infer<typeof LabelVariant>;
export type LabelSizeType = ComponentSize;
export type LabelWeightType = FontWeight;
export type LabelTransformType = TextTransform;
export type LabelIconPositionType = HorizontalPosition;
export type LabelModel = z.infer<typeof LabelModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default label model values
 */
export const defaultLabelModel: Omit<LabelModel, 'text'> & { text?: string } = {
    text: undefined,
    variant: 'default',
    size: 'md',
    weight: 'medium',
    transform: 'none',
    required: false,
    iconPosition: 'left',
    tooltipPosition: 'top',
    tooltipDelay: 300,
    truncate: false,
    noWrap: false,
    inline: true,
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
};

/**
 * Create a label model with custom values
 */
export function createLabelModel(data: Partial<LabelModel> & { text: string }): LabelModel {
    return LabelModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font size mapping for label sizes
 */
export const LABEL_SIZE_MAP: Record<LabelSizeType, string> = {
    xs: '0.625rem',  // 10px
    sm: '0.75rem',   // 12px
    md: '0.875rem',  // 14px
    lg: '1rem',      // 16px
    xl: '1.125rem',  // 18px
};

/**
 * Icon size mapping for label sizes
 */
export const LABEL_ICON_SIZE_MAP: Record<LabelSizeType, 'xs' | 'sm' | 'md'> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'sm',
    xl: 'md',
};
