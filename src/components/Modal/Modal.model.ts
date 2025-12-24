/**
 * @fileoverview Modal Component
 * @module components/Modal
 * 
 * Modal dialog with MVVM pattern, animations, and backdrop.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';

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
    size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('md'),
    /** Show close button */
    showClose: z.boolean().default(true),
    /** Close on backdrop click */
    closeOnBackdrop: z.boolean().default(true),
    /** Close on escape key */
    closeOnEscape: z.boolean().default(true),
    /** Dark mode */
    isDark: z.boolean().default(true),
    /** Centered vertically */
    centered: z.boolean().default(true),
});

export type ModalModel = z.infer<typeof ModalModelSchema>;

export const defaultModalModel: ModalModel = {
    isOpen: false,
    title: undefined,
    subtitle: undefined,
    size: 'md',
    showClose: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    isDark: true,
    centered: true,
    disabled: false,
    loading: false,
};
