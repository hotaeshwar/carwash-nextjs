'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FusionPlusGlass = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const fullText = 'FUSION PLUS GLASS';
  
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to determine if element should be visible based on scroll position
  const getElementVisibility = (triggerPoint) => {
    return scrollY > triggerPoint ? 'visible' : '';
  };

  const features = [
    'Allows Water to Roll off Glass',
    'Super Hydrophobic Effect – 110°',
    'Excellent Wear Resistance',
    'Excellent Durability',
    'Keeps Glass Cleaner'
  ];

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Scroll reveal animations */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }
        
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-reveal-left {
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.6s ease-out;
        }
        
        .scroll-reveal-left.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scroll-reveal-right {
          opacity: 0;
          transform: translateX(30px);
          transition: all 0.6s ease-out;
        }
        
        .scroll-reveal-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scroll-reveal-scale {
          opacity: 0;
          transform: scale(0.95);
          transition: all 0.6s ease-out;
        }
        
        .scroll-reveal-scale.visible {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>

      {/* Hero Image Section with Title - Removed black overlays */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/image2.png.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Removed the black overlay div completely */}
        
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-7xl mx-auto">
            {/* Typewriter Title - Added text shadow for better readability */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg">
              <span style={{ color: '#1393c4', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }} className="inline-block">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            <div className="h-1 sm:h-2 w-20 sm:w-24 md:w-32 bg-[#1393c4] mx-auto rounded-full shadow-lg mb-6 sm:mb-8"></div>
          </div>
        </div>
        
        {/* Removed the gradient overlay as well */}
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-7xl mx-auto">
          
          {/* Warranty Badge */}
          <div className={`mb-8 sm:mb-12 scroll-reveal ${getElementVisibility(100)}`}>
            <span 
              className="text-lg sm:text-xl md:text-2xl font-bold border-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block"
              style={{ borderColor: '#1393c4', color: '#1393c4' }}
            >
              FUSION PLUS GLASS: 2 years warranty
            </span>
          </div>
          
          {/* Main Description */}
          <div className={`max-w-5xl mx-auto mb-8 sm:mb-12 scroll-reveal ${getElementVisibility(200)}`}>
            <p 
              style={{ color: '#1393c4' }} 
              className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify px-4"
            >
              Fusion plus glass is a coating specifically designed for glass with excellent durability without affecting the motion of the front wiper blades, the super hydrophobic effect of the coating means water will simply bead up and run off the glass whilst you are driving. Unprotected glass can be a hazard in the rain as water can stick and sheet over the windows decreasing visibility and become a safety hazard, by having Fusion plus glass on all windows this will increase visibility by repelling water and allowing it to bead up and roll straight off the glass, this will also keep the glass cleaner for longer as dirt and grime will no longer stick.
            </p>
          </div>
          
          {/* Safety Highlight */}
          <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 text-center mb-12 scroll-reveal ${getElementVisibility(350)}`}>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-red-600">
              ⚠️ Safety Enhancement
            </h3>
            <p className="text-base sm:text-lg text-red-700 max-w-3xl mx-auto">
              Unprotected glass can be a hazard in the rain - improve visibility and safety with Fusion Plus Glass coating
            </p>
          </div>
          
          {/* Features Section Header */}
          <div className={`text-center mb-12 sm:mb-16 scroll-reveal ${getElementVisibility(500)}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1393c4] mb-4">
              Advanced Glass Protection
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#1393c4] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-[#1393c4] max-w-3xl mx-auto px-4">
              Specialized coating technology designed specifically for automotive glass surfaces
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-16">
            {features.map((feature, index) => {
              return (
                <div 
                  key={index}
                  className={`group bg-gradient-to-br from-blue-50 to-[#1393c4]/10 rounded-2xl p-6 sm:p-8 border shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-[#1393c4]/10 hover:to-[#1393c4]/20 hover:-translate-y-2 border-[#1393c4]/20 scroll-reveal ${getElementVisibility(700 + (index * 100))}`}
                  style={{ 
                    borderColor: '#1393c4',
                    transitionDelay: scrollY > (700 + (index * 100)) ? `${index * 0.1}s` : '0s'
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"
                      style={{ backgroundColor: '#1393c4' }}
                    ></div>
                    <p 
                      style={{ color: '#1393c4' }} 
                      className="text-base sm:text-lg font-medium leading-relaxed group-hover:text-[#0f7ba3] transition-colors duration-300"
                    >
                      {feature}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visibility Enhancement */}
          <div className={`bg-gradient-to-r from-[#1393c4] to-blue-600 rounded-2xl p-8 sm:p-12 text-center text-white mb-16 scroll-reveal-scale ${getElementVisibility(1300)}`}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Enhanced Driving Visibility
            </h3>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto mb-6">
              Water beads up and rolls off your windshield and windows while driving, dramatically improving visibility in wet conditions. 
              No more water sheeting that reduces safety and creates hazardous driving conditions.
            </p>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'white' }}
              ></div>
            </div>
          </div>

          {/* Wiper Compatibility */}
          <div className={`bg-green-50 border-2 border-green-200 rounded-2xl p-8 sm:p-12 text-center mb-16 scroll-reveal-scale ${getElementVisibility(1600)}`}>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">
              ✓ Wiper Blade Compatible
            </h3>
            <p className="text-lg sm:text-xl text-green-600 max-w-3xl mx-auto">
              Specially formulated to work seamlessly with your windshield wipers without affecting their motion or performance. 
              Enjoy the benefits of hydrophobic glass protection without compromising wiper functionality.
            </p>
          </div>

          {/* Warranty Highlight */}
          <div className={`bg-white border-2 rounded-2xl p-8 sm:p-12 text-center scroll-reveal-scale ${getElementVisibility(1900)}`} style={{ borderColor: '#1393c4' }}>
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1393c4]">
              2 Years Warranty
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Your glass protection is backed by our comprehensive 2-year warranty, 
              ensuring crystal-clear visibility and long-lasting performance in all weather conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FusionPlusGlass;