/**
 * @fileoverview Carousel Component Model
 * @module components/Slides/Carousel
 * 
 * Enhanced carousel model with slide data structure, touch gestures,
 * keyboard navigation, playback controls, and accessibility features.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { ComponentSizeSchema } from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Carousel Slide Schema
 * Defines the structure for individual slides with rich content support
 */
export const CarouselSlideSchema = z.object({
    /** Unique identifier for the slide */
    id: z.string(),

    /** Main slide title */
    title: z.string(),

    /** Optional subtitle/category */
    subtitle: z.string().optional(),

    /** Slide description/body text */
    description: z.string().optional(),

    /** Background image URL */
    imageUrl: z.string().optional(),

    /** Call-to-action link */
    ctaLink: z.string().optional(),

    /** Call-to-action button label */
    ctaLabel: z.string().optional(),

    /** Accessibility label override */
    ariaLabel: z.string().optional(),
});

export type CarouselSlide = z.infer<typeof CarouselSlideSchema>;

/**
 * Carousel Model Schema
 * Enhanced with gesture support, playback controls, and accessibility features
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

    /** Show progress bar during autoplay */
    showProgress: z.boolean().default(true),

    /** Show play/pause button */
    showPlayback: z.boolean().default(true),

    /** Pause autoplay on hover */
    pauseOnHover: z.boolean().default(true),

    /** Pause on any interaction (hover, focus, touch) */
    pauseOnInteraction: z.boolean().default(true),

    /** Enable touch/swipe gestures */
    enableGestures: z.boolean().default(true),

    /** Enable keyboard navigation */
    enableKeyboard: z.boolean().default(true),

    /** Minimum swipe distance (px) */
    swipeThreshold: z.number().default(50),

    /** Animation effect */
    effect: z.enum(['slide', 'fade']).default('slide'),

    /** Loading state */
    isLoading: z.boolean().default(false),

    /** Component size */
    size: ComponentSizeSchema.default('md'),

    /** Dark mode */
    isDark: z.boolean().default(true),
});

export type CarouselModel = z.infer<typeof CarouselModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export function createCarouselModel(data: Partial<CarouselModel>): CarouselModel {
    return CarouselModelSchema.parse(data);
}

export function createCarouselSlide(data: CarouselSlide): CarouselSlide {
    return CarouselSlideSchema.parse(data);
}
