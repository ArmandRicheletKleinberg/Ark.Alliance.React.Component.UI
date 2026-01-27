/**
 * @fileoverview Variant Enum Definitions
 * @module core/enums/Variant
 * 
 * Centralized variant enums used across the component library.
 * Variants control the visual style/theme of components.
 * 
 * @example
 * ```typescript
 * import { ComponentVariantSchema } from '@core/enums';
 * 
 * const panelModel = z.object({
 *     variant: ComponentVariantSchema.default('default'),
 * });
 * ```
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard component variant options.
 * 
 * | Variant | Description |
 * |---------|-------------|
 * | `default` | Standard appearance |
 * | `neon` | Glowing neon effect |
 * | `minimal` | Minimal/clean look |
 * | `glass` | Glassmorphism effect |
 * | `bordered` | Prominent border |
 * | `elevated` | Shadow/elevation effect |
 */
export const ComponentVariantSchema = z.enum([
    'default',
    'neon',
    'minimal',
    'glass',
    'bordered',
    'elevated',
]);

/**
 * Basic three-value variant for simpler components.
 */
export const BasicVariantSchema = z.enum(['default', 'neon', 'minimal']);

/**
 * Input field variant options.
 * 
 * | Variant | Description |
 * |---------|-------------|
 * | `default` | Standard input with border |
 * | `filled` | Background-filled input |
 * | `outlined` | Only outline border |
 * | `underlined` | Only bottom border |
 */
export const InputVariantSchema = z.enum(['default', 'filled', 'outlined', 'underlined']);

/**
 * Panel/Card variant options.
 */
export const PanelVariantSchema = z.enum(['default', 'glass', 'bordered', 'elevated']);

/**
 * Button variant options.
 * 
 * | Variant | Use Case |
 * |---------|----------|
 * | `default` | Standard button |
 * | `primary` | Primary actions |
 * | `secondary` | Secondary actions |
 * | `danger` | Destructive actions |
 * | `success` | Confirmation actions |
 * | `ghost` | Minimal/transparent |
 */
export const ButtonVariantSchema = z.enum([
    'default',
    'primary',
    'secondary',
    'danger',
    'success',
    'ghost',
    'outline',
    'neon',
    'link',
]);

/**
 * Tab control variant options.
 * 
 * | Variant | Description |
 * |---------|-------------|
 * | `default` | Standard tabs with background |
 * | `pills` | Rounded pill-shaped tabs |
 * | `underline` | Tabs with bottom border indicator |
 * | `boxed` | Tabs with full border box |
 * | `compact` | Smaller tabs with minimal padding |
 */
export const TabVariantSchema = z.enum([
    'default',
    'pills',
    'underline',
    'boxed',
    'compact',
]);

/**
 * Semantic variant options for feedback/status.
 * 
 * | Variant | Use Case |
 * |---------|----------|
 * | `primary` | Main actions |
 * | `secondary` | Secondary actions |
 * | `success` | Successful operations |
 * | `warning` | Cautions |
 * | `error` | Errors/Failures |
 * | `info` | Information |
 */
export const SemanticVariantSchema = z.enum([
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
]);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/** Standard component variant type */
export type ComponentVariant = z.infer<typeof ComponentVariantSchema>;

/** Basic three-value variant type */
export type BasicVariant = z.infer<typeof BasicVariantSchema>;

/** Input variant type */
export type InputVariant = z.infer<typeof InputVariantSchema>;

/** Panel variant type */
export type PanelVariant = z.infer<typeof PanelVariantSchema>;

/** Button variant type */
export type ButtonVariant = z.infer<typeof ButtonVariantSchema>;

/** Tab variant type */
export type TabVariant = z.infer<typeof TabVariantSchema>;

/** Semantic variant type */
export type SemanticVariant = z.infer<typeof SemanticVariantSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default variant for most components.
 */
export const DEFAULT_VARIANT: BasicVariant = 'default';

