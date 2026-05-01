'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FusionPlusUpholstery = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [titleVisible, setTitleVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fullText = 'FUSION PLUS UPHOLSTERY';
  
  useEffect(() => {
    if (titleVisible && !isTyping && currentIndex === 0) {
      setIsTyping(true);
      setDisplayText('');
    }
    
    if (isTyping && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 120);
      
      return () => clearTimeout(timeout);
    } else if (isTyping && currentIndex >= fullText.length) {
      setIsTyping(false);
    }
  }, [currentIndex, fullText, titleVisible, isTyping]);

  useEffect(() => {
    const handleScroll = () => {
      // Check for title visibility
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const isHeroVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isHeroVisible && !titleVisible) {
          setTitleVisible(true);
        }
      }
      
      // Check for other elements
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
  }, [titleVisible]);

  const features = [
    'Super Hydrophobic Effect – 140°',
    'Excellent Wear Resistance',
    'Fusion plus Upholstery can only be applied by Professional Detailers.',
    'Excellent Durability',
    'Repels Spills & Stains',
    'Keeps Fibres Clean'
  ];

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        /* Typewriter animations */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .typewriter-cursor {
          animation: blink 1s infinite;
        }
        
        .typewriter-text {
          opacity: 0;
          animation: fadeInText 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeInText {
          to {
            opacity: 1;
          }
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
      `}</style>

      {/* Hero Image Section with Title */}
      <section 
        className="hero-section relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/image2.png.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className={`title-container text-center max-w-7xl mx-auto ${titleVisible ? 'visible' : ''}`}>
            {/* Typewriter Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl">
              <span style={{ color: '#1393c4' }} className="inline-block drop-shadow-2xl typewriter-text">
                {displayText}
                <span className={`typewriter-cursor ${isTyping ? 'animate-pulse' : ''}`}>|</span>
              </span>
            </h1>
            <div className="h-1 sm:h-2 w-20 sm:w-24 md:w-32 bg-[#1393c4] mx-auto rounded-full shadow-lg mb-6 sm:mb-8"></div>
          </div>
        </div>
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
              FUSION PLUS UPHOLSTERY: 1 Year warranty
            </span>
          </div>
          
          {/* Main Description */}
          <div className={`max-w-5xl mx-auto mb-8 sm:mb-12 scroll-reveal ${visibleElements.has('description') ? 'visible' : ''}`} data-index="description">
            <p 
              style={{ color: '#1393c4' }} 
              className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-justify px-4"
            >
              Fusion plus upholstery comes from the high-tech industry of the photoelectron semiconductor assembly which is reliable and an inorganic compound. Coating dramatically reduces the surface energy of textile or suede, so that when liquids come into contact with it, they form beads and simply roll off while keeping the textile substrate completely dry. This enables the fabric, suede, and tissue surface to be free from the water/dust and all other liquids, without affecting the look or feel.
            </p>
          </div>
          
          {/* High-Tech Industry Highlight - Removed emoji */}
          <div className={`bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 sm:p-8 text-center mb-12 scroll-reveal ${visibleElements.has('tech-highlight') ? 'visible' : ''}`} data-index="tech-highlight">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-purple-600">
              High-Tech Semiconductor Technology
            </h3>
            <p className="text-base sm:text-lg text-purple-700 max-w-3xl mx-auto">
              Advanced photoelectron semiconductor assembly - reliable inorganic compound technology
            </p>
          </div>
          
          {/* Features Section Header */}
          <div className={`text-center mb-12 sm:mb-16 scroll-reveal ${visibleElements.has('features-header') ? 'visible' : ''}`} data-index="features-header">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1393c4] mb-4">
              Advanced Textile Protection
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#1393c4] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-[#1393c4] max-w-3xl mx-auto px-4">
              Cutting-edge fabric protection that repels liquids without affecting look or feel
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => {
              const dataIndex = `feature-${index + 1}`;
              return (
                <div 
                  key={index}
                  className={`group bg-gradient-to-br from-blue-50 to-[#1393c4]/10 rounded-2xl p-6 sm:p-8 border shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-[#1393c4]/10 hover:to-[#1393c4]/20 hover:-translate-y-2 border-[#1393c4]/20 scroll-reveal ${visibleElements.has(dataIndex) ? 'visible' : ''}`}
                  style={{ borderColor: '#1393c4' }}
                  data-index={dataIndex}
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

          {/* 140° Hydrophobic Highlight */}
          <div className={`bg-gradient-to-r from-[#1393c4] to-blue-600 rounded-2xl p-8 sm:p-12 text-center text-white mb-16 scroll-reveal-scale ${visibleElements.has('hydrophobic-highlight') ? 'visible' : ''}`} data-index="hydrophobic-highlight">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              140° Super Hydrophobic Effect
            </h3>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto mb-6">
              Industry-leading 140° water contact angle - the highest level of liquid repellency available. 
              Liquids form perfect beads and roll off instantly, keeping your upholstery completely dry.
            </p>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'white' }}
              ></div>
            </div>
          </div>

          {/* Fabric Benefits */}
          <div className={`bg-green-50 border-2 border-green-200 rounded-2xl p-8 sm:p-12 text-center mb-16 scroll-reveal-scale ${visibleElements.has('fabric-benefits') ? 'visible' : ''}`} data-index="fabric-benefits">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">
              Maintains Original Look & Feel
            </h3>
            <p className="text-lg sm:text-xl text-green-600 max-w-3xl mx-auto">
              Advanced surface energy reduction technology protects fabric, suede, and textile surfaces 
              without altering their natural appearance, texture, or breathability.
            </p>
          </div>

          {/* Professional Application Notice - Removed emoji */}
          <div className={`bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 sm:p-12 text-center mb-16 scroll-reveal-scale ${visibleElements.has('professional-notice') ? 'visible' : ''}`} data-index="professional-notice">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-yellow-700">
              Professional Application Only
            </h3>
            <p className="text-lg sm:text-xl text-yellow-600 max-w-3xl mx-auto">
              Fusion plus Upholstery requires specialized application techniques and can only be applied by 
              trained Professional Detailers to ensure optimal performance and results.
            </p>
          </div>

          {/* Warranty Highlight */}
          <div className={`bg-white border-2 rounded-2xl p-8 sm:p-12 text-center scroll-reveal-scale ${visibleElements.has('warranty-highlight') ? 'visible' : ''}`} style={{ borderColor: '#1393c4' }} data-index="warranty-highlight">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1393c4]">
              1 Year Warranty
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Your upholstery protection is backed by our comprehensive 1-year warranty, 
              ensuring lasting spill and stain resistance with industry-leading 140° hydrophobic performance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FusionPlusUpholstery;