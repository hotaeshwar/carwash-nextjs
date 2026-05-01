'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PerfectSolutionsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Changed: Videos now use public/videos path
  const videos = [
    {
      src: '/images/carwashing2.mp4',
      title: "Complete Exterior and Interior Detailing",
      description: "Professional Detailing services"
    },
    {
      src: '/images/Ceramic coating (1).mp4',
      title: "Ceramic Coating",
      description: "Long-lasting protection"
    },
    {
      src: '/images/carwashing4.mp4',
      title: "Professional Service",
      description: "Expert care for your vehicle"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, videos.length]);

  // Handle video playback when index changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Reset video to beginning
      video.load();
      
      // Play video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Play interrupted:', error);
        });
      }
    }
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="w-full bg-white py-8 md:py-12 lg:py-16 xl:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 tracking-wider leading-tight">
            <span style={{ color: '#1393c4' }} className="drop-shadow-lg">
              PERFECT SOLUTIONS FOR ALL VEHICLES
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-4 sm:mb-6" style={{ color: '#1393c4' }}>
            Professional care and protection for every type of vehicle
          </p>
          
          <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
            <div 
              className="w-20 sm:w-24 md:w-32 lg:w-40 h-1 sm:h-1.5 lg:h-2 rounded-full shadow-lg"
              style={{ 
                background: 'linear-gradient(to right, #1393c4, #0f7ba3, #0b6488)',
                boxShadow: '0 4px 15px rgba(19, 147, 196, 0.3)'
              }}
            />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Video Container */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                ref={videoRef}
                key={`video-${currentIndex}`}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="auto"
                webkit-playsinline="true"
              >
                <source src={videos[currentIndex].src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-3 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                aria-label="Previous video"
              >
                <ChevronLeft size={20} style={{ color: '#1393c4' }} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-3 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                aria-label="Next video"
              >
                <ChevronRight size={20} style={{ color: '#1393c4' }} />
              </button>
            </div>
          </div>

          {/* Video Information */}
          <div className="mt-4 sm:mt-6 text-center">
            <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#1393c4' }}>
              {videos[currentIndex].title}
            </h4>
            <p className="text-sm sm:text-base md:text-lg" style={{ color: '#1393c4' }}>
              {videos[currentIndex].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectSolutionsCarousel;