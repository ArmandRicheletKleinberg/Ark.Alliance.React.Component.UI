/**
 * @fileoverview Carousel Component View
 * @module components/Slides/Carousel
 */

import { forwardRef, memo, ReactNode, Children } from 'react';
import { useCarousel, type UseCarouselOptions } from './Carousel.viewmodel';
import { Icon } from '../../Icon';
import './Carousel.styles.css';

export interface CarouselProps extends Omit<UseCarouselOptions, 'count'> {
    className?: string;
    children?: ReactNode;
}

export const Carousel = memo(forwardRef<HTMLDivElement, CarouselProps>((props, ref) => {
    const {
        className = '',
        children,
        ...options
    } = props;

    const count = Children.count(children);
    const vm = useCarousel({ ...options, count });

    if (count === 0) return null;

    return (
        <div
            ref={ref}
            className={`${vm.carouselClasses} ${className}`}
            data-testid={vm.model.testId}
            onMouseEnter={vm.handleMouseEnter}
            onMouseLeave={vm.handleMouseLeave}
            role="region"
            aria-label="Carousel"
        >
            {/* Viewport & Track */}
            <div className="ark-carousel__viewport">
                <div className="ark-carousel__track" style={vm.trackStyle}>
                    {Children.map(children, (child, index) => (
                        <div
                            className={`ark-carousel__item ${index === vm.activeIndex ? 'active' : ''}`}
                            aria-hidden={index !== vm.activeIndex}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            {vm.model.showControls && count > 1 && (
                <>
                    <button
                        className="ark-carousel__control ark-carousel__control--prev"
                        onClick={vm.prev}
                        aria-label="Previous slide"
                    >
                        <Icon name="chevron-left" size="sm" />
                    </button>
                    <button
                        className="ark-carousel__control ark-carousel__control--next"
                        onClick={vm.next}
                        aria-label="Next slide"
                    >
                        <Icon name="chevron-right" size="sm" />
                    </button>
                </>
            )}

            {/* Indicators */}
            {vm.model.showIndicators && count > 1 && (
                <div className="ark-carousel__indicators">
                    {Children.map(children, (_, index) => (
                        <button
                            key={index}
                            className={`ark-carousel__indicator ${index === vm.activeIndex ? 'ark-carousel__indicator--active' : ''}`}
                            onClick={() => vm.goTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === vm.activeIndex}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}));

Carousel.displayName = 'Carousel';
