import React, { useState, useEffect } from 'react';
// import { Carousel, CarouselModel, CarouselSlide } from 'ark-alliance-react-ui'; // Not exported yet

interface CarouselWrapperProps {
    slideSet: 'hero' | 'products' | 'testimonials';
}

const slideData = {
    hero: [
        { id: '1', title: 'Welcome to Ark Alliance', imageUrl: 'https://picsum.photos/800/400?random=1' },
        { id: '2', title: 'React Components', imageUrl: 'https://picsum.photos/800/400?random=2' },
        { id: '3', title: 'TypeScript First', imageUrl: 'https://picsum.photos/800/400?random=3' }
    ],
    products: [
        { id: 'p1', title: 'Premium Dashboard', imageUrl: 'https://picsum.photos/800/400?random=4' },
        { id: 'p2', title: 'Trading Terminal', imageUrl: 'https://picsum.photos/800/400?random=5' }
    ],
    testimonials: [
        { id: 't1', title: 'Amazing Library', imageUrl: 'https://picsum.photos/800/400?random=6' },
        { id: 't2', title: 'Incredible Performance', imageUrl: 'https://picsum.photos/800/400?random=7' }
    ]
};

export const CarouselWrapper: React.FC<CarouselWrapperProps> = ({
    slideSet = 'hero',
}) => {
    const slides = slideData[slideSet];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-lg border border-ark-border/30 bg-ark-bg-secondary/20">
            {/* Slide Images */}
            <div className="relative h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                            <h3 className="text-white text-2xl font-bold">{slide.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
                ‹
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
                ›
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50 hover:bg-white/70'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
