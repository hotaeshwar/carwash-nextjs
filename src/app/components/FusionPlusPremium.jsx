

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FusionPlusPremium = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isErasing, setIsErasing] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const fullText = 'FUSION PLUS PREMIUM';
  
  useEffect(() => {
    if (isTyping && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150);
      
      return () => clearTimeout(timeout);
    } else if (isTyping && currentIndex === fullText.length) {
      // Pause before starting to erase
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setIsErasing(true);
      }, 2000);
      
      return () => clearTimeout(timeout);
    } else if (isErasing && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    } else if (isErasing && currentIndex === 0) {
      // Start typing again
      setIsErasing(false);
      setIsTyping(true);
    }
  }, [currentIndex, isTyping, isErasing, fullText]);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
        
        if (isVisible) {
          setVisibleElements(prev => new Set([...prev, element.dataset.index]));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial visibility
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    'Anti-Graffiti',
    'Scratch Resistance (Above 9H)',
    'Fusion plus Premium Ceramic Coating can only be applied by Approved Applicators.',
    'Permanent Protection',
    'Oxidation & Corrosion Resistant',
    'High Gloss Finish',
    'Super Hydrophobic Effect',
    'Weather & UV Resistance',
    'Thermal Resistance (up to 750°C)',
    'Advanced Chemical Resistance'
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
        
        /* Staggered delays for feature cards */
        .scroll-reveal[data-index="feature-1"].visible { transition-delay: 0.1s; }
        .scroll-reveal[data-index="feature-2"].visible { transition-delay: 0.2s; }
        .scroll-reveal[data-index="feature-3"].visible { transition-delay: 0.3s; }
        .scroll-reveal[data-index="feature-4"].visible { transition-delay: 0.4s; }
        .scroll-reveal[data-index="feature-5"].visible { transition-delay: 0.5s; }
        .scroll-reveal[data-index="feature-6"].visible { transition-delay: 0.6s; }
        .scroll-reveal[data-index="feature-7"].visible { transition-delay: 0.7s; }
        .scroll-reveal[data-index="feature-8"].visible { transition-delay: 0.8s; }
        .scroll-reveal[data-index="feature-9"].visible { transition-delay: 0.9s; }
        .scroll-reveal[data-index="feature-10"].visible { transition-delay: 1.0s; }
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
                {displayText}<span className="animate-pulse ml-1" style={{ color: '#1393c4' }}>|</span>
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
          <div className={`mb-8 sm:mb-12 scroll-reveal ${visibleElements.has('warranty') ? 'visible' : ''}`} data-index="warranty">
            <span 
              className="text-lg sm:text-xl md:text-2xl font-bold border-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block"
              style={{ borderColor: '#1393c4', color: '#1393c4' }}
            >
              FUSION PLUS PREMIUM: 8 years warranty
            </span>
          </div>
          
          {/* Main Description */}
          <div className={`max-w-5xl mx-auto mb-8 sm:mb-12 scroll-reveal ${visibleElements.has('description') ? 'visible' : ''}`} data-index="description">
            <p 
              style={{ color: '#1393c4' }} 
              className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify px-4"
            >
              Fusion plus Premium is a Permanent Ceramic Paint Coating that features a High Gloss finish, unmatched Super Hydrophobic Effect, Scratch Resistance, Chemical Resistance, UV Resistance, Thermal Resistance and Anti-Graffiti. Both the Super Hydrophobic and Anti-Graffiti effect combined mean the surface coated with 9H will stay cleaner for longer as dirt and grime will not stick to the surface and the super hydrophobic effect of the coating will cause water to bead up and roll of the surface with any dirt and grime, the hard ceramic film also offers superior protection from damaging contamination and harsh chemicals. 9H forms a permanent bond to the paint work and will not wash away or break down, 9H can only be removed by abrasion making it a highly durable protective coating to protect your paint work from damaging contaminants. The unique formulation of 9H has enabled it to be multi-layered which means the thickness of the coating can be increased with additional layers allowing a thicker / harder film that will increase its scratch resistance.
            </p>
          </div>
          
          {/* Features Section Header */}
          <div className={`text-center mb-12 sm:mb-16 scroll-reveal ${visibleElements.has('features-header') ? 'visible' : ''}`} data-index="features-header">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1393c4] mb-4">
              Premium Features & Benefits
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#1393c4] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-[#1393c4] max-w-3xl mx-auto px-4">
              Advanced 9H ceramic coating technology with superior protection and unmatched durability
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => {
              const dataIndex = `feature-${index + 1}`;
              return (
                <div 
                  key={index}
                  className={`group bg-gradient-to-br from-blue-50 to-[#1393c4]/10 rounded-2xl p-4 sm:p-6 border shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-[#1393c4]/10 hover:to-[#1393c4]/20 hover:-translate-y-2 border-[#1393c4]/20 scroll-reveal ${visibleElements.has(dataIndex) ? 'visible' : ''}`}
                  style={{ borderColor: '#1393c4' }}
                  data-index={dataIndex}
                >
                  <div className="flex items-start space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"
                      style={{ backgroundColor: '#1393c4' }}
                    ></div>
                    <p 
                      style={{ color: '#1393c4' }} 
                      className="text-sm sm:text-base font-medium leading-tight group-hover:text-[#0f7ba3] transition-colors duration-300"
                    >
                      {feature}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Professional Application Notice */}
          <div className={`bg-gradient-to-r from-[#1393c4] to-blue-600 rounded-2xl p-8 sm:p-12 text-center text-white mb-16 scroll-reveal-scale ${visibleElements.has('application-notice') ? 'visible' : ''}`} data-index="application-notice">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Professional Application Required
            </h3>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto mb-6">
              Fusion plus Premium Ceramic Coating can only be applied by our network of Approved Applicators, 
              ensuring the highest quality installation and optimal 9H hardness performance.
            </p>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'white' }}
              ></div>
            </div>
          </div>

          {/* Warranty Highlight */}
          <div className={`bg-white border-2 rounded-2xl p-8 sm:p-12 text-center scroll-reveal-scale ${visibleElements.has('warranty-highlight') ? 'visible' : ''}`} style={{ borderColor: '#1393c4' }} data-index="warranty-highlight">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1393c4]">
              8 Years Warranty
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Your premium investment is protected with our comprehensive 8-year warranty, 
              ensuring long-lasting 9H hardness performance and ultimate peace of mind.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FusionPlusPremium;