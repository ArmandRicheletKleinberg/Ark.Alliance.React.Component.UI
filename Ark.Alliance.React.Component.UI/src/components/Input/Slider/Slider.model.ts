/**
 * @fileoverview Slider Component Model
 * @module components/Input/Slider
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const SliderModelSchema = extendSchema({
    /** Minimum value */
    min: z.number().default(0),
    /** Maximum value */
    max: z.number().default(100),
    /** Step increment */
    step: z.number().default(1),
    /** Current value */
    value: z.number().default(50),
    /** Label text */
    label: z.string().optional(),
    /** Unit suffix (e.g., '%', 'px', 'ms') */
    unit: z.string().optional(),
    /** Show current value display */
    showValue: z.boolean().default(true),
    /** Show min/max labels */
    showRange: z.boolean().default(false),
    /** Visual variant */
    variant: z.enum(['default', 'neon', 'minimal']).default('default'),
    /** Color theme */
    color: z.enum(['cyan', 'blue', 'green', 'purple', 'red', 'yellow']).default('cyan'),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Dark mode */
    isDark: z.boolean().default(true),
    /** Decimal places for display */
    decimals: z.number().default(0),
});

export type SliderModel = z.infer<typeof SliderModelSchema>;

export const defaultSliderModel: SliderModel = {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    label: undefined,
    unit: undefined,
    showValue: true,
    showRange: false,
    variant: 'default',
    color: 'cyan',
    size: 'md',
    isDark: true,
    decimals: 0,
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
