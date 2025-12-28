/**
 * @fileoverview Timeline Component
 * @module components/TimeLines/Timeline
 * 
 * Display a list of events in a timeline format with optional click handling.
 */

import { forwardRef, memo } from 'react';
import { useTimeline, type UseTimelineOptions } from './Timeline.viewmodel';
import type { TimelineItem } from './Timeline.model';
import './Timeline.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Timeline component props extending the ViewModel options
 */
export interface TimelineProps extends UseTimelineOptions {
    /** Additional CSS class */
    className?: string;
    /** 
     * Callback when a timeline item is clicked
     * @param item - The clicked timeline item
     */
    onItemClick?: (item: TimelineItem) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Timeline - Display a list of events in chronological order
 * 
 * Features:
 * - Vertical or horizontal orientation
 * - Connector lines between items
 * - Status-based styling (pending, active, completed, error)
 * - Optional icons per item
 * - Click handler support for navigation
 * 
 * @example
 * ```tsx
 * <Timeline 
 *     items={[
 *         { id: '1', title: 'Event 1', status: 'completed' },
 *         { id: '2', title: 'Event 2', status: 'active' }
 *     ]}
 *     onItemClick={(item) => console.log('Clicked:', item)}
 * />
 * ```
 */
export const Timeline = memo(forwardRef<HTMLDivElement, TimelineProps>(
    function Timeline(props, ref) {
        const { className = '', onItemClick, ...timelineOptions } = props;
        const vm = useTimeline(timelineOptions);

        /**
         * Handle item click event
         * @param item - The clicked timeline item
         */
        const handleItemClick = (item: TimelineItem) => {
            if (onItemClick) {
                onItemClick(item);
            }
        };

        /**
         * Handle keyboard navigation for accessibility
         * @param event - Keyboard event
         * @param item - The timeline item
         */
        const handleKeyDown = (event: React.KeyboardEvent, item: TimelineItem) => {
            if (onItemClick && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onItemClick(item);
            }
        };

        return (
            <div
                ref={ref}
                className={`${vm.timelineClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {vm.items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`ark-timeline__item ark-timeline__item--${item.status}${onItemClick ? ' ark-timeline__item--clickable' : ''}`}
                        onClick={() => handleItemClick(item)}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        role={onItemClick ? 'button' : undefined}
                        tabIndex={onItemClick ? 0 : undefined}
                        aria-label={onItemClick ? `View details for ${item.title}` : undefined}
                        style={{ cursor: onItemClick ? 'pointer' : 'default' }}
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
