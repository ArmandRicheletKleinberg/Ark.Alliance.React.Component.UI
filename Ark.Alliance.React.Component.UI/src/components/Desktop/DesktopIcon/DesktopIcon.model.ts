/**
 * @fileoverview DesktopIcon Component Model
 * @module components/Desktop/DesktopIcon
 * 
 * Defines the data structure, validation, and defaults for the DesktopIcon component.
 * Supports multiple icon types: FontAwesome, SVG registry, image URL, or emoji.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { DesktopVisualMode } from '../types';
import { IconSize, IconRotation, IconFlip } from '../../Icon';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DesktopIcon size variants
 */
export const DesktopIconSize = z.enum(['sm', 'md', 'lg']);

/**
 * Icon type enumeration
 */
export const DesktopIconType = z.enum([
    'emoji',    // Unicode emoji character
    'fa',       // FontAwesome icon (fa:icon-name or fa:brands:github)
    'svg',      // SVG registry icon
    'image',    // Image URL (png, jpg, svg file)
]);

/**
 * FontAwesome icon style
 */
export const FAIconStyleEnum = z.enum(['solid', 'regular', 'brands']);

/**
 * DesktopIcon model schema extending base model
 */
export const DesktopIconModelSchema = extendSchema({
    /** Icon label */
    label: z.string(),

    /** 
     * Icon value - interpreted based on iconType:
     * - emoji: Unicode character (e.g., "📁")
     * - fa: FontAwesome name (e.g., "folder" or "brands:github")
     * - svg: SVG registry name (e.g., "chevron-right")
     * - image: URL to image file
     */
    icon: z.string(),

    /** Type of icon to render */
    iconType: DesktopIconType.default('emoji'),

    /** FontAwesome style (only used when iconType is 'fa') */
    faStyle: FAIconStyleEnum.default('solid'),

    /** Associated application ID */
    appId: z.string(),

    /** Whether the icon is selected */
    selected: z.boolean().default(false),

    /** Icon size variant (affects the overall tile size) */
    size: DesktopIconSize.default('md'),

    /** Inner icon size (used for FA/SVG icons) */
    iconSize: IconSize.default('lg'),

    /** Icon rotation */
    iconRotation: IconRotation.default('0'),

    /** Icon flip */
    iconFlip: IconFlip.default('none'),

    /** Icon color (for FA/SVG icons) */
    iconColor: z.string().optional(),

    /** Visual mode */
    visualMode: DesktopVisualMode.default('neon'),

    /** Grid position on desktop (optional for auto-layout) */
    gridPosition: z.object({
        row: z.number().default(0),
        col: z.number().default(0),
    }).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type DesktopIconSizeType = z.infer<typeof DesktopIconSize>;
export type DesktopIconTypeValue = z.infer<typeof DesktopIconType>;
export type FAIconStyleType = z.infer<typeof FAIconStyleEnum>;
export type DesktopIconModel = z.infer<typeof DesktopIconModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default desktop icon model values
 */
export const defaultDesktopIconModel: DesktopIconModel = DesktopIconModelSchema.parse({
    label: 'Untitled',
    icon: '📁',
    iconType: 'emoji',
    appId: '',
});

/**
 * Create a desktop icon model with custom values
 */
export function createDesktopIconModel(data: Partial<DesktopIconModel> & { label: string; icon: string; appId: string }): DesktopIconModel {
    return DesktopIconModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse an icon string to determine type and value
 * Supports shorthand notation:
 * - "fa:folder" → FontAwesome solid folder
 * - "fa:brands:github" → FontAwesome brands github
 * - "svg:chevron-right" → SVG registry
 * - "img:https://..." → Image URL
 * - "📁" → Emoji
 */
export function parseIconString(iconString: string): { type: DesktopIconTypeValue; value: string; faStyle?: FAIconStyleType } {
    if (iconString.startsWith('fa:')) {
        const parts = iconString.slice(3).split(':');
        if (parts.length === 2 && ['solid', 'regular', 'brands'].includes(parts[0])) {
            return { type: 'fa', value: parts[1], faStyle: parts[0] as FAIconStyleType };
        }
        return { type: 'fa', value: parts[0], faStyle: 'solid' };
    }
    if (iconString.startsWith('svg:')) {
        return { type: 'svg', value: iconString.slice(4) };
    }
    if (iconString.startsWith('img:') || iconString.startsWith('http://') || iconString.startsWith('https://')) {
        const url = iconString.startsWith('img:') ? iconString.slice(4) : iconString;
        return { type: 'image', value: url };
    }
    // Default to emoji
    return { type: 'emoji', value: iconString };
}
