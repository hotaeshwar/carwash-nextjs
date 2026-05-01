'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';

const CardSliderCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);
  const intervalRef = useRef(null);
  const videoRefs = useRef([]);

  // Media items - using public/images path
  const mediaItems = [
    // All BEFORE images
    { src: '/images/before.jpg', type: "image" },
    { src: '/images/before1.jpg', type: "image" },
    { src: '/images/before2.jpg', type: "image" },
    { src: '/images/before3.jpg', type: "image" },
    { src: '/images/before21.JPG', type: "image" },
    { src: '/images/before22.JPG', type: "image" },
    { src: '/images/before23.jpg', type: "image" },
    { src: '/images/before24.jpg', type: "image" },
    { src: '/images/before25.JPG', type: "image" },
    { src: '/images/before26.JPG', type: "image" },
    { src: '/images/before27.JPG', type: "image" },
    { src: '/images/before28.JPG', type: "image" },
    { src: '/images/before29.JPG', type: "image" },
    { src: '/images/before30.JPG', type: "image" },
    { src: '/images/interiorbefore21.JPG', type: "image" },
    
    // All AFTER images
    { src: '/images/after4.jpg', type: "image" },
    { src: '/images/After21.JPG', type: "image" },
    
    // Toyota images
    { src: '/images/Toyota 4 Runner .JPG', type: "image" },
    { src: '/images/Toyota 4 Runner 1.JPG', type: "image" },
    { src: '/images/Toyota Highlander.JPG', type: "image" },
    { src: '/images/Toyota Tundra.JPG', type: "image" },
    { src: '/images/Toyota Tundra. 2.JPG', type: "image" }
  ];

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Calculate max slides
  const maxSlides = Math.max(0, mediaItems.length - cardsPerView);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    setCurrentSlide(Math.min(index, maxSlides));
  }, [maxSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide >= maxSlides ? 0 : prevSlide + 1));
  }, [maxSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide <= 0 ? maxSlides : prevSlide - 1));
  }, [maxSlides]);

  // Auto-advance slides
  useEffect(() => {
    if (isAutoPlay && mediaItems.length > cardsPerView) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, nextSlide, mediaItems.length, cardsPerView]);

  // Handle auto-play toggle
  const handleAutoPlayToggle = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === ' ') {
        event.preventDefault();
        handleAutoPlayToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle video play/pause when slide changes (removed since no videos)
  useEffect(() => {
    // No videos in this carousel, keeping for compatibility
  }, [currentSlide, cardsPerView]);

  return (
    <div className="py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1393c4] mb-2">Before & After Gallery</h2>
          <p className="text-[#1393c4]">See the transformation power of our car wash services</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {mediaItems.length > cardsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20
                           w-12 h-12 bg-white shadow-lg hover:shadow-xl
                           rounded-full flex items-center justify-center
                           border border-gray-200 hover:border-[#1393c4]
                           transition-all duration-300 hover:scale-110
                           focus:outline-none focus:ring-2 focus:ring-[#1393c4]"
                aria-label="Previous slides"
              >
                <ChevronLeft className="w-6 h-6 text-[#1393c4]" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20
                           w-12 h-12 bg-white shadow-lg hover:shadow-xl
                           rounded-full flex items-center justify-center
                           border border-gray-200 hover:border-[#1393c4]
                           transition-all duration-300 hover:scale-110
                           focus:outline-none focus:ring-2 focus:ring-[#1393c4]"
                aria-label="Next slides"
              >
                <ChevronRight className="w-6 h-6 text-[#1393c4]" />
              </button>

              {/* Auto-play Toggle */}
              <button
                onClick={handleAutoPlayToggle}
                className="absolute top-0 right-0 z-20
                           w-10 h-10 bg-white/90 hover:bg-white
                           rounded-full flex items-center justify-center
                           border border-gray-200 hover:border-[#1393c4]
                           transition-all duration-300 hover:scale-110
                           focus:outline-none focus:ring-2 focus:ring-[#1393c4]"
                aria-label={isAutoPlay ? "Pause slideshow" : "Play slideshow"}
              >
                {isAutoPlay ? (
                  <Pause className="w-4 h-4 text-[#1393c4]" />
                ) : (
                  <Play className="w-4 h-4 text-[#1393c4] ml-0.5" />
                )}
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / cardsPerView)}%)`
              }}
            >
              {mediaItems.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Media Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <Image
                        src={item.src}
                        alt={`Car wash gallery image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {mediaItems.length > cardsPerView && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1393c4] focus:ring-offset-2 ${
                    currentSlide === index
                      ? 'w-8 h-3 bg-[#1393c4]'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          {mediaItems.length > cardsPerView && (
            <div className="text-center mt-4">
              <span className="text-sm text-gray-500">
                {currentSlide + 1} of {maxSlides + 1} • {mediaItems.length} total images
              </span>
            </div>
          )}
        </div>

        {/* Navigation Hint */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Use arrow keys to navigate • Space to pause/play
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardSliderCarousel;