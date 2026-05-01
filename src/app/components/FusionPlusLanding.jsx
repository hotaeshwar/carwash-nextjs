'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FusionPlusLanding = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [titleVisible, setTitleVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fullText = 'FUSION PLUS PAINT & PPF';
  
  useEffect(() => {
    if (titleVisible && !isTyping && currentIndex === 0) {
      setIsTyping(true);
      setDisplayText('');
    }
    
    if (isTyping && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);
      
      return () => clearTimeout(timeout);
    } else if (isTyping && currentIndex >= fullText.length) {
      setIsTyping(false);
    }
  }, [currentIndex, fullText, titleVisible, isTyping]);

  useEffect(() => {
    // Start typewriter immediately when component mounts (hero is typically visible)
    const startTimer = setTimeout(() => {
      setTitleVisible(true);
    }, 500); // Small delay for better visual effect

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
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(startTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [titleVisible]);

  const features = [
    "Anti-Graffiti",
    "Scratch Resistance",
    "Fusion plus Paint & PPF can only be applied by Approved Applicators",
    "Permanent Protection",
    "Oxidation & Corrosion Resistant",
    "High Gloss Finish",
    "Super Hydrophobic Effect",
    "Weather & UV Resistance",
    "Thermal Resistance (up to 750°C)",
    "Advanced Chemical Resistance"
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
      `}</style>

      {/* Hero Section */}
      <div 
        className="hero-section relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `url('/images/image2.png.webp')`
        }}
      >
        <div className={`title-container text-center px-4 sm:px-6 lg:px-8 ${titleVisible ? 'visible' : ''}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 min-h-[2em] flex items-center justify-center typewriter-text" style={{ color: '#1393c4', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            <span>
              {displayText}<span className={`typewriter-cursor ml-1 ${isTyping ? 'animate-pulse' : ''}`} style={{ color: '#1393c4' }}>|</span>
            </span>
          </h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Description Section */}
        <div className="mb-16">
          {/* Warranty Box - Like the reference image */}
          <div className="border-2 border-[#1393c4] rounded-lg p-6 mb-8 text-center bg-white shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1393c4]">
              FUSION PLUS PAINT & PPF: 4 year warranty
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg sm:text-xl mb-6">
              Fusion plus Paint & PPF is a Permanent Ceramic Paint Coating that features a High Gloss finish, 
              unmatched Super Hydrophobic Effect, Scratch Resistance, Chemical Resistance, UV Resistance, 
              Thermal Resistance and Anti-Graffiti.
            </p>
            <p className="text-base sm:text-lg mb-6">
              Both the Super Hydrophobic and Anti-Graffiti effect combined mean the surface coated with 
              Fusion plus Paint & PPF coating will stay cleaner for longer as dirt and grime will not stick 
              to the surface and the super hydrophobic effect of the coating will cause water to bead up and 
              roll off the surface with any dirt and grime.
            </p>
            <p className="text-base sm:text-lg mb-6">
              The hard ceramic film also offers superior protection from damaging contamination and harsh chemicals. 
              Coating forms a permanent bond to the paint work and will not wash away or break down. Coating can 
              only be removed by abrasion making it a highly durable protective coating to protect your paint 
              work from damaging contaminants.
            </p>
            <p className="text-base sm:text-lg">
              The unique formulation of the coating has enabled it to be multi-layered which means the thickness 
              of the coating can be increased with additional layers allowing a thicker/harder film that will 
              increase its scratch resistance.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1393c4] mb-8 text-center">
            Premium Features & Benefits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-[#1393c4]"
              >
                <p className="text-gray-800 font-medium leading-relaxed">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Application Notice */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Professional Application Required
            </h4>
            <p className="text-gray-600 text-lg">
              Fusion plus Paint & PPF can only be applied by our network of Approved Applicators, 
              ensuring the highest quality installation and optimal performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FusionPlusLanding;