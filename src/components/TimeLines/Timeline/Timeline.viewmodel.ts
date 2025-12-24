/**
 * @fileoverview Timeline Component ViewModel
 * @module components/TimeLines/Timeline
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TimelineModel, TimelineItem } from './Timeline.model';
import { defaultTimelineModel, TimelineModelSchema } from './Timeline.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseTimelineOptions extends Partial<TimelineModel> { }

export interface UseTimelineResult extends BaseViewModelResult<TimelineModel> {
    items: TimelineItem[];
    timelineClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useTimeline(options: UseTimelineOptions = {}): UseTimelineResult {
    const modelOptions = useMemo(() => {
        return TimelineModelSchema.parse({ ...defaultTimelineModel, ...options });
    }, [options]);

    const base = useBaseViewModel<TimelineModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'timeline',
    });

    const timelineClasses = useMemo(() => {
        const classes = ['ark-timeline', `ark-timeline--${base.model.orientation}`];
        if (base.model.showConnectors) classes.push('ark-timeline--connectors');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model]);

    return { ...base, items: base.model.items, timelineClasses };
}

export default useTimeline;
