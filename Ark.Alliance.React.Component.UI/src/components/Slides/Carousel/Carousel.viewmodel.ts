/**
 * @fileoverview Enhanced Carousel ViewModel
 * @module components/Slides/Carousel
 * 
 * Enhanced viewmodel with touch gestures, keyboard navigation,
 * playback controls, and improved accessibility.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { CarouselModel, CarouselSlide } from './Carousel.model';
import { createCarouselModel } from './Carousel.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseCarouselOptions extends Partial<CarouselModel> {
    /** Callback when slide changes */
    onChange?: (index: number) => void;
    /** Slides data (for data-driven mode) */
    slides?: CarouselSlide[];
    /** Number of items (for children-based mode) */
    count?: number;
}

export interface UseCarouselResult extends BaseViewModelResult<CarouselModel> {
    activeIndex: number;
    isPlaying: boolean;
    isInteracting: boolean;
    currentSlide?: CarouselSlide;
    totalSlides: number;

    // Navigation
    goTo: (index: number) => void;
    next: () => void;
    prev: () => void;

    // Playback
    togglePlay: () => void;
    pause: () => void;
    resume: () => void;

    // Event Handlers
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleFocus: () => void;
    handleBlur: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;

    // Styles
    carouselClasses: string;
    trackStyle: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useCarousel(options: UseCarouselOptions): UseCarouselResult {
    const { onChange, slides, count, ...modelData } = options;

    // Create model
    const modelOptions = useMemo(() => {
        return createCarouselModel(modelData);
    }, [modelData]);

    const base = useBaseViewModel<CarouselModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'carousel',
    });

    // Calculate total slides
    const totalSlides = slides?.length || count || 0;

    // State
    const [activeIndex, setActiveIndex] = useState(base.model.activeIndex);
    const [isPlaying, setIsPlaying] = useState(base.model.autoplay);
    const [isInteracting, setIsInteracting] = useState(false);

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartX = useRef<number>(0);

    // Sync with props
    useEffect(() => {
        if (base.model.activeIndex !== undefined) {
            setActiveIndex(base.model.activeIndex);
        }
    }, [base.model.activeIndex]);

    // ───────────────────────────────────────────────────────────────────────
    // Navigation Logic
    // ───────────────────────────────────────────────────────────────────────

    const goTo = useCallback((index: number) => {
        let target = index;
        if (target < 0) {
            target = base.model.loop ? totalSlides - 1 : 0;
        } else if (target >= totalSlides) {
            target = base.model.loop ? 0 : totalSlides - 1;
        }

        setActiveIndex(target);
        onChange?.(target);
        base.emit('change', { index: target });
    }, [totalSlides, base, onChange, base.model.loop]);

    const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
    const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

    // ───────────────────────────────────────────────────────────────────────
    // Playback Controls
    // ───────────────────────────────────────────────────────────────────────

    const clearAutoplayTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
        clearAutoplayTimer();
    }, [clearAutoplayTimer]);

    const resume = useCallback(() => {
        setIsPlaying(true);
    }, []);

    // Autoplay effect
    useEffect(() => {
        if (isPlaying && !isInteracting && totalSlides > 1) {
            timerRef.current = setInterval(() => {
                next();
            }, base.model.interval);
        } else {
            clearAutoplayTimer();
        }

        return clearAutoplayTimer;
    }, [isPlaying, isInteracting, totalSlides, base.model.interval, next, clearAutoplayTimer]);

    // ───────────────────────────────────────────────────────────────────────
    // Interaction Handlers
    // ───────────────────────────────────────────────────────────────────────

    const handleMouseEnter = useCallback(() => {
        if (base.model.pauseOnInteraction || base.model.pauseOnHover) {
            setIsInteracting(true);
        }
    }, [base.model.pauseOnInteraction, base.model.pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
        if (base.model.pauseOnInteraction || base.model.pauseOnHover) {
            setIsInteracting(false);
        }
    }, [base.model.pauseOnInteraction, base.model.pauseOnHover]);

    const handleFocus = useCallback(() => {
        if (base.model.pauseOnInteraction) {
            setIsInteracting(true);
        }
    }, [base.model.pauseOnInteraction]);

    const handleBlur = useCallback(() => {
        if (base.model.pauseOnInteraction) {
            setIsInteracting(false);
        }
    }, [base.model.pauseOnInteraction]);

    // ───────────────────────────────────────────────────────────────────────
    // Keyboard Navigation
    // ───────────────────────────────────────────────────────────────────────

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!base.model.enableKeyboard) return;

        switch (e.key) {
            case 'ArrowLeft':
            case 'Left':
                e.preventDefault();
                prev();
                break;
            case 'ArrowRight':
            case 'Right':
                e.preventDefault();
                next();
                break;
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                togglePlay();
                break;
            case 'Escape':
                e.preventDefault();
                pause();
                break;
            case 'Home':
                e.preventDefault();
                goTo(0);
                break;
            case 'End':
                e.preventDefault();
                goTo(totalSlides - 1);
                break;
        }
    }, [base.model.enableKeyboard, prev, next, togglePlay, pause, goTo, totalSlides]);

    // ───────────────────────────────────────────────────────────────────────
    // Touch Gestures
    // ───────────────────────────────────────────────────────────────────────

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (!base.model.enableGestures) return;

        touchStartX.current = e.touches[0].clientX;

        if (base.model.pauseOnInteraction) {
            setIsInteracting(true);
        }
    }, [base.model.enableGestures, base.model.pauseOnInteraction]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!base.model.enableGestures) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > base.model.swipeThreshold) {
            if (diff > 0) {
                next(); // Swiped left, go next
            } else {
                prev(); // Swiped right, go prev
            }
        }

        if (base.model.pauseOnInteraction) {
            setIsInteracting(false);
        }
    }, [base.model.enableGestures, base.model.swipeThreshold, base.model.pauseOnInteraction, next, prev]);

    // ───────────────────────────────────────────────────────────────────────
    // Computed Values
    // ───────────────────────────────────────────────────────────────────────

    const carouselClasses = useMemo(() => {
        const classes = ['ark-carousel'];

        if (base.model.isDark) classes.push('ark-carousel--dark');
        if (base.model.isLoading) classes.push('ark-carousel--loading');
        if (isPlaying) classes.push('ark-carousel--playing');

        classes.push(`ark-carousel--${base.model.effect}`);
        classes.push(`ark-carousel--${base.model.size}`);

        return classes.join(' ');
    }, [base.model.isDark, base.model.isLoading, base.model.effect, base.model.size, isPlaying]);

    const trackStyle = useMemo(() => {
        if (base.model.effect === 'slide') {
            return {
                transform: `translateX(-${activeIndex * 100}%)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            };
        }
        return {};
    }, [base.model.effect, activeIndex]);

    const currentSlide = slides?.[activeIndex];

    // ───────────────────────────────────────────────────────────────────────
    // Return
    // ───────────────────────────────────────────────────────────────────────

    return {
        ...base,
        activeIndex,
        isPlaying,
        isInteracting,
        currentSlide,
        totalSlides,
        goTo,
        next,
        prev,
        togglePlay,
        pause,
        resume,
        handleMouseEnter,
        handleMouseLeave,
        handleFocus,
        handleBlur,
        handleKeyDown,
        handleTouchStart,
        handleTouchEnd,
        carouselClasses,
        trackStyle,
    };
}
