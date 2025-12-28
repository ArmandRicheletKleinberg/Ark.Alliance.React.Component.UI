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
