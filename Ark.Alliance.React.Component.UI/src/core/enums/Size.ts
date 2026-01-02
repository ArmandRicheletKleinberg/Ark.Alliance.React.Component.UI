/**
 * @fileoverview Size Enum Definitions
 * @module core/enums/Size
 * 
 * Centralized size enums used across the component library.
 * These provide consistent sizing options for components.
 * 
 * @example
 * ```typescript
 * import { ComponentSizeSchema, ComponentSize } from '@core/enums';
 * 
 * const MyComponent: React.FC<{ size: ComponentSize }> = ({ size }) => {
 *     // size is typed as 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * };
 * ```
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// SIZE SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard component size options.
 * 
 * | Size | Use Case |
 * |------|----------|
 * | `xs` | Compact UI, inline indicators |
 * | `sm` | Secondary actions, dense layouts |
 * | `md` | Default/primary actions |
 * | `lg` | Prominent actions, hero sections |
 * | `xl` | Extra large, splash screens |
 */
export const ComponentSizeSchema = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);

/**
 * Basic three-value size for simpler components.
 * 
 * Use when `xs` and `xl` are not needed.
 */
export const BasicSizeSchema = z.enum(['sm', 'md', 'lg']);

/**
 * Modal-specific size options.
 * 
 * | Size | Description |
 * |------|-------------|
 * | `sm` | Small (400px) - confirmations |
 * | `md` | Medium (600px) - forms |
 * | `lg` | Large (800px) - complex dialogs |
 * | `xl` | Extra large (1000px) - dashboards |
 * | `full` | Fullscreen modal |
 */
export const ModalSizeSchema = z.enum(['sm', 'md', 'lg', 'xl', 'full']);

/**
 * Progress bar size options (includes xs for thin bars).
 */
export const ProgressSizeSchema = z.enum(['xs', 'sm', 'md', 'lg']);

/**
 * Icon/Title size options with extended sizes.
 * 
 * Includes `2xl` and `3xl` for hero headers and large icons.
 */
export const ExtendedSizeSchema = z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/** Standard component size type */
export type ComponentSize = z.infer<typeof ComponentSizeSchema>;

/** Basic three-value size type */
export type BasicSize = z.infer<typeof BasicSizeSchema>;

/** Modal size type */
export type ModalSize = z.infer<typeof ModalSizeSchema>;

/** Progress bar size type */
export type ProgressSize = z.infer<typeof ProgressSizeSchema>;

/** Extended size type with 2xl/3xl */
export type ExtendedSize = z.infer<typeof ExtendedSizeSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size values as constant array for iteration.
 */
export const COMPONENT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Basic size values as constant array.
 */
export const BASIC_SIZES = ['sm', 'md', 'lg'] as const;

/**
 * Default size for most components.
 */
export const DEFAULT_SIZE: BasicSize = 'md';

// ═══════════════════════════════════════════════════════════════════════════
// SIZE MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard component padding by size variant.
 * Used for tabs, buttons, cards, and other interactive elements.
 */
export const COMPONENT_PADDING: Record<ComponentSize, { x: number; y: number }> = {
    xs: { x: 8, y: 4 },
    sm: { x: 12, y: 6 },
    md: { x: 16, y: 8 },
    lg: { x: 20, y: 10 },
    xl: { x: 24, y: 12 },
};

/**
 * Standard font sizes by size variant.
 */
export const COMPONENT_FONT_SIZE: Record<ComponentSize, string> = {
    xs: '0.75rem',    // 12px
    sm: '0.8125rem',  // 13px
    md: '0.875rem',   // 14px
    lg: '1rem',       // 16px
    xl: '1.125rem',   // 18px
};

/**
 * Icon sizes by component size.
 */
export const ICON_SIZE_BY_COMPONENT: Record<ComponentSize, 'xs' | 'sm' | 'md' | 'lg'> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'sm',
    xl: 'md',
};

/**
 * Standard gap sizes.
 */
export const GAP_SIZE: Record<ComponentSize, number> = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
};

/**
 * Border radius by size.
 */
export const BORDER_RADIUS: Record<ComponentSize | 'none' | 'full', string> = {
    none: '0',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
};
