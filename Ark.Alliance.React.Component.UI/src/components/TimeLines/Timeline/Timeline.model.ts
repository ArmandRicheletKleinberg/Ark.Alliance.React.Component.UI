/**
 * @fileoverview Timeline Component Model
 * @module components/TimeLines/Timeline
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { ProcessStatusSchema, OrientationSchema, type ProcessStatus, type Orientation } from '../../../core/enums';

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
    /** Category for filtering */
    category: z.string().optional(),
    /** Tags for search/filtering */
    tags: z.array(z.string()).optional(),
    /** Status for coloring/styling */
    status: ProcessStatusSchema.default('pending'),
});

/**
 * Timeline model schema
 */
export const TimelineModelSchema = extendSchema({
    /** Timeline items */
    items: z.array(TimelineItemSchema).default([]),

    /** Layout orientation */
    orientation: OrientationSchema.default('vertical'),

    /** Show connector lines */
    showConnectors: z.boolean().default(true),

    /** Maximum items before auto-trim (0 = no limit) */
    maxItems: z.number().min(0).default(0),

    /** Auto-scroll to new items when added */
    autoScroll: z.boolean().default(true),

    /** Enable animation for new entries */
    animateNewItems: z.boolean().default(true),

    /** Enable admin/edit mode */
    adminMode: z.boolean().default(false),

    /** Text filter query */
    filter: z.string().optional(),

    /** Selected category filter */
    selectedCategory: z.string().optional(),

    /** Date format string (e.g. 'YYYY-MM-DD') */
    dateFormat: z.string().optional(),
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

