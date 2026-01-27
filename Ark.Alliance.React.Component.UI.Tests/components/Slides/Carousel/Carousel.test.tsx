/**
 * @fileoverview Carousel Component Tests
 */

import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Carousel } from '../../../../Ark.Alliance.React.Component.UI/src/components/Slides/Carousel';
import { renderWithProviders } from '../../../setup';

describe('Carousel', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render children slides', () => {
        renderWithProviders(
            <Carousel count={2}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </Carousel>
        );
        expect(screen.getByText('Slide 1')).toBeInTheDocument();
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });

    it('should navigate next/prev', () => {
        renderWithProviders(
            <Carousel count={2}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </Carousel>
        );

        const nextBtn = screen.getByLabelText('Next slide');
        fireEvent.click(nextBtn);

        // Active index should affect styling, but we might check props or class
        // Our implementation sets 'active' class on item
        const slides = screen.getAllByText(/Slide/);
        // Slide 2 (index 1) should be active
        expect(slides[1].closest('.ark-carousel__item')).toHaveClass('active');
        expect(slides[0].closest('.ark-carousel__item')).not.toHaveClass('active');

        // Go back
        const prevBtn = screen.getByLabelText('Previous slide');
        fireEvent.click(prevBtn);
        expect(slides[0].closest('.ark-carousel__item')).toHaveClass('active');
    });

    it('should loop navigation', () => {
        renderWithProviders(
            <Carousel count={2} loop={true}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </Carousel>
        );

        const prevBtn = screen.getByLabelText('Previous slide');
        fireEvent.click(prevBtn); // Should go to last (Slide 2)

        const slides = screen.getAllByText(/Slide/);
        expect(slides[1].closest('.ark-carousel__item')).toHaveClass('active');

        const nextBtn = screen.getByLabelText('Next slide');
        fireEvent.click(nextBtn); // Should go to first (Slide 1)
        expect(slides[0].closest('.ark-carousel__item')).toHaveClass('active');
    });

    it('should autoplay', () => {
        renderWithProviders(
            <Carousel count={2} autoplay={true} interval={1000}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </Carousel>
        );

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        const slides = screen.getAllByText(/Slide/);
        expect(slides[1].closest('.ark-carousel__item')).toHaveClass('active');
    });

    it('should pause on hover', () => {
        renderWithProviders(
            <Carousel count={2} autoplay={true} interval={1000} pauseOnHover={true}>
                <div>Slide 1</div>
                <div>Slide 2</div>
            </Carousel>
        );

        const container = screen.getByLabelText('Content carousel');
        fireEvent.mouseEnter(container);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Should NOT have moved
        const slides = screen.getAllByText(/Slide/);
        expect(slides[0].closest('.ark-carousel__item')).toHaveClass('active');

        fireEvent.mouseLeave(container);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Should have moved
        expect(slides[1].closest('.ark-carousel__item')).toHaveClass('active');
    });
});
