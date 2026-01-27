/**
 * @fileoverview InputBase Primitive Model
 * @module components/Input/primitives
 * 
 * Foundational model for all input components.
 * Extends core FormInputModel and adds primitive styling props.
 */

import { z } from 'zod';
import { extendFormInputSchema } from '../../../core/base';
import {
    BasicSizeSchema,
    InputVariantSchema,
    type BasicSize,
    type InputVariant,
} from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * InputBase model schema
 */
export const InputBaseModelSchema = extendFormInputSchema({
    /** Size variant */
    size: BasicSizeSchema.default('md'),

    /** Visual style variant */
    variant: InputVariantSchema.default('default'),

    /** Full width flag */
    fullWidth: z.boolean().default(false),

    /** Error state override */
    hasError: z.boolean().default(false),

    /** Focus state override */
    isFocused: z.boolean().default(false),

    // HTML Input attributes
    type: z.string().default('text'),
    value: z.union([z.string(), z.number()]).default(''),
    placeholder: z.string().optional(),
    maxLength: z.number().optional(),
    minLength: z.number().optional(),
    pattern: z.string().optional(),
    autoFocus: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type InputBaseModel = z.infer<typeof InputBaseModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

export const defaultInputBaseModel: Partial<InputBaseModel> = {
    size: 'md',
    variant: 'default',
    fullWidth: false,
    hasError: false,
    isFocused: false,
    type: 'text',
    value: '',
};
