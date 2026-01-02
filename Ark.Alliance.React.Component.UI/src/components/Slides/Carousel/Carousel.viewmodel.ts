/**
 * @fileoverview Carousel ViewModel
 * @module components/Slides/Carousel
 */

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { CarouselModel } from './Carousel.model';
import { createCarouselModel } from './Carousel.model';

export interface UseCarouselOptions extends Partial<CarouselModel> {
    /** Callback when slide changes */
    onChange?: (index: number) => void;
    /** Number of items (to calculate loop) */
    count: number;
}

export interface UseCarouselResult extends BaseViewModelResult<CarouselModel> {
    activeIndex: number;
    goTo: (index: number) => void;
    next: () => void;
    prev: () => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    carouselClasses: string;
    trackStyle: React.CSSProperties;
}

export function useCarousel(options: UseCarouselOptions): UseCarouselResult {
    const { onChange, count, ...modelData } = options;

    const modelOptions = useMemo(() => {
        return createCarouselModel(modelData);
    }, [modelData]);

    const base = useBaseViewModel<CarouselModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'carousel',
    });

    // State
    const [activeIndex, setActiveIndex] = useState(base.model.activeIndex);
    const [isPaused, setIsPaused] = useState(false);

    // Refs for timer
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync props
    useEffect(() => {
        if (base.model.activeIndex !== undefined) {
            setActiveIndex(base.model.activeIndex);
        }
    }, [base.model.activeIndex]);

    // Navigation Logic
    const goTo = useCallback((index: number) => {
        let target = index;
        if (target < 0) {
            target = base.model.loop ? count - 1 : 0;
        } else if (target >= count) {
            target = base.model.loop ? 0 : count - 1;
        }

        setActiveIndex(target);
        onChange?.(target);
        base.emit('change', { index: target });
    }, [count, base, onChange, base.model.loop]);

    const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
    const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

    // Autoplay
    useEffect(() => {
        if (base.model.autoplay && !isPaused && count > 1) {
            timerRef.current = setInterval(() => {
                next();
            }, base.model.interval);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [base.model.autoplay, base.model.interval, isPaused, count, next]);

    // Handlers
    const handleMouseEnter = useCallback(() => {
        if (base.model.pauseOnHover) setIsPaused(true);
    }, [base.model.pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
        if (base.model.pauseOnHover) setIsPaused(false);
    }, [base.model.pauseOnHover]);

    // Styles
    const carouselClasses = useMemo(() => {
        const classes = ['ark-carousel'];
        if (base.model.isDark) classes.push('ark-carousel--dark');
        classes.push(`ark-carousel--${base.model.effect}`);
        if (base.model.size) classes.push(`ark-carousel--${base.model.size}`);
        return classes.join(' ');
    }, [base.model.isDark, base.model.effect, base.model.size]);

    const trackStyle = useMemo(() => {
        if (base.model.effect === 'slide') {
            return { transform: `translateX(-${activeIndex * 100}%)` };
        }
        return {};
    }, [base.model.effect, activeIndex]);

    return {
        ...base,
        activeIndex,
        goTo,
        next,
        prev,
        handleMouseEnter,
        handleMouseLeave,
        carouselClasses,
        trackStyle
    };
}
