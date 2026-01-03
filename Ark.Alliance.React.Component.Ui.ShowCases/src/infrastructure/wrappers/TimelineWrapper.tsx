/**
 * @fileoverview Timeline Wrapper
 * @module infrastructure/wrappers/TimelineWrapper
 */

import React, { useMemo } from 'react';
import { Timeline, TimelineProps, TimelineItem } from 'ark-alliance-react-ui';

interface TimelineWrapperProps extends Omit<TimelineProps, 'items'> {
    itemCount?: number;
    // Allow basic items override if needed, but default to generated
    items?: TimelineItem[];
}

export const TimelineWrapper: React.FC<TimelineWrapperProps> = ({
    itemCount = 4,
    items,
    ...props
}) => {
    const generatedItems = useMemo<TimelineItem[]>(() => {
        if (items) return items;
        return Array.from({ length: itemCount }).map((_, i) => ({
            id: `event-${i}`,
            title: `Event ${i + 1}`,
            description: `Description for event ${i + 1}. This is a significant milestone.`,
            date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
            status: ['completed', 'active', 'pending', 'error'][i % 4] as any,
            category: i % 2 === 0 ? 'Milestone' : 'Update',
            icon: i === 0 ? 'check' : undefined
        }));
    }, [itemCount, items]);

    return (
        <Timeline
            items={generatedItems}
            {...props}
        />
    );
};
