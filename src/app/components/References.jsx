'use client';

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Image from 'next/image';

// Updated: Images from public/images folder
const car6 = '/images/car6.png';
const bbbLogo = '/images/bbb_logo.png.png';
const refMurray = '/images/ref_murray1.jpg.png';
const refRightlook = '/images/ref_rightlook.jpg.png';
const refWaverley = '/images/ref_waverley.jpg.png';
const refBestbuy = '/images/ref_bestbuy-1.jpg.png';

const CarDetailingReference = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());

  // Scroll animation handler
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      const windowHeight = window.innerHeight;
      const newVisibleElements = new Set(visibleElements);

      elements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = elementTop < windowHeight - 100;

        if (elementVisible && !visibleElements.has(index)) {
          newVisibleElements.add(index);
          element.classList.add('animate-in');
        }
      });

      if (newVisibleElements.size !== visibleElements.size) {
        setVisibleElements(newVisibleElements);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleElements]);

  const handlePrivacyPolicyDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://actioncardetailing.ca/wp-content/uploads/2019/03/OnlinePrivacyPolicy.mr11.pdf';
    link.download = 'Privacy_Policy.pdf';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 relative overflow-hidden pt-16" style={{ background: 'linear-gradient(to bottom right, #e0f2fe, #f0f9ff, #e0f2fe)' }}>

      {/* Add CSS for scroll animations */}
      <style jsx>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-animate-delay-1 {
          transition-delay: 0.1s;
        }
        
        .scroll-animate-delay-2 {
          transition-delay: 0.2s;
        }
        
        .scroll-animate-delay-3 {
          transition-delay: 0.3s;
        }
        
        .scroll-animate-delay-4 {
          transition-delay: 0.4s;
        }
        
        .scroll-animate-fade {
          opacity: 0;
          transition: opacity 1s ease-out;
        }
        
        .scroll-animate-fade.animate-in {
          opacity: 1;
        }
        
        .scroll-animate-scale {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate-scale.animate-in {
          opacity: 1;
          transform: scale(1);
        }
        
        .scroll-animate-slide-up {
          opacity: 0;
          transform: translateY(80px);
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate-slide-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-animate-slide-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate-slide-left.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scroll-animate-slide-right {
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate-slide-right.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${car6})`
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(224, 242, 254, 0.8), transparent, rgba(240, 249, 255, 0.9))' }} />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-6">

        {/* Partner Logos Row */}
        <div className="mb-6 md:mb-8 w-full max-w-6xl scroll-animate">
          <div className="py-3 md:py-4 px-4 md:px-6 rounded-xl shadow-lg border-2" style={{ background: 'linear-gradient(to right, #e0f2fe, #f0f9ff)', borderColor: '#1393c4' }}>
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 lg:gap-8">

              {/* Rightlook */}
              <div className="relative group scroll-animate scroll-animate-delay-1">
                <div className="relative h-12 md:h-16 lg:h-20 w-auto">
                  <Image
                    src={refRightlook}
                    alt="Rightlook"
                    width={80}
                    height={64}
                    className="h-full w-auto object-contain transition-all duration-500 cursor-pointer transform hover:scale-110 shadow-md hover:shadow-lg rounded-lg"
                  />
                </div>
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(19, 147, 196, 0.2)' }}></div>
              </div>

              {/* Murray Hyundai */}
              <div className="relative group scroll-animate scroll-animate-delay-2">
                <div className="relative h-12 md:h-16 lg:h-20 w-auto">
                  <Image
                    src={refMurray}
                    alt="Murray Hyundai"
                    width={80}
                    height={64}
                    className="h-full w-auto object-contain transition-all duration-500 cursor-pointer transform hover:scale-110 shadow-md hover:shadow-lg rounded-lg"
                  />
                </div>
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(19, 147, 196, 0.2)' }}></div>
              </div>

              {/* Waverley */}
              <div className="relative group scroll-animate scroll-animate-delay-3">
                <div className="relative h-12 md:h-16 lg:h-20 w-auto">
                  <Image
                    src={refWaverley}
                    alt="Gauthier's Waverley"
                    width={80}
                    height={64}
                    className="h-full w-auto object-contain transition-all duration-500 cursor-pointer transform hover:scale-110 shadow-md hover:shadow-lg rounded-lg"
                  />
                </div>
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(19, 147, 196, 0.2)' }}></div>
              </div>

              {/* BestBuy Auto */}
              <div className="relative group scroll-animate scroll-animate-delay-4">
                <div className="relative h-12 md:h-16 lg:h-20 w-auto">
                  <Image
                    src={refBestbuy}
                    alt="BestBuy Auto"
                    width={80}
                    height={64}
                    className="h-full w-auto object-contain transition-all duration-500 cursor-pointer transform hover:scale-110 shadow-md hover:shadow-lg rounded-lg"
                  />
                </div>
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(19, 147, 196, 0.2)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <div className="text-center mb-4 md:mb-6 scroll-animate scroll-animate-slide-up">
          <div className="text-sm md:text-base font-bold mb-3 drop-shadow-lg animate-pulse" style={{ color: '#1393c4' }}>
            DOWNLOAD OUR PRIVACY POLICY
          </div>

          <button
            onClick={handlePrivacyPolicyDownload}
            className="px-3 md:px-4 py-2 rounded-lg border-2 transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
            style={{
              background: 'linear-gradient(to right, #e0f2fe, #f0f9ff)',
              color: '#1393c4',
              borderColor: '#1393c4'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to right, #f0f9ff, #e0f2fe)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to right, #e0f2fe, #f0f9ff)';
            }}
          >
            <Download className="w-4 h-4" />
            <span className="font-semibold">Action Car Detailing Privacy Policy</span>
          </button>
        </div>

        {/* Contact Information with BBB Badge - Responsive Version */}
        <div className="w-full max-w-2xl lg:max-w-3xl scroll-animate scroll-animate-scale">
          <div className="text-center shadow-xl rounded-xl overflow-hidden border-2" style={{ background: 'linear-gradient(to bottom right, #e0f2fe, #f0f9ff, #e0f2fe)', borderColor: '#1393c4', color: '#1393c4' }}>

            {/* BBB Badge - Top Center */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="rounded-lg p-4 md:p-6 shadow-xl border-2 transform hover:scale-105 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)', borderColor: '#1393c4' }}>
                <div className="flex flex-col items-center">
                  {/* Only BBB Logo Image - Bigger Size */}
                  <div>
                    <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                      <Image
                        src={bbbLogo}
                        alt="BBB Logo"
                        width={96}
                        height={96}
                        className="w-full h-full object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Text Content - Responsive */}
            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
              <div className="space-y-2">
                <div className="text-sm md:text-base font-bold leading-tight" style={{ color: '#1393c4' }}>
                  CONTACT US FOR OUR RATES AND
                </div>
                <div className="text-sm md:text-base font-bold mb-4 leading-tight" style={{ color: '#1393c4' }}>
                  SERVICES
                </div>

                {/* Phone Number */}
                <div className="inline-block px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to right, #1393c4, #0f7aa3)', border: '2px solid #1393c4' }}>
                  <a
                    href="tel:+12047750005"
                    className="text-lg md:text-2xl font-bold transition-colors duration-300 drop-shadow-lg"
                    style={{ color: '#ffffff' }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#e0f2fe';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#ffffff';
                    }}
                  >
                    (204) 775-0005
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarDetailingReference;