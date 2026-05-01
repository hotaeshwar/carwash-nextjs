'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

// Card data configuration with public/images paths
const cardData = [
  {
    id: 'certified-experts',
    title: 'Certified Experts',
    image: '/images/CertifiedExperts.png',
    fullDescription: 'Our team consists of highly trained and certified professionals with years of experience in the industry. Each expert undergoes rigorous training and certification processes to ensure they meet our high standards of excellence.'
  },
  {
    id: 'keeping-customers-happy',
    title: 'Keeping Customers Happy',
    image: '/images/KeepingCustomersHappy.png',
    fullDescription: 'Customer satisfaction is our top priority. We go above and beyond to ensure every client receives exceptional service and support. Our dedicated team works tirelessly to exceed expectations and build lasting relationships.'
  },
  {
    id: 'licensed-insured',
    title: 'Licensed & Insured',
    image: '/images/Licensedandinsured.png',
    fullDescription: 'We maintain all necessary licenses and comprehensive insurance coverage to protect both our clients and our team. This commitment to compliance and safety gives you peace of mind throughout every project.'
  },
  {
    id: 'professional-installation',
    title: 'Professional Installation',
    image: '/images/ProfessionalInstallation.png',
    fullDescription: 'Every installation is performed with precision and attention to detail by our skilled professionals. We use industry-leading techniques and equipment to ensure flawless results that stand the test of time.'
  },
  {
    id: 'quality-guarantee',
    title: 'Quality Guarantee',
    image: '/images/QualityGuarantee.png',
    fullDescription: 'We stand behind our work with a comprehensive quality guarantee. If you\'re not completely satisfied with our service, we\'ll make it right. Your satisfaction is our commitment and our promise.'
  }
];

// Custom Hook for Scroll Animations
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [isClient, setIsClient] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // Set client flag
    setIsClient(true);

    // Check for IntersectionObserver support
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    try {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const animateId = entry.target.dataset?.animateId;
              if (animateId) {
                setVisibleElements(prev => new Set([...prev, animateId]));
              }
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '-50px 0px -50px 0px'
        }
      );
    } catch (error) {
      console.error('Failed to create IntersectionObserver:', error);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const registerElement = useCallback((element, animateId) => {
    if (!element || !observerRef.current) {
      return;
    }

    try {
      observerRef.current.observe(element);
    } catch (error) {
      console.error('Error registering element:', error);
    }
  }, []);

  return { visibleElements, registerElement, isClient };
};

// Modal Component
const Modal = ({ isOpen, onClose, feature }) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !feature) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto transform transition-all duration-300 scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          type="button"
          aria-label="Close modal"
        >
          <X size={20} className="text-[#1393c4]" />
        </button>

        <div className="p-8 pb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mr-6 border-2 border-gray-100 flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image
                  src={feature.image}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  style={{ filter: 'brightness(0) saturate(100%) invert(65%) sepia(51%) saturate(2878%) hue-rotate(180deg) brightness(96%) contrast(97%)' }}
                />
              </div>
            </div>
            <div>
              <h3 
                id="modal-title"
                className="text-3xl font-black mb-2 text-[#1393c4]"
              >
                {feature.title}
              </h3>
            </div>
          </div>

          <div className="text-gray-700 leading-relaxed text-lg mb-6">
            <p className="mb-4">{feature.fullDescription}</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#1393c4] text-white rounded-lg hover:bg-[#0f7ba3] transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
              type="button"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const QualityService = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  const { visibleElements, registerElement, isClient } = useScrollAnimation();
  
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isTouchMove = useRef(false);
  const touchTimerRef = useRef(null);

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle screen size
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Cleanup touch timer
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  const handleTouchStart = useCallback((e, featureId) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    isTouchMove.current = false;
    
    setActiveCard(featureId);
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
    touchTimerRef.current = setTimeout(() => {
      setActiveCard(null);
    }, 1000);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchStartPos.current.x === 0 && touchStartPos.current.y === 0) return;
    
    const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
    
    if (deltaX > 10 || deltaY > 10) {
      isTouchMove.current = true;
      setActiveCard(null);
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    }
  }, []);

  const handleTouchEnd = useCallback((feature) => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
    
    if (!isTouchMove.current) {
      setTimeout(() => {
        setSelectedFeature(feature);
        setIsModalOpen(true);
      }, 150);
    }
    
    setActiveCard(null);
    isTouchMove.current = false;
    touchStartPos.current = { x: 0, y: 0 };
  }, []);

  const handleTouchCancel = useCallback(() => {
    setActiveCard(null);
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
    isTouchMove.current = false;
    touchStartPos.current = { x: 0, y: 0 };
  }, []);

  const handleCardClick = useCallback((feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
    setActiveCard(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFeature(null);
  }, []);

  const handleMouseEnter = useCallback((e) => {
    if (isSmallScreen) return;
    
    e.currentTarget.style.backgroundColor = '#1393c4';
    const title = e.currentTarget.querySelector('h4');
    const img = e.currentTarget.querySelector('img');
    if (title) title.style.color = 'white';
    if (img) {
      img.style.filter = 'brightness(0) invert(1)';
    }
  }, [isSmallScreen]);

  const handleMouseLeave = useCallback((e) => {
    if (isSmallScreen) return;
    
    e.currentTarget.style.backgroundColor = 'white';
    const title = e.currentTarget.querySelector('h4');
    const img = e.currentTarget.querySelector('img');
    if (title) title.style.color = '#1393c4';
    if (img) {
      img.style.filter = 'brightness(0) saturate(100%) invert(65%) sepia(51%) saturate(2878%) hue-rotate(180deg) brightness(96%) contrast(97%)';
    }
  }, [isSmallScreen]);

  // Render placeholder during SSR and initial mount
  if (!isMounted) {
    return (
      <div className="py-8 md:py-12 lg:py-16 xl:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 tracking-wider text-[#1393c4]">
              <span className="drop-shadow-lg">QUALITY SERVICE</span>
              <div className="mx-auto mt-3 w-20 lg:w-24 h-1 rounded-full shadow-lg bg-gradient-to-r from-[#1393c4] via-[#0f7ba3] to-[#0b6488]" />
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {cardData.map((feature) => (
              <div key={feature.id} className="group h-full w-full">
                <div className="relative bg-white rounded-xl shadow-lg h-full flex flex-col p-4 md:p-10">
                  <div className="mx-auto flex items-center justify-center flex-shrink-0 mb-3 md:mb-6">
                    <div className="relative w-12 h-12 md:w-20 md:h-20 bg-gray-100 rounded-full" />
                  </div>
                  <h4 className="text-center leading-tight text-xs md:text-lg font-semibold px-1 md:px-2 text-[#1393c4]">
                    {feature.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-8 md:py-12 lg:py-16 xl:py-20 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Title Section */}
          <div className="mb-8 sm:mb-10 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 tracking-wider text-[#1393c4]">
              <span className="drop-shadow-lg">QUALITY SERVICE</span>
              <div className="mx-auto mt-3 w-20 lg:w-24 h-1 rounded-full shadow-lg bg-gradient-to-r from-[#1393c4] via-[#0f7ba3] to-[#0b6488]" />
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {cardData.map((feature) => {
              const isActive = activeCard === feature.id;
              
              return (
                <div
                  key={feature.id}
                  className="group h-full w-full"
                >
                  <div 
                    className="relative bg-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer h-full flex flex-col"
                    onClick={() => !isSmallScreen && handleCardClick(feature)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(feature);
                      }
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={(e) => isSmallScreen && handleTouchStart(e, feature.id)}
                    onTouchMove={(e) => isSmallScreen && handleTouchMove(e)}
                    onTouchEnd={() => isSmallScreen && handleTouchEnd(feature)}
                    onTouchCancel={handleTouchCancel}
                    style={isActive ? {
                      backgroundColor: '#1393c4',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      padding: isSmallScreen ? '1rem 0.75rem' : '2rem 2.5rem'
                    } : {
                      padding: isSmallScreen ? '1rem 0.75rem' : '2rem 2.5rem'
                    }}
                    aria-label={`View details for ${feature.title}`}
                  >
                    {/* Logo Section */}
                    <div className={`mx-auto flex items-center justify-center flex-shrink-0 ${isSmallScreen ? 'mb-3' : 'mb-4 sm:mb-5 md:mb-6'}`}>
                      <div className={`relative ${isSmallScreen ? 'w-12 h-12' : 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20'}`}>
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          width={80}
                          height={80}
                          className={`object-contain transition-all duration-300 w-full h-full`}
                          style={{ 
                            filter: isActive 
                              ? 'brightness(0) invert(1)' 
                              : 'brightness(0) saturate(100%) invert(65%) sepia(51%) saturate(2878%) hue-rotate(180deg) brightness(96%) contrast(97%)' 
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h4 
                      className={`text-center leading-tight transition-colors duration-300 ${
                        isSmallScreen ? 'text-xs font-semibold px-1' : 'text-base md:text-lg lg:text-xl font-semibold px-2'
                      }`}
                      style={{ color: isActive ? 'white' : '#1393c4' }}
                    >
                      {feature.title}
                    </h4>

                    {/* Mobile tap indicator */}
                    {isSmallScreen && isActive && (
                      <div className="absolute inset-0 border-4 border-blue-400 rounded-xl pointer-events-none animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        feature={selectedFeature} 
      />
    </>
  );
};

export default QualityService;