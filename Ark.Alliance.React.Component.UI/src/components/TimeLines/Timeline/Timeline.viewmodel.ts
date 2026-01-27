/**
 * @fileoverview Timeline Component ViewModel
 * @module components/TimeLines/Timeline
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TimelineModel, TimelineItem } from './Timeline.model';
import { defaultTimelineModel, TimelineModelSchema } from './Timeline.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseTimelineOptions extends Partial<TimelineModel> { }

export interface UseTimelineResult extends BaseViewModelResult<TimelineModel> {
    /** Items after filtering */
    filteredItems: TimelineItem[];
    /** Handle item edit */
    handleItemEdit: (item: TimelineItem) => void;
    /** Current timeline items */
    items: TimelineItem[];
    /** CSS classes for the timeline container */
    timelineClasses: string;
    /** IDs of newly added items (for animation) */
    newItemIds: Set<string>;
    /** Add a new item to the timeline */
    addItem: (item: TimelineItem) => void;
    /** Add multiple items to the timeline */
    addItems: (items: TimelineItem[]) => void;
    /** Remove an item by ID */
    removeItem: (id: string) => void;
    /** Clear all items */
    clearItems: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useTimeline(options: UseTimelineOptions = {}): UseTimelineResult {
    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return TimelineModelSchema.parse({ ...defaultTimelineModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    const base = useBaseViewModel<TimelineModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'timeline',
    });

    // Local state for items (allows real-time updates without re-parsing)
    const [items, setItems] = useState<TimelineItem[]>(base.model.items);
    const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());

    // Sync items when model changes
    useEffect(() => {
        setItems(base.model.items);
    }, [base.model.items]);

    // Clear new item IDs after animation duration
    useEffect(() => {
        if (newItemIds.size > 0 && base.model.animateNewItems) {
            const timer = setTimeout(() => {
                setNewItemIds(new Set());
            }, 500); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [newItemIds, base.model.animateNewItems]);

    /**
     * Add a new item to the timeline with auto-trim support
     */
    const addItem = useCallback((item: TimelineItem) => {
        setItems(prev => {
            const newItems = [...prev, item];
            // Auto-trim if maxItems is set
            const maxItems = base.model.maxItems;
            if (maxItems > 0 && newItems.length > maxItems) {
                return newItems.slice(-maxItems);
            }
            return newItems;
        });
        // Track for animation
        if (base.model.animateNewItems) {
            setNewItemIds(prev => new Set([...prev, item.id]));
        }
    }, [base.model.maxItems, base.model.animateNewItems]);

    /**
     * Add multiple items at once
     */
    const addItems = useCallback((newItemsToAdd: TimelineItem[]) => {
        setItems(prev => {
            const newItems = [...prev, ...newItemsToAdd];
            const maxItems = base.model.maxItems;
            if (maxItems > 0 && newItems.length > maxItems) {
                return newItems.slice(-maxItems);
            }
            return newItems;
        });
        if (base.model.animateNewItems) {
            setNewItemIds(prev => new Set([...prev, ...newItemsToAdd.map(i => i.id)]));
        }
    }, [base.model.maxItems, base.model.animateNewItems]);

    /**
     * Remove an item by ID
     */
    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    /**
     * Clear all items
     */
    const clearItems = useCallback(() => {
        setItems([]);
        setNewItemIds(new Set());
    }, []);

    // ═══════════════════════════════════════════════════════════════════════════
    // FILTERING LOGIC
    // ═══════════════════════════════════════════════════════════════════════════

    const filteredItems = useMemo(() => {
        let result = items;

        // Filter by category
        if (base.model.selectedCategory) {
            result = result.filter(item => item.category === base.model.selectedCategory);
        }

        // Filter by text search (title, description, tags)
        if (base.model.filter) {
            const query = base.model.filter.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query) ||
                item.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return result;
    }, [items, base.model.selectedCategory, base.model.filter]);

    /**
     * Handle item edit (passthrough)
     */
    const handleItemEdit = useCallback((item: TimelineItem) => {
        // Typically passed via options/props, but we expose a handler here
        // The View will call this, and we might emit an event or call a callback from options if we stored it
        // Since options are not stored in full in base (only model), we need to access via closure if stable,
        // or just return a placeholder if we expect the View to handle the prop directly.
        // However, standard MVVM usually wraps it.
        // For now, let's emit an event.
        base.emit('edit', { item });
    }, [base]);

    const timelineClasses = useMemo(() => {
        const classes = ['ark-timeline', `ark-timeline--${base.model.orientation}`];
        if (base.model.showConnectors) classes.push('ark-timeline--connectors');
        if (base.model.animateNewItems) classes.push('ark-timeline--animated');
        if (base.model.adminMode) classes.push('ark-timeline--admin');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model]);

    return {
        ...base,
        items, // Raw items
        filteredItems, // Display items
        timelineClasses,
        newItemIds,
        addItem,
        addItems,
        removeItem,
        clearItems,
        handleItemEdit
    };
}

export default useTimeline;

