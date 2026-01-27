/**
 * @fileoverview Carousel Component Model
 * @module components/Slides/Carousel
 * 
 * Defines the data structure for the Carousel component,
 * handling slide items, autoplay configuration, and navigation state.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { ComponentSizeSchema } from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Single Slide Item Schema
 * (Can be generic content, but usually we map children to slides)
 * But here we define props-based items if user wants data-driven slides.
 * Or we can use children-based approach.
 * For MVVM model, usually data-driven is preferred, or mixed.
 * Let's support both: array of items OR rendered children managed by index.
 * We'll track state mostly.
 */
export const CarouselItemSchema = z.object({
    key: z.string(),
    content: z.any(), // ReactNode usually, but Zod treats as any/unknown
    label: z.string().optional(), // For accessibility
});

/**
 * Carousel Model Schema
 */
export const CarouselModelSchema = extendSchema({
    /** Active Slide Index (0-based) */
    activeIndex: z.number().default(0),

    /** Autoplay enabled */
    autoplay: z.boolean().default(false),

    /** Autoplay interval in milliseconds */
    interval: z.number().default(5000),

    /** Infinite loop */
    loop: z.boolean().default(true),

    /** Show navigation arrows */
    showControls: z.boolean().default(true),

    /** Show pagination indicators (dots) */
    showIndicators: z.boolean().default(true),

    /** Pause autoplay on hover */
    pauseOnHover: z.boolean().default(true),

    /** Animation effect */
    effect: z.enum(['slide', 'fade']).default('slide'),

    /** Component size */
    size: ComponentSizeSchema.default('md'),

    /** Dark mode */
    isDark: z.boolean().default(true),
});

export type CarouselModel = z.infer<typeof CarouselModelSchema>;
export type CarouselItem = z.infer<typeof CarouselItemSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export function createCarouselModel(data: Partial<CarouselModel>): CarouselModel {
    return CarouselModelSchema.parse(data);
}
