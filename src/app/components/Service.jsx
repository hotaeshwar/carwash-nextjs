'use client';

import React from 'react';
import ChooseYourService from './Chooseyourservice';
import QualityService from './QualityService';
import BusinessDescription from './BusinessDescription';
import PerfectSolutionsCarousel from './PerfectSolutionsCarousel';
import CarDetailing from './CarDetailing';

// Banner Component for Free Paint Evaluation - Reduced spacing
const FreePaintEvaluationBanner = () => {
  return (
    <div className="w-full bg-white py-4 md:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section - Reduced margins */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 tracking-wider leading-tight">
            <span style={{ color: '#1393c4' }} className="drop-shadow-lg">
              FREE PAINT EVALUATION & ESTIMATE
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2 sm:mb-3" style={{ color: '#1393c4' }}>
            Professional assessment of your vehicle's paint condition - absolutely free!
          </p>
          
          {/* Decorative underline */}
          <div className="flex justify-center mt-2 sm:mt-3 lg:mt-4">
            <div 
              className="w-20 sm:w-24 md:w-32 lg:w-40 h-1 sm:h-1.5 lg:h-2 rounded-full shadow-lg"
              style={{ 
                background: 'linear-gradient(to right, #1393c4, #0f7ba3, #0b6488)',
                boxShadow: '0 4px 15px rgba(19, 147, 196, 0.3)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Service = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Choose Your Service Section - No wrapper padding, let component handle its own */}
      <ChooseYourService setCurrentView={setCurrentView} />
      
      {/* Free Paint Evaluation Banner - Matching style */}
      <FreePaintEvaluationBanner />
      
      {/* Perfect Solutions Carousel - No wrapper padding */}
      <PerfectSolutionsCarousel setCurrentView={setCurrentView} />
      
      {/* Quality Service Section - No wrapper padding */}
      <QualityService />
      
      {/* Car Detailing Section - No wrapper padding */}
      <CarDetailing />
      
      {/* Business Description Section - No wrapper padding */}
      <BusinessDescription setCurrentView={setCurrentView} />
    </div>
  );
};

export default Service;