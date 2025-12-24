/**
 * @fileoverview NumericInput Component Model
 * @module components/Input/NumericInput
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const NumericInputModelSchema = extendSchema({
    /** Minimum value */
    min: z.number().optional(),
    /** Maximum value */
    max: z.number().optional(),
    /** Step increment */
    step: z.number().default(1),
    /** Current value */
    value: z.number().default(0),
    /** Label text */
    label: z.string().optional(),
    /** Unit suffix */
    unit: z.string().optional(),
    /** Placeholder text */
    placeholder: z.string().optional(),
    /** Show stepper buttons */
    showStepper: z.boolean().default(true),
    /** Visual variant */
    variant: z.enum(['default', 'neon', 'minimal']).default('default'),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Dark mode */
    isDark: z.boolean().default(true),
    /** Decimal places */
    decimals: z.number().default(0),
});

export type NumericInputModel = z.infer<typeof NumericInputModelSchema>;

export const defaultNumericInputModel: NumericInputModel = {
    min: undefined,
    max: undefined,
    step: 1,
    value: 0,
    label: undefined,
    unit: undefined,
    placeholder: '0',
    showStepper: true,
    variant: 'default',
    size: 'md',
    isDark: true,
    decimals: 0,
    disabled: false,
    loading: false,
};
