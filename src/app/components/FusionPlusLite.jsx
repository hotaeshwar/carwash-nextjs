'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FusionPlusLite = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [titleVisible, setTitleVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = 'FUSION PLUS LITE';
  
  // Fixed typewriter effect - runs only once
  useEffect(() => {
    if (titleVisible && !isTyping && currentIndex === 0 && !typingComplete) {
      setIsTyping(true);
      setDisplayText('');
      setShowCursor(true);
      setTypingComplete(false);
    }
    
    if (isTyping && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150);
      
      return () => clearTimeout(timeout);
    } else if (isTyping && currentIndex >= fullText.length) {
      // Typing complete
      const cursorTimeout = setTimeout(() => {
        setShowCursor(false);
        setIsTyping(false);
        setTypingComplete(true);
      }, 1000);
      
      return () => clearTimeout(cursorTimeout);
    }
  }, [currentIndex, fullText, titleVisible, isTyping, typingComplete]);

  // Cursor blink effect only when typing
  useEffect(() => {
    if (showCursor && isTyping) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [showCursor, isTyping]);

  // Scroll effect - fixed to run only once
  useEffect(() => {
    let scrollEnabled = true;

    const handleScroll = () => {
      if (!scrollEnabled) return;

      // Check for title visibility
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const isHeroVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isHeroVisible && !titleVisible) {
          setTitleVisible(true);
          scrollEnabled = false; // Disable further title visibility checks
        }
      }
      
      // Check for other elements
      const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
        
        if (isVisible) {
          setVisibleElements(prev => new Set([...prev, element.dataset.index]));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial visibility
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [titleVisible]);

  const features = [
    'Anti-Graffiti',
    'Chemical Resistance',
    'UV Resistance',
    'Thermal Resistance',
    'High Gloss Finish',
    'Super Hydrophobic Effect',
    'Durability up to 12 months',
    'Can be layered up to 2 times',
    'Compatible with Fusion plus paint & PPF coating',
    'Keeps surfaces cleaner for longer'
  ];

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        /* Enhanced Typewriter animations */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .typewriter-cursor {
          display: inline-block;
          width: 3px;
          background-color: #1393c4;
          margin-left: 4px;
          animation: blink 1s infinite;
        }
        
        .typewriter-text {
          display: inline-block;
        }
        
        /* Title reveal animation */
        .title-container {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        
        .title-container.visible {
          opacity: 1;
          transform: translateY(0);
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

      {/* Hero Image Section with Fixed Typewriter */}
      <section 
        className="hero-section relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/image2.png.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <div className={`title-container text-center max-w-7xl mx-auto w-full ${titleVisible ? 'visible' : ''}`}>
            {/* Fixed Typewriter Title - Only types once */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 text-white leading-tight" 
                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              <span style={{ color: '#1393c4' }} className="typewriter-text inline-block">
                {displayText}
                {showCursor && <span className="typewriter-cursor">|</span>}
              </span>
            </h1>
            <div className="h-1.5 sm:h-2 w-24 sm:w-32 md:w-40 bg-[#1393c4] mx-auto rounded-full shadow-lg"></div>
            
            {/* Subtitle REMOVED as requested */}
          </div>
        </div>
      </section>

      {/* Content Section with Enhanced Spacing */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Warranty Badge with Better Spacing */}
          <div className={`mb-12 sm:mb-16 md:mb-20 scroll-reveal ${visibleElements.has('warranty') ? 'visible' : ''}`} data-index="warranty">
            <div className="text-center">
              <span 
                className="text-xl sm:text-2xl md:text-3xl font-bold border-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl inline-block transform hover:scale-105 transition-transform duration-300"
                style={{ borderColor: '#1393c4', color: '#1393c4', backgroundColor: 'rgba(19, 147, 196, 0.1)' }}
              >
                FUSION PLUS LITE: 1 Year Warranty
              </span>
            </div>
          </div>
          
          {/* Main Description with Improved Typography */}
          <div className={`max-w-6xl mx-auto mb-16 sm:mb-20 md:mb-24 scroll-reveal ${visibleElements.has('description') ? 'visible' : ''}`} data-index="description">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg border border-[#1393c4]/20">
              <p 
                style={{ color: '#1393c4' }} 
                className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed sm:leading-loose md:leading-loose text-justify font-medium"
              >
                Fusion plus lite ceramic coating is a protective coating with a durability of up to 12 months that features a High Gloss finish, superior Super Hydrophobic Effect, Chemical Resistance, UV Resistance, Thermal Resistance and Anti-Graffiti. Both the Super Hydrophobic and Anti-Graffiti effect combined mean the surface coated with Lite will stay cleaner for longer as dirt and grime will not stick to the surface and the super hydrophobic effect of the coating will cause water to bead up and roll of the surface with any dirt and grime. The unique formulation of Light enables it to be layered up to 2 times for even more gloss and protection, for best results Fusion plus lite can be applied over Fusion plus paint & ppf coating to increase gloss and super hydrophobic effect.
              </p>
            </div>
          </div>
          
          {/* Features Section Header */}
          <div className={`text-center mb-16 sm:mb-20 md:mb-24 scroll-reveal ${visibleElements.has('features-header') ? 'visible' : ''}`} data-index="features-header">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1393c4] mb-6 sm:mb-8">
              Premium Features & Benefits
            </h2>
            <div className="w-20 sm:w-24 md:w-28 h-1.5 bg-[#1393c4] mx-auto mb-6 sm:mb-8 rounded-full"></div>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#1393c4] max-w-4xl mx-auto px-4 font-light leading-relaxed">
              Advanced ceramic coating technology with 12 months of protection and performance
            </p>
          </div>
          
          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto mb-20 sm:mb-24 md:mb-28">
            {features.map((feature, index) => {
              const dataIndex = `feature-${index + 1}`;
              return (
                <div 
                  key={index}
                  className={`group bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 sm:p-7 border-2 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-gradient-to-br hover:from-[#1393c4]/5 hover:to-[#1393c4]/15 hover:-translate-y-3 border-[#1393c4]/30 scroll-reveal ${visibleElements.has(dataIndex) ? 'visible' : ''}`}
                  style={{ borderColor: '#1393c4' }}
                  data-index={dataIndex}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform duration-300 group-hover:bg-[#0f7ba3]"
                      style={{ backgroundColor: '#1393c4' }}
                    ></div>
                    <p 
                      style={{ color: '#1393c4' }} 
                      className="text-base sm:text-lg font-semibold leading-relaxed group-hover:text-[#0f7ba3] transition-colors duration-300 flex-1"
                    >
                      {feature}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Application Notice */}
          <div className={`bg-gradient-to-r from-[#1393c4] to-blue-600 rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 text-center text-white mb-20 sm:mb-24 scroll-reveal-scale ${visibleElements.has('application-notice') ? 'visible' : ''}`} data-index="application-notice">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
              Enhanced Protection & Gloss
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl opacity-95 max-w-4xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light">
              For optimal results, Fusion Plus Lite can be layered up to 2 times and applied over 
              Fusion Plus paint & PPF coating to significantly increase gloss and super hydrophobic effect.
            </p>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 transform hover:scale-110 transition-transform duration-300">
              <div 
                className="w-4 h-4 rounded-full bg-white"
              ></div>
            </div>
          </div>

          {/* Enhanced Durability Highlight */}
          <div className={`bg-white border-3 rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 text-center scroll-reveal-scale ${visibleElements.has('warranty-highlight') ? 'visible' : ''}`} style={{ borderColor: '#1393c4' }} data-index="warranty-highlight">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-[#1393c4] leading-tight">
              12 Months Durability
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              With up to 12 months of reliable protection, Fusion Plus Lite ensures your surfaces 
              stay cleaner and more protected with superior hydrophobic and anti-graffiti properties.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FusionPlusLite;