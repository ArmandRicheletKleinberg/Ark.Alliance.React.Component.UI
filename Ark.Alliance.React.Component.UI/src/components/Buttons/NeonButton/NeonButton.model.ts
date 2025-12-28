/**
 * @fileoverview NeonButton Model
 * @module components/Buttons/NeonButton
 * 
 * Defines the data structure for the neon-styled button component.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS  
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NeonButton-specific variants (neon-styled subset)
 */
export const NeonButtonVariant = z.enum(['primary', 'success', 'danger', 'warning', 'ghost']);

/**
 * Button sizes
 */
export const NeonButtonSize = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);

/**
 * NeonButton model schema extending base model
 */
export const NeonButtonModelSchema = extendSchema({
    /** Neon color variant */
    variant: NeonButtonVariant.default('primary'),

    /** Size of the button */
    size: NeonButtonSize.default('md'),

    /** Button type attribute */
    type: z.enum(['button', 'submit', 'reset']).default('button'),

    /** Full width button */
    fullWidth: z.boolean().default(false),

    /** Dark mode (affects background gradient) */
    isDark: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type NeonButtonVariantType = z.infer<typeof NeonButtonVariant>;
export type NeonButtonSizeType = z.infer<typeof NeonButtonSize>;
export type NeonButtonModel = z.infer<typeof NeonButtonModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default NeonButton model values
 */
export const defaultNeonButtonModel: NeonButtonModel = NeonButtonModelSchema.parse({});

/**
 * Create a NeonButton model with custom values
 */
export function createNeonButtonModel(data: Partial<NeonButtonModel> = {}): NeonButtonModel {
    return NeonButtonModelSchema.parse(data);
}
