/**
 * @fileoverview Label Component Model
 * @module components/Label
 * 
 * Defines the data structure, validation, and defaults for the Label component.
 * Uses Zod for runtime validation and type safety.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Label semantic variants
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
 */
export const LabelSize = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);

/**
 * Font weight options
 */
export const LabelWeight = z.enum(['normal', 'medium', 'semibold', 'bold']);

/**
 * Text transform options
 */
export const LabelTransform = z.enum(['none', 'uppercase', 'lowercase', 'capitalize']);

/**
 * Icon position relative to label text
 */
export const LabelIconPosition = z.enum(['left', 'right']);

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
    size: LabelSize.default('md'),

    /** Font weight */
    weight: LabelWeight.default('medium'),

    /** Text transform */
    transform: LabelTransform.default('none'),

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
    iconPosition: LabelIconPosition.default('left'),

    /** Custom icon color */
    iconColor: z.string().optional(),

    /** Tooltip text on hover */
    tooltip: z.string().optional(),

    /** Tooltip position */
    tooltipPosition: z.enum(['top', 'bottom', 'left', 'right']).default('top'),

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
export type LabelSizeType = z.infer<typeof LabelSize>;
export type LabelWeightType = z.infer<typeof LabelWeight>;
export type LabelTransformType = z.infer<typeof LabelTransform>;
export type LabelIconPositionType = z.infer<typeof LabelIconPosition>;
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
    truncate: false,
    noWrap: false,
    inline: true,
    disabled: false,
    loading: false,
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
