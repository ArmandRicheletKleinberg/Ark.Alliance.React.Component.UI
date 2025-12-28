/**
 * @fileoverview Timeline Component Model
 * @module components/TimeLines/Timeline
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Timeline item schema
 */
export const TimelineItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    icon: z.string().optional(),
    status: z.enum(['pending', 'active', 'completed', 'error']).default('pending'),
});

/**
 * Timeline model schema
 */
export const TimelineModelSchema = extendSchema({
    /** Timeline items */
    items: z.array(TimelineItemSchema).default([]),

    /** Layout orientation */
    orientation: z.enum(['vertical', 'horizontal']).default('vertical'),

    /** Show connector lines */
    showConnectors: z.boolean().default(true),

    /** Maximum items before auto-trim (0 = no limit) */
    maxItems: z.number().min(0).default(0),

    /** Auto-scroll to new items when added */
    autoScroll: z.boolean().default(true),

    /** Enable animation for new entries */
    animateNewItems: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type TimelineModel = z.infer<typeof TimelineModelSchema>;

export const defaultTimelineModel: TimelineModel = TimelineModelSchema.parse({});

export function createTimelineModel(data: Partial<TimelineModel> = {}): TimelineModel {
    return TimelineModelSchema.parse(data);
}
