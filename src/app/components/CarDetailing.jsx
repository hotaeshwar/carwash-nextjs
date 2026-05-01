'use client';

import { useState, useEffect } from 'react';
import {
  faThumbsUp,
  faTrophy,
  faStar,
  faTag,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

// Updated: Images from public/images folder
const awardHome = '/images/awardhome.png';
const insuranceImg = '/images/insurance.png';

const CarDetailing = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCard]);

  const cardData = [
    {
      id: 'card5',
      frontTitle: 'Reputable Since 2011',
      icon: faThumbsUp,
      backTitle: 'Reputable Since 2011',
      backContent: 'Locally owned and operated, serving Winnipeg with excellence for over a decade. Our commitment to quality has made us the trusted choice for thousands of satisfied customers.',
      features: [
        'Over 14 years of experience',
        'Thousands of satisfied customers',
        'Locally owned and operated',
        'Established reputation in Winnipeg'
      ]
    },
    {
      id: 'card6',
      frontTitle: 'MPI Accredited',
      icon: faTrophy,
      customImage: insuranceImg,
      backTitle: 'MPI Accredited',
      backContent: 'Only Auto Detailing shop in Winnipeg accredited by MPI. This exclusive accreditation demonstrates our commitment to meet the highest industry standards.',
      features: [
        'Exclusive MPI accreditation',
        'Meets highest industry standards',
        'Recognized quality and reliability',
        'Insurance approved services'
      ]
    },
    {
      id: 'card7',
      frontTitle: 'Award Winning',
      icon: faStar,
      customImage: awardHome,
      isAwardLogo: true,
      backTitle: 'Award Winning',
      backContent: 'Winner of Consumer Choice Award 2026 in Auto Detailing Category. This prestigious award recognizes our outstanding service and customer satisfaction.',
      features: [
        'Consumer Choice Award 2026 winner',
        'Outstanding customer satisfaction',
        'Industry recognition',
        'Proven track record of excellence'
      ]
    },
    {
      id: 'card8',
      frontTitle: 'Transparent Pricing',
      icon: faTag,
      backTitle: 'Transparent Pricing',
      backContent: 'Up front pricing with no hidden fees. One stop shop for all your auto detailing needs. We believe in honest, straightforward pricing you can trust.',
      features: [
        'No hidden fees or surprises',
        'Upfront transparent pricing',
        'Complete service packages',
        'One-stop shop convenience'
      ]
    }
  ];

  const handleCardClick = (card) => {
    if (isMobile) {
      setSelectedCard(card);
    }
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    if (selectedCard) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedCard]);

  return (
    <div className="w-full bg-gray-50 py-12 sm:py-16 lg:py-20">

      <h1 className="sr-only">Car Detailing Winnipeg | Best Car Detailing Near Me | Professional Interior and Exterior Car Detailing Services | Vehicle Detailing Winnipeg MB</h1>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 tracking-wide">
            <span style={{ color: '#1393c4' }} className="drop-shadow-lg">
              WHY CHOOSE US
            </span>
          </h2>

          <div className="flex justify-center mt-6">
            <div
              className="w-24 sm:w-32 lg:w-40 h-1 sm:h-1.5 rounded-full shadow-lg"
              style={{
                background: 'linear-gradient(to right, #1393c4, #0f7ba3, #0b6488)',
                boxShadow: '0 4px 15px rgba(19, 147, 196, 0.3)'
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {cardData.map((card) => (
            <div key={card.id} className="card-wrapper" style={{ minHeight: isMobile ? '200px' : '320px' }}>

              {/* Desktop Flip Card */}
              <div className="hidden xl:block group h-full" style={{ perspective: '1000px' }}>
                <div
                  className="flip-card-inner relative w-full h-full transition-transform duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    minHeight: '320px'
                  }}
                >
                  {/* Front */}
                  <div
                    className="flip-card-front absolute inset-0 w-full h-full"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col items-center justify-center p-6 border border-gray-100">
                      <div className={card.isAwardLogo ? 'mb-1' : 'mb-6'}>
                        {card.customImage ? (
                          <Image
                            src={card.customImage}
                            alt={card.frontTitle}
                            width={card.isAwardLogo ? 208 : 112}
                            height={card.isAwardLogo ? 208 : 112}
                            className="object-contain"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={card.icon}
                            className="text-4xl sm:text-5xl lg:text-6xl"
                            style={{ color: '#1393c4' }}
                          />
                        )}
                      </div>

                      <h3 className={`font-bold text-center leading-tight ${card.isAwardLogo ? 'text-lg sm:text-xl lg:text-2xl' : 'text-xl sm:text-2xl lg:text-3xl'}`}>
                        <span style={{ color: '#1393c4' }}>
                          {card.frontTitle}
                        </span>
                      </h3>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="flip-card-back absolute inset-0 w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="bg-white rounded-2xl shadow-xl h-full p-6 border border-gray-100 overflow-y-auto">
                      <div className="flex items-center justify-center mb-4">
                        {card.customImage ? (
                          <Image
                            src={card.customImage}
                            alt={card.backTitle}
                            width={card.isAwardLogo ? 96 : 48}
                            height={card.isAwardLogo ? 96 : 48}
                            className="mr-3 object-contain"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={card.icon}
                            className="text-2xl sm:text-3xl mr-3"
                            style={{ color: '#1393c4' }}
                          />
                        )}
                        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-center">
                          <span style={{ color: '#1393c4' }}>
                            {card.backTitle}
                          </span>
                        </h4>
                      </div>

                      <p className="text-sm sm:text-base mb-4 leading-relaxed" style={{ color: '#1393c4' }}>
                        {card.backContent}
                      </p>

                      <ul className="space-y-2">
                        {card.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm sm:text-base" style={{ color: '#1393c4' }}>
                            <span
                              className="w-1.5 h-1.5 rounded-full mr-3 mt-2 flex-shrink-0"
                              style={{ backgroundColor: '#1393c4' }}
                            ></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile & Tablet Card */}
              <div
                className="block xl:hidden mobile-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center border border-gray-100 cursor-pointer active:scale-95"
                onClick={() => handleCardClick(card)}
                style={{
                  height: isMobile ? '180px' : '280px',
                  padding: isMobile ? '12px 8px' : '20px 12px'
                }}
              >
                <div className={card.isAwardLogo ? 'mb-1' : 'mb-3'}>
                  {card.customImage ? (
                    <Image
                      src={card.customImage}
                      alt={card.frontTitle}
                      width={card.isAwardLogo ? (isMobile ? 80 : 120) : (isMobile ? 48 : 64)}
                      height={card.isAwardLogo ? (isMobile ? 80 : 120) : (isMobile ? 48 : 64)}
                      className="object-contain"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={card.icon}
                      className={isMobile ? 'text-3xl' : 'text-5xl'}
                      style={{ color: '#1393c4' }}
                    />
                  )}
                </div>

                <h3
                  className="font-bold text-center leading-tight"
                  style={{
                    fontSize: card.isAwardLogo ? (isMobile ? '13px' : '18px') : (isMobile ? '14px' : '20px'),
                    color: '#1393c4',
                    padding: '0 4px'
                  }}
                >
                  {card.frontTitle}
                </h3>

                <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2 text-center`} style={{ color: '#1393c4' }}>
                  Tap for details
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedCard && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center flex-1">
                  {selectedCard.customImage ? (
                    <Image
                      src={selectedCard.customImage}
                      alt={selectedCard.backTitle}
                      width={selectedCard.isAwardLogo ? 80 : 48}
                      height={selectedCard.isAwardLogo ? 80 : 48}
                      className="mr-3 sm:mr-4 object-contain flex-shrink-0"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={selectedCard.icon}
                      className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0"
                      style={{ color: '#1393c4' }}
                    />
                  )}
                  <h4
                    id="modal-title"
                    className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight"
                    style={{ color: '#1393c4' }}
                  >
                    {selectedCard.backTitle}
                  </h4>
                </div>
                <button
                  onClick={closeModal}
                  className="ml-3 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-xl sm:text-2xl text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
                <p className="text-sm sm:text-base lg:text-lg mb-5 sm:mb-6 leading-relaxed" style={{ color: '#1393c4' }}>
                  {selectedCard.backContent}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {selectedCard.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-3 mt-2 flex-shrink-0"
                        style={{ backgroundColor: '#1393c4' }}
                      ></span>
                      <span className="text-sm sm:text-base lg:text-lg" style={{ color: '#1393c4' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={closeModal}
                  className="w-full py-3 sm:py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: 'linear-gradient(to right, #1393c4, #0f7ba3)',
                  }}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .group:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .mobile-card:hover {
          box-shadow: 0 25px 50px -12px rgba(19, 147, 196, 0.25);
          transform: translateY(-4px);
        }
        .mobile-card:active {
          box-shadow: 0 10px 25px -5px rgba(19, 147, 196, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CarDetailing;