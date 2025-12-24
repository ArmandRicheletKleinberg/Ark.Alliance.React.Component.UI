/**
 * @fileoverview Timeline Component
 * @module components/TimeLines/Timeline
 */

import { forwardRef, memo } from 'react';
import { useTimeline, type UseTimelineOptions } from './Timeline.viewmodel';
import './Timeline.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TimelineProps extends UseTimelineOptions {
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Timeline = memo(forwardRef<HTMLDivElement, TimelineProps>(
    function Timeline(props, ref) {
        const { className = '', ...timelineOptions } = props;
        const vm = useTimeline(timelineOptions);

        return (
            <div ref={ref} className={`${vm.timelineClasses} ${className}`} data-testid={vm.model.testId}>
                {vm.items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`ark-timeline__item ark-timeline__item--${item.status}`}
                    >
                        <div className="ark-timeline__marker">
                            {item.icon ? (
                                <span className="ark-timeline__icon">{item.icon}</span>
                            ) : (
                                <span className="ark-timeline__dot" />
                            )}
                        </div>
                        <div className="ark-timeline__content">
                            <h4 className="ark-timeline__title">{item.title}</h4>
                            {item.description && (
                                <p className="ark-timeline__description">{item.description}</p>
                            )}
                            {item.date && (
                                <span className="ark-timeline__date">{item.date}</span>
                            )}
                        </div>
                        {vm.model.showConnectors && index < vm.items.length - 1 && (
                            <div className="ark-timeline__connector" />
                        )}
                    </div>
                ))}
            </div>
        );
    }
));

Timeline.displayName = 'Timeline';
export default Timeline;
