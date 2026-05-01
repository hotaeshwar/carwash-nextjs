'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Footer from '../components/Footer';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Charles Morgan",
      review: "Great personal service! Phenomenal job! Exceeded all expectations! I would highly recommend Action Car Detailing!",
      rating: 5
    },
    {
      id: 2,
      name: "Nav Boparai",
      review: "Awesome service. Quality service. Experienced staff. Meet my expectations 👌",
      rating: 5
    },
    {
      id: 3,
      name: "Thiané Diop",
      review: "Very accommodating to my time restrictions and did a spotless job. The car looks fantastic inside and out!",
      rating: 5
    },
    {
      id: 4,
      name: "Michael Singson",
      review: "Great work. Everything was done as promised. Very accommodating and great customer relationship. Kudos to Bal and his staff! :)",
      rating: 5
    },
    {
      id: 5,
      name: "Dana Coulson",
      review: "Went above and beyond my expectations. Did an amazing job and very reasonably priced!! Great customer service as well, would highly recommend bringing your vehicle here!",
      rating: 5
    },
    {
      id: 6,
      name: "Chee Tan",
      review: "Highly recommended for anyone. Staff is extremely polite and courteous. Takes pride and their work and prices are reasonable. Can't go wrong with a clean and detailed car... and fast service too!",
      rating: 5
    },
    {
      id: 7,
      name: "Adam Kennedy",
      review: "My car is absolutely spotless and well worth the cost. The owner/employee is very pleasant. Would highly recommend this business especially in comparison to other establishments, definitely going back!",
      rating: 5
    },
    {
      id: 8,
      name: "Sarah Johnson",
      review: "Exceptional service and prices are very affordable as compared to others. Had my carpets and Engine shampooed in past as well but with Action Car detailing it looks like brand new. Owner and employees are very kind and friendly. Highly recommend this place.",
      rating: 5
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev >= testimonials.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
          index < rating ? 'text-yellow-400' : 'text-white/40'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev >= testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev <= 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Fixed padding to avoid navbar overlap - moved more towards center */}
      <div className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-8 sm:pb-12">
        
        {/* Container with proper responsive padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Header Section - Moved to center with more spacing */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="space-y-4 sm:space-y-6">
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1393c4] tracking-wide uppercase">
                TESTIMONIALS
              </h1>
              
              {/* Subheading */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1393c4]/80 tracking-wide">
                Where Every Detail Counts
              </h2>
              
              {/* Decorative Line */}
              <div className="flex justify-center items-center space-x-4 sm:space-x-6 mt-6 sm:mt-8">
                <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 bg-[#1393c4]/60"></div>
                <div className="w-3 h-3 bg-[#1393c4] rounded-full"></div>
                <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 bg-[#1393c4]/60"></div>
              </div>
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative mb-8 sm:mb-12">
            
            {/* Navigation Buttons - Hidden on mobile, visible on larger screens */}
            <button
              onClick={prevSlide}
              className="hidden md:block absolute left-4 lg:-left-16 top-1/2 -translate-y-1/2 z-10 bg-[#1393c4] text-white p-2 lg:p-3 rounded-full shadow-lg hover:bg-[#0f7ca8] transition-colors duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="hidden md:block absolute right-4 lg:-right-16 top-1/2 -translate-y-1/2 z-10 bg-[#1393c4] text-white p-2 lg:p-3 rounded-full shadow-lg hover:bg-[#0f7ca8] transition-colors duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className="flex-shrink-0 w-full flex justify-center px-2 sm:px-4"
                  >
                    <div className="bg-gradient-to-br from-[#1393c4] to-[#0f7ca8] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 transform hover:-translate-y-2 w-full max-w-md mx-auto">
                      
                      {/* Quote Icon */}
                      <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                          <svg 
                            className="w-6 h-6 sm:w-7 sm:h-7 text-[#1393c4]" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="mb-6">
                        <p className="text-white text-base sm:text-lg leading-relaxed text-center italic font-medium min-h-[100px] sm:min-h-[120px] flex items-center justify-center">
                          "{testimonial.review}"
                        </p>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex justify-center mb-6">
                        <div className="flex space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>

                      {/* Customer Name and Verification */}
                      <div className="text-center">
                        <h3 className="font-bold text-white text-xl sm:text-2xl mb-4">
                          {testimonial.name}
                        </h3>
                        <div className="inline-block">
                          <p className="text-white text-sm sm:text-base font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                            ✓ Verified Customer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="flex md:hidden justify-center space-x-4 mt-6">
              <button
                onClick={prevSlide}
                className="bg-[#1393c4] text-white p-3 rounded-full shadow-lg hover:bg-[#0f7ca8] transition-colors duration-300 active:scale-95"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="bg-[#1393c4] text-white p-3 rounded-full shadow-lg hover:bg-[#0f7ca8] transition-colors duration-300 active:scale-95"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    currentSlide === index 
                      ? 'bg-[#1393c4] scale-125' 
                      : 'bg-[#1393c4]/30 hover:bg-[#1393c4]/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Testimonials;