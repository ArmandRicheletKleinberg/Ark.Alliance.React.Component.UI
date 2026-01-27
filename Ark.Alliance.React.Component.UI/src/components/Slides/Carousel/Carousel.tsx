/**
 * @fileoverview Enhanced Carousel Component View
 * @module components/Slides/Carousel
 * 
 * Premium carousel with autoplay, keyboard nav, touch support, and accessibility.
 * Supports both data-driven slides and children-based content.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { forwardRef, memo, ReactNode, Children } from 'react';
import { useCarousel, type UseCarouselOptions } from './Carousel.viewmodel';
import { Icon } from '../../Icon';
import type { CarouselSlide } from './Carousel.model';
import './Carousel.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CarouselProps extends Omit<UseCarouselOptions, 'count'> {
    className?: string;
    /** Children (legacy mode) or null (data-driven mode) */
    children?: ReactNode;
    /** Data-driven slides */
    slides?: CarouselSlide[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CarouselSkeleton = () => (
    <div className="ark-carousel__skeleton" aria-busy="true">
        <div className="ark-carousel__skeleton-content">
            <div className="ark-carousel__skeleton-subtitle skeleton" />
            <div className="ark-carousel__skeleton-title skeleton" />
            <div className="ark-carousel__skeleton-description skeleton" />
            <div className="ark-carousel__skeleton-description skeleton" />
            <div className="ark-carousel__skeleton-button skeleton" />
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Carousel = memo(forwardRef<HTMLDivElement, CarouselProps>((props, ref) => {
    const {
        className = '',
        children,
        slides,
        ...options
    } = props;

    // Determine mode: data-driven (slides) or children-based
    const isDataDriven = Boolean(slides && slides.length > 0);
    const childCount = Children.count(children);
    const count = isDataDriven ? slides!.length : childCount;

    const vm = useCarousel({
        ...options,
        slides,
        count
    });

    // Loading state
    if (vm.model.isLoading || count === 0) {
        return <CarouselSkeleton />;
    }

    return (
        <div
            ref={ref}
            className={`${vm.carouselClasses} ${className}`}
            data-testid={vm.model.testId}
            onMouseEnter={vm.handleMouseEnter}
            onMouseLeave={vm.handleMouseLeave}
            onFocus={vm.handleFocus}
            onBlur={vm.handleBlur}
            onKeyDown={vm.handleKeyDown}
            onTouchStart={vm.handleTouchStart}
            onTouchEnd={vm.handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="Content carousel"
            tabIndex={0}
        >
            {/* Slides Container */}
            <div className="ark-carousel__viewport">
                <div className="ark-carousel__track" style={vm.trackStyle}>
                    {isDataDriven ? (
                        // Data-driven mode: render slide objects
                        slides!.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`ark-carousel__item ${index === vm.activeIndex ? 'active' : ''}`}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={slide.ariaLabel || `Slide ${index + 1} of ${count}: ${slide.title}`}
                                aria-hidden={index !== vm.activeIndex}
                            >
                                <div className="ark-carousel__slide-inner">
                                    {/* Background Image */}
                                    {slide.imageUrl && (
                                        <div className="ark-carousel__bg">
                                            <img
                                                src={slide.imageUrl}
                                                alt=""
                                                className="ark-carousel__bg-image"
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                            />
                                        </div>
                                    )}

                                    {/* Slide Content */}
                                    <div className="ark-carousel__content">
                                        {slide.subtitle && (
                                            <p className="ark-carousel__subtitle">{slide.subtitle}</p>
                                        )}
                                        <h2 className="ark-carousel__title">
                                            {slide.title.split(' ').map((word, i) => (
                                                i === 0 ? <span key={i} className="ark-carousel__title-highlight">{word} </span> : word + ' '
                                            ))}
                                        </h2>
                                        {slide.description && (
                                            <p className="ark-carousel__description">{slide.description}</p>
                                        )}
                                        {slide.ctaLink && (
                                            <a href={slide.ctaLink} className="ark-carousel__cta">
                                                {slide.ctaLabel || 'Learn More'}
                                                <Icon name="arrow-right" size="sm" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Children-based mode: render children
                        Children.map(children, (child, index) => (
                            <div
                                key={index}
                                className={`ark-carousel__item ${index === vm.activeIndex ? 'active' : ''}`}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`Slide ${index + 1} of ${count}`}
                                aria-hidden={index !== vm.activeIndex}
                            >
                                {child}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Navigation Controls */}
            {vm.model.showControls && count > 1 && (
                <>
                    <button
                        className="ark-carousel__control ark-carousel__control--prev"
                        onClick={vm.prev}
                        aria-label="Previous slide"
                        type="button"
                    >
                        <Icon name="chevron-left" size="sm" />
                    </button>
                    <button
                        className="ark-carousel__control ark-carousel__control--next"
                        onClick={vm.next}
                        aria-label="Next slide"
                        type="button"
                    >
                        <Icon name="chevron-right" size="sm" />
                    </button>
                </>
            )}

            {/* Indicators (Dots) */}
            {vm.model.showIndicators && count > 1 && (
                <div className="ark-carousel__indicators" role="tablist" aria-label="Slide navigation">
                    {Array.from({ length: count }).map((_, index) => (
                        <button
                            key={index}
                            className={`ark-carousel__indicator ${index === vm.activeIndex ? 'ark-carousel__indicator--active' : ''}`}
                            onClick={() => vm.goTo(index)}
                            role="tab"
                            aria-selected={index === vm.activeIndex}
                            aria-label={`Go to slide ${index + 1}`}
                            type="button"
                        />
                    ))}
                </div>
            )}

            {/* Play/Pause Button */}
            {vm.model.showPlayback && vm.model.autoplay && count > 1 && (
                <div className="ark-carousel__playback">
                    <button
                        className="ark-carousel__playback-btn"
                        onClick={vm.togglePlay}
                        aria-label={vm.isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        type="button"
                    >
                        {vm.isPlaying ? (
                            <Icon name="pause" size="sm" />
                        ) : (
                            <Icon name="play" size="sm" />
                        )}
                    </button>
                </div>
            )}

            {/* Progress Bar */}
            {vm.model.showProgress && vm.isPlaying && !vm.isInteracting && (
                <div className="ark-carousel__progress">
                    <div
                        className="ark-carousel__progress-bar"
                        key={vm.activeIndex}
                        style={{ animationDuration: `${vm.model.interval}ms` }}
                    />
                </div>
            )}

            {/* ARIA Live Region for Announcements */}
            <div
                className="ark-carousel__announcer"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {isDataDriven && vm.currentSlide ? (
                    `Slide ${vm.activeIndex + 1} of ${count}: ${vm.currentSlide.title}`
                ) : (
                    `Slide ${vm.activeIndex + 1} of ${count}`
                )}
            </div>
        </div>
    );
}));

Carousel.displayName = 'Carousel';
export default Carousel;
