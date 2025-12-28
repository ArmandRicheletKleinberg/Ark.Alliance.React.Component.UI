/**
 * @fileoverview Event Bus System
 * @module core/events/EventBus
 * 
 * Provides cross-component communication through a publish/subscribe pattern.
 * Components can emit events and subscribe to events from other components
 * without direct coupling.
 */

import { useCallback, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Component event structure
 */
export interface ComponentEvent<T = unknown> {
    /** Event type identifier */
    type: string;

    /** Event payload */
    payload: T;

    /** Timestamp when event was created */
    timestamp: number;

    /** Source component/channel identifier */
    source?: string;

    /** Optional correlation ID for tracking */
    correlationId?: string;
}

/**
 * Event handler function type
 */
export type EventHandler<T = unknown> = (event: ComponentEvent<T>) => void;

/**
 * Subscription handle for cleanup
 */
export interface Subscription {
    unsubscribe: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT BUS CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Global event bus for cross-component communication.
 * Implements the Singleton pattern to ensure a single event bus instance.
 */
class EventBus {
    private static instance: EventBus;
    private handlers: Map<string, Set<EventHandler<any>>>;
    private eventHistory: ComponentEvent[];
    private maxHistorySize: number;

    private constructor() {
        this.handlers = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 100;
    }

    /**
     * Get the singleton instance
     */
    static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    /**
     * Subscribe to an event type
     */
    subscribe<T>(eventType: string, handler: EventHandler<T>): Subscription {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }

        this.handlers.get(eventType)!.add(handler);

        return {
            unsubscribe: () => {
                this.handlers.get(eventType)?.delete(handler);
            },
        };
    }

    /**
     * Emit an event
     */
    emit<T>(
        eventType: string,
        payload: T,
        options: { source?: string; correlationId?: string } = {}
    ): void {
        const event: ComponentEvent<T> = {
            type: eventType,
            payload,
            timestamp: Date.now(),
            source: options.source,
            correlationId: options.correlationId,
        };

        // Store in history
        this.eventHistory.push(event);
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }

        // Notify handlers
        const handlers = this.handlers.get(eventType);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(event);
                } catch (error) {
                    console.error(`[EventBus] Error in handler for ${eventType}:`, error);
                }
            });
        }

        // Also notify wildcard handlers
        const wildcardHandlers = this.handlers.get('*');
        if (wildcardHandlers) {
            wildcardHandlers.forEach(handler => {
                try {
                    handler(event);
                } catch (error) {
                    console.error(`[EventBus] Error in wildcard handler:`, error);
                }
            });
        }
    }

    /**
     * Get event history
     */
    getHistory(eventType?: string): ComponentEvent[] {
        if (eventType) {
            return this.eventHistory.filter(e => e.type === eventType);
        }
        return [...this.eventHistory];
    }

    /**
     * Clear all handlers and history
     */
    clear(): void {
        this.handlers.clear();
        this.eventHistory = [];
    }

    /**
     * Get count of handlers for an event type
     */
    getHandlerCount(eventType: string): number {
        return this.handlers.get(eventType)?.size || 0;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * React hook for using the event bus.
 * Automatically cleans up subscriptions on unmount.
 * 
 * @param channel - Optional channel prefix for namespacing events
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { emit, subscribe } = useEventBus('myComponent');
 *   
 *   useEffect(() => {
 *     const unsub = subscribe('dataLoaded', (event) => {
 *       console.log('Data loaded:', event.payload);
 *     });
 *     return unsub;
 *   }, [subscribe]);
 *   
 *   const handleClick = () => {
 *     emit('buttonClicked', { id: 123 });
 *   };
 * }
 * ```
 */
export function useEventBus(channel?: string) {
    const eventBus = EventBus.getInstance();
    const subscriptionsRef = useRef<Subscription[]>([]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            subscriptionsRef.current.forEach(sub => sub.unsubscribe());
            subscriptionsRef.current = [];
        };
    }, []);

    /**
     * Emit an event (optionally prefixed with channel)
     */
    const emit = useCallback(<T,>(eventType: string, payload: T) => {
        const fullType = channel ? `${channel}:${eventType}` : eventType;
        eventBus.emit(fullType, payload, { source: channel });
    }, [eventBus, channel]);

    /**
     * Subscribe to an event (optionally prefixed with channel)
     */
    const subscribe = useCallback(<T,>(
        eventType: string,
        handler: EventHandler<T>
    ): (() => void) => {
        const fullType = channel ? `${channel}:${eventType}` : eventType;
        const subscription = eventBus.subscribe(fullType, handler);
        subscriptionsRef.current.push(subscription);

        return () => {
            subscription.unsubscribe();
            subscriptionsRef.current = subscriptionsRef.current.filter(
                s => s !== subscription
            );
        };
    }, [eventBus, channel]);

    /**
     * Subscribe to all events (wildcard)
     */
    const subscribeAll = useCallback(<T,>(handler: EventHandler<T>): (() => void) => {
        const subscription = eventBus.subscribe('*', handler);
        subscriptionsRef.current.push(subscription);

        return () => {
            subscription.unsubscribe();
            subscriptionsRef.current = subscriptionsRef.current.filter(
                s => s !== subscription
            );
        };
    }, [eventBus]);

    /**
     * Get event history
     */
    const getHistory = useCallback((eventType?: string) => {
        const fullType = eventType && channel ? `${channel}:${eventType}` : eventType;
        return eventBus.getHistory(fullType);
    }, [eventBus, channel]);

    return {
        emit,
        subscribe,
        subscribeAll,
        getHistory,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { EventBus };
export default useEventBus;
