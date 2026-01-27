/**
 * @fileoverview Modal Component
 * @module components/Modal
 * 
 * Modal dialog with MVVM pattern, animations, and backdrop.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { ModalSizeSchema, type ModalSize } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// MODEL
// ═══════════════════════════════════════════════════════════════════════════

export const ModalModelSchema = extendSchema({
    /** Modal open state */
    isOpen: z.boolean().default(false),
    /** Modal title */
    title: z.string().optional(),
    /** Subtitle */
    subtitle: z.string().optional(),
    /** Size variant */
    size: ModalSizeSchema.default('md'),
    /** Show close button */
    showClose: z.boolean().default(true),
    /** Close on backdrop click */
    closeOnBackdrop: z.boolean().default(true),
    /** Close on escape key */
    closeOnEscape: z.boolean().default(true),
    /** Dark mode */
    isDark: z.boolean().optional(),
    /** Centered vertically */
    centered: z.boolean().default(true),
    /** Visual variant */
    variant: z.enum(['default', 'glass', 'bordered', 'elevated']).default('default'),
});

export type ModalModel = z.infer<typeof ModalModelSchema>;

export const defaultModalModel: ModalModel = {
    isOpen: false,
    title: undefined,
    subtitle: undefined,
    variant: 'default',
    size: 'md',
    showClose: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    isDark: undefined,
    centered: true,
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
