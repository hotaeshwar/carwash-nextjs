'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Shield, Sun, Zap, Wifi, CheckCircle, Play, X } from 'lucide-react';
import Image from 'next/image';
import Footer from '../components/Footer';
import Quote from '../components/Quote';
import ContactForm from '../components/ContactForm';
import References from '../components/Reference1';

// Updated: All images and videos now use public folders
const windowTintVideo = '/images/windowtint(1).mp4';

// Images for tinting process
const InstallImage = '/images/winplot.jpg';
const PrepImage = '/images/winprep.jpg';
const ExecuteImage = '/images/winexecute.jpg';

// Other images
const TintLevelsImage = '/images/TINTTESLA-ezgif.com-png-to-jpg-converter.jpg';
const SelectFilmImage = '/images/step1.jpg';
const SelectCoverageImage = '/images/step2.jpg';
const SelectShadeImage = '/images/window-tinting-page.png';
const TwoFrontsImage = '/images/side.png';
const SidesBackImage = '/images/side_back.png';
const WhatShadeImage = '/images/prime.png';

// Film-specific images
const XpelLogo = '/images/xpel.png.webp';
const ColorStableImage = '/images/colorstable1.jpg';
const PrimeHpImage = '/images/primehp1.jpg';
const NanoCeramicImage = '/images/nano ceramic1.png';
const YouTubeThumbnail = '/images/image14.jpg';

// Car images for each product
const ColorStableCarImage = '/images/primecolorstablecar.jpg';
const PrimeHpCarImage = '/images/prime hp car.jpg';
const NanoCeramicCarImage = '/images/image3.jpg';

const WindowTintingSite = () => {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedTint, setSelectedTint] = useState(35);
  const [selectedFilm, setSelectedFilm] = useState('prime-cs');
  const [showQuote, setShowQuote] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  const runningTexts = [
    "SUN GLARE",
    "SKIN RADIATION", 
    "UV DAMAGE",
    "FADED INTERIORS"
  ];

  // Running text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % runningTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [runningTexts.length]);

  // Video setup and autoplay
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;

    const adjustVideoFit = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const screenRatio = width / height;
      const videoRatio = 16 / 9;
      
      video.style.objectFit = 'cover';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.position = 'absolute';
      video.style.top = '0';
      video.style.left = '0';
      video.style.transform = 'translateZ(0)';
      
      if (screenRatio > videoRatio) {
        video.style.objectPosition = 'center center';
      } else {
        video.style.objectPosition = 'center 40%';
      }
    };
    
    const setupVideo = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.preload = 'auto';
      video.poster = '';
      video.style.willChange = 'transform';
      video.style.backfaceVisibility = 'hidden';
      
      adjustVideoFit();
      
      video.addEventListener('canplay', () => setIsVideoPlaying(true));
      video.addEventListener('playing', () => setIsVideoPlaying(true));
      video.addEventListener('pause', () => setIsVideoPlaying(false));
    };
    
    const playVideo = async () => {
      try {
        if (video.readyState >= 2) {
          await video.play();
          setIsVideoPlaying(true);
        } else {
          video.addEventListener('loadeddata', async () => {
            try {
              await video.play();
              setIsVideoPlaying(true);
            } catch (error) {
              // Silent fail for mobile browsers
            }
          }, { once: true });
        }
      } catch (error) {
        // Silent fail - user interaction may be required
        const enableVideo = async () => {
          try {
            await video.play();
            setIsVideoPlaying(true);
            document.removeEventListener('click', enableVideo);
            document.removeEventListener('touchstart', enableVideo);
          } catch (err) {
            // Silent fail
          }
        };
        
        document.addEventListener('click', enableVideo, { once: true });
        document.addEventListener('touchstart', enableVideo, { once: true });
      }
    };
    
    setupVideo();
    
    let resizeTimeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(adjustVideoFit, 100);
    };
    
    window.addEventListener('resize', throttledResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(adjustVideoFit, 300);
    });
    
    setTimeout(playVideo, 100);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', adjustVideoFit);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const getContainerHeight = useCallback(() => {
    if (typeof window === 'undefined') return '100vh';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width < 768) {
      return `${Math.min(height * 0.6, 500)}px`;
    } else if (width < 1024) {
      return `${Math.min(height * 0.7, 600)}px`;
    } else {
      return '100vh';
    }
  }, []);

  // Intersection Observer for cards
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = cardRefs.current.indexOf(entry.target);
          setVisibleCards(prev => new Set([...prev, index]));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const tintOptions = [5, 20, 35, 50, 70];

  const filmTypes = {
    'prime-cs': {
      name: 'Prime Color Stable',
      subtitle: '',
      description: 'Safety and Color Stability Like Never Before. When comfort and cost is key, dyed window tint won\'t let you down. PRIME CS BLACK can cut out the glare, protect your skin from harmful UV rays, and make any journey that much more enjoyable.',
      features: [
        'UV Ray Protection - SPF 500 protection from 99% harmful UV Rays',
        'Good Looks - Stylish statement that won\'t fade or turn purple',
        'Crystal Clear Signal - Clear communication in today\'s digital world',
        'Color Stability - Dyed film that maintains its appearance over time'
      ],
      grade: 'GOOD',
      logo: XpelLogo,
      carImage: ColorStableCarImage,
      productImage: ColorStableImage
    },
    'prime-hp': {
      name: 'Prime HP',
      subtitle: 'Heat Rejection Tint',
      description: 'XPEL window tint PRIME HP can give your vehicle the look & feel you want without breaking the bank. Providing powerful UV protection and a full spectrum selection of VLTs, HP window tint is a great film option for vehicles of all varieties.',
      features: [
        'Technology - Blocks 53% infrared heat to keep the vehicle cooler',
        'UV Ray Protection - Blocks the vast majority of the sun\'s heat-causing radiation',
        'Blend Performance & Value - Ceramic Window Tint is a perfect marriage of value and performance',
        'Crystal Clear Signal - Clear Communication in today\'s digital world'
      ],
      grade: 'BETTER',
      logo: XpelLogo,
      carImage: PrimeHpCarImage,
      productImage: PrimeHpImage
    },
    'nano-ceramic': {
      name: 'NANO-CERAMIC (IR)',
      subtitle: 'Max UV & Heat Rejection Tint',
      description: 'There\'s no better place to start than the top. If you\'re looking for maximum performance & protection, look no further than nano-ceramic PRIME XR. Ceramic tint is designed to provide the most heat rejection possible, while reflecting harmful UV rays to keep you safe. This window tint will make your vehicle cooler & more comfortable wherever you\'re headed.',
      features: [
        'Nano Ceramic Technology - Blocks 88% infrared heat',
        'UV Ray Protection - SPF 1000 protection from 99% harmful UV Rays',
        'Superior Performance - Maximum heat rejection and UV protection',
        'Crystal Clear Signal - No interference with radio, cellular, or Bluetooth'
      ],
      grade: 'BEST',
      logo: XpelLogo,
      carImage: NanoCeramicCarImage,
      productImage: NanoCeramicImage
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .animate-card {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .animate-card.animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .typewriter {
          display: inline-block;
          border-right: 3px solid #1393c4;
          animation: blink 0.7s infinite;
          min-height: 1.2em;
        }

        @keyframes blink {
          0%, 50% { border-color: #1393c4; }
          51%, 100% { border-color: transparent; }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .video-modal-content {
          background: transparent;
          border-radius: 12px;
          padding: 0;
          max-width: 90vw;
          width: auto;
          max-height: 90vh;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
          z-index: 10000;
        }

        .modal-close:hover {
          background-color: #f3f4f6;
          color: #333;
        }

        .video-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: white;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .video-close:hover {
          background-color: rgba(0, 0, 0, 0.9);
        }

        .tint-levels-image {
          width: 100%;
          height: auto;
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .tint-levels-image {
            height: auto;
            max-height: none;
            width: 100%;
            object-fit: contain;
            background-color: #f8fafc;
            padding: 10px;
          }
        }

        .why-tinting-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .why-tinting-image {
            height: 250px;
            object-fit: contain;
            background-color: #f8fafc;
            padding: 10px;
          }
        }

        .film-logo {
          height: 60px;
          object-fit: contain;
          margin: 0 auto 8px auto;
        }

        .film-car-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 8px;
          margin: 12px 0;
        }

        .xpel-logo {
          width: 80px;
          height: auto;
          object-fit: contain;
          margin: 0 auto 12px auto;
        }

        .video-thumbnail-container {
          position: relative;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .video-thumbnail-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .video-thumbnail {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }

        .video-play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: rgba(19, 147, 196, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .video-play-button:hover {
          background: rgba(19, 147, 196, 1);
          transform: translate(-50%, -50%) scale(1.1);
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .video-thumbnail-container:hover .video-overlay {
          background: rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .video-thumbnail {
            height: 200px;
          }
          
          .video-play-button {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>

      <h1 className="sr-only">Expert Window Tinting Installers in Winnipeg | Best Car Window Tint Near Me | XPEL Automotive Window Tint</h1>

      {/* Hero Video Section */}
      <section 
        className="relative overflow-hidden"
        style={{ height: getContainerHeight() }}
      >
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center center',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          controls={false}
        >
          <source src={windowTintVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              {/* Optional title overlay */}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Content Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight" style={{ color: '#1393c4' }}>
            WINDOW TINTING
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 font-medium" style={{ color: '#1393c4' }}>Say Goodbye To...</p>
          <div className="h-10 sm:h-12 mb-4 sm:mb-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold typewriter" style={{ color: '#1393c4' }}>
              {runningTexts[currentText]}
            </h3>
          </div>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 font-medium" style={{ color: '#1393c4' }}>
            Before It Happens
          </p>
          <button
            onClick={() => setShowQuote(true)}
            className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl sm:shadow-2xl hover:opacity-90"
            style={{ backgroundColor: '#1393c4' }}
          >
            Get Quote Now
          </button>
        </div>
      </section>

      {/* Why Window Tinting Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 leading-tight" style={{ color: '#1393c4' }}>
                WHY WINDOW TINTING?
              </h2>
              <div className="mb-6 sm:mb-8">
                <div className="relative w-full h-[250px] md:h-[400px]">
                  <Image
                    src={TintLevelsImage}
                    alt="Tint Levels"
                    fill
                    className="why-tinting-image object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6 sm:space-y-8">
              <div className="p-4 sm:p-6 rounded-xl bg-white">
                <h3 className="text-xl sm:text-2xl md:text-2xl font-bold mb-3 sm:mb-4 leading-tight" style={{ color: '#1393c4' }}>
                  Experience a New Level of Heat Rejection, UV Protection, & Good Looks
                </h3>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6" style={{ color: '#1393c4' }}>
                  We recommend Ceramic window film for maximum heat rejection, glare reduction, and comfort. Gone are the days of needing dark windows to provide relief; even our ultra-light films provide extreme heat reduction, so choose your shade based on your style. All films provide +99% UV protection & Lifetime Warranty. Protect delicate interiors and your loved ones!!!
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div 
                  ref={el => cardRefs.current[0] = el}
                  className={`animate-card p-4 sm:p-6 rounded-xl bg-white ${
                    visibleCards.has(0) ? 'animate-fade-in' : ''
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#1393c4' }}>
                      <Sun className="text-white" size={16} />
                    </div>
                    <h4 className="font-bold text-base sm:text-lg" style={{ color: '#1393c4' }}>Superior Heat Rejection</h4>
                  </div>
                  <p className="text-xs sm:text-sm" style={{ color: '#1393c4' }}>multilayer nano-ceramic particle technology blocks up to 88% of the infrared heat</p>
                </div>

                <div 
                  ref={el => cardRefs.current[1] = el}
                  className={`animate-card p-4 sm:p-6 rounded-xl bg-white ${
                    visibleCards.has(1) ? 'animate-fade-in' : ''
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#1393c4' }}>
                      <Shield className="text-white" size={16} />
                    </div>
                    <h4 className="font-bold text-base sm:text-lg" style={{ color: '#1393c4' }}>UV Ray Protection</h4>
                  </div>
                  <p className="text-xs sm:text-sm" style={{ color: '#1393c4' }}>XPEL PRIME XR PLUS provides SPF 1,000 protection that effectively blocks over 99% of harmful UV rays</p>
                </div>

                <div 
                  ref={el => cardRefs.current[2] = el}
                  className={`animate-card p-4 sm:p-6 rounded-xl bg-white ${
                    visibleCards.has(2) ? 'animate-fade-in' : ''
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#1393c4' }}>
                      <Zap className="text-white" size={16} />
                    </div>
                    <h4 className="font-bold text-base sm:text-lg" style={{ color: '#1393c4' }}>Greater Clarity</h4>
                  </div>
                  <p className="text-xs sm:text-sm" style={{ color: '#1393c4' }}>Advanced nano construction in XPEL PRIME XR provides superior performance without reducing outbound visibility</p>
                </div>

                <div 
                  ref={el => cardRefs.current[3] = el}
                  className={`animate-card p-4 sm:p-6 rounded-xl bg-white ${
                    visibleCards.has(3) ? 'animate-fade-in' : ''
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#1393c4' }}>
                      <Wifi className="text-white" size={16} />
                    </div>
                    <h4 className="font-bold text-base sm:text-lg" style={{ color: '#1393c4' }}>Crystal Clear Signal</h4>
                  </div>
                  <p className="text-xs sm:text-sm" style={{ color: '#1393c4' }}>In the digital world, clear communication is key. PRIME XR PLUS construction will not interfere with radio, cellular, or Bluetooth signals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Window Tint as Easy as 1,2,3 */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 leading-tight" style={{ color: '#1393c4' }}>
            Window Tint as Easy as <span style={{ color: '#1393c4', opacity: 0.8 }}>1, 2, 3</span>:
          </h2>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              { number: "1", title: "Select the Film", image: SelectFilmImage },
              { number: "2", title: "Select the Coverage", image: SelectCoverageImage },
              { number: "3", title: "Select the Shade", image: SelectShadeImage }
            ].map((step, index) => (
              <div 
                key={index}
                ref={el => cardRefs.current[4 + index] = el}
                className={`animate-card text-center ${visibleCards.has(4 + index) ? 'animate-fade-in' : ''}`}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4 sm:mb-6 text-white" style={{ backgroundColor: '#1393c4' }}>
                  {step.number}
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>{step.title}</h3>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                  <div className="relative w-full h-48 mb-3 sm:mb-4">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="rounded object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  {index === 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm" style={{ backgroundColor: '#1393c4', opacity: 0.7 }}>
                        <span>PRIME CS</span>
                        <span>GOOD</span>
                      </div>
                      <div className="flex items-center justify-between text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm" style={{ backgroundColor: '#1393c4', opacity: 0.85 }}>
                        <span>PRIME HP</span>
                        <span>BETTER</span>
                      </div>
                      <div className="flex items-center justify-between text-white px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm" style={{ backgroundColor: '#1393c4' }}>
                        <span>PRIME XR</span>
                        <span>BEST</span>
                      </div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="flex justify-center space-x-2">
                      {tintOptions.map((tint) => (
                        <button
                          key={tint}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-all duration-200 ${
                            selectedTint === tint
                              ? 'text-white'
                              : 'hover:opacity-80'
                          }`}
                          style={{
                            backgroundColor: selectedTint === tint ? '#1393c4' : '#f0f9ff',
                            color: selectedTint === tint ? 'white' : '#1393c4'
                          }}
                          onClick={() => setSelectedTint(tint)}
                        >
                          {tint}
                        </button>
                      ))}
                    </div>
                  )}
                  {index === 2 && (
                    <div className="flex justify-center space-x-2 text-xs sm:text-sm" style={{ color: '#1393c4' }}>
                      <span>5%</span>
                      <span>•</span>
                      <span>20%</span>
                      <span>•</span>
                      <span>35%</span>
                      <span>•</span>
                      <span>50%</span>
                      <span>•</span>
                      <span>70%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Video Section with Thumbnail */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div 
                className="video-thumbnail-container"
                onClick={() => setShowVideo(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowVideo(true)}
              >
                <div className="relative w-full h-[200px] md:h-[300px]">
                  <Image
                    src={YouTubeThumbnail}
                    alt="XPEL PRIME Window Film Video"
                    fill
                    className="video-thumbnail object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
                <div className="video-overlay">
                  <div className="video-play-button">
                    <Play className="text-white ml-1" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Film Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 leading-tight" style={{ color: '#1393c4' }}>
            1. WHAT FILM?
          </h2>
          <p className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: '#1393c4' }}>
            Many shops offering window tint will quote you pricing based on their film just to get you in the door. Once there, they educate you on films and upsell you after you realize the kind of film you desire and the number of windows you really need (legal), thus you end up spending much more then you originally thought.
          </p>
          <p className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 text-sm sm:text-base md:text-lg font-semibold" style={{ color: '#1393c4' }}>
            We are transparent with all of our Pricing and Options as we treat our clients as we like to be treated; no surprises! The Color Stable, Ceramic Nano Ceramic choice simply comes down to budget - both lines we carry are quality products.
          </p>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(filmTypes).map(([key, film], index) => (
              <div 
                key={key} 
                ref={el => cardRefs.current[7 + index] = el}
                className={`animate-card bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col ${
                  visibleCards.has(7 + index) ? 'animate-fade-in' : ''
                }`}
              >
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <div className="text-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-1 sm:mb-2 min-h-[28px]" style={{ color: '#1393c4' }}>{film.name}</h3>
                    <div className="min-h-[44px] mb-2 sm:mb-3">
                      {film.subtitle && (
                        <p className="text-xs sm:text-sm font-semibold" style={{ color: '#1393c4' }}>{film.subtitle}</p>
                      )}
                    </div>

                    <div className="mb-3 sm:mb-4 flex justify-center">
                      <div className="relative w-20 h-16">
                        <Image
                          src={film.logo}
                          alt="XPEL Logo"
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4 flex items-center justify-center min-h-[100px] sm:min-h-[128px]">
                    <div className="relative w-full h-32">
                      <Image
                        src={film.productImage}
                        alt={`${film.name} Product`}
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4 flex items-center justify-center min-h-[150px] sm:min-h-[180px]">
                    <div className="relative w-full h-48">
                      <Image
                        src={film.carImage}
                        alt={`${film.name} Car`}
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>

                  <div className="text-center text-xl sm:text-2xl font-black mb-3 sm:mb-4" style={{ color: '#1393c4' }}>
                    {film.grade}
                  </div>

                  <p className="text-xs leading-relaxed mb-3 sm:mb-4 flex-grow" style={{ color: '#1393c4' }}>
                    {film.description}
                  </p>

                  <div className="space-y-1 sm:space-y-2 mt-auto">
                    {film.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-1 sm:space-x-2">
                        <CheckCircle className="mt-0.5 sm:mt-1 flex-shrink-0" style={{ color: '#1393c4' }} size={12} />
                        <span className="text-xs leading-tight" style={{ color: '#1393c4' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Coverage Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 leading-tight" style={{ color: '#1393c4' }}>
            2. WHAT COVERAGE?
          </h2>
          <p className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: '#1393c4' }}>
            For maximum UV Protection, heat rejection, we recommend doing as much as the budget allows. A chain is only as strong as its weakest link and for the highest levels of interior protection consider all glass. Many think that factory "privacy" glass is a protective tint - unfortunately it is shaded for looks only and does not help with UV or Heat.
          </p>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { title: "TWO FRONTS:", image: TwoFrontsImage },
              { title: "SIDES AND BACK:", image: SidesBackImage }
            ].map((item, index) => (
              <div 
                key={index}
                ref={el => cardRefs.current[10 + index] = el}
                className={`animate-card text-center ${visibleCards.has(10 + index) ? 'animate-fade-in' : ''}`}
              >
                <h3 className="text-xl sm:text-2xl md:text-2xl font-bold mb-6 sm:mb-8" style={{ color: '#1393c4' }}>{item.title}</h3>
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                  <div className="relative w-full h-64 mb-4 sm:mb-6">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <button
                    onClick={() => setShowQuote(true)}
                    className="text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:opacity-90 text-sm sm:text-base"
                    style={{ backgroundColor: '#1393c4' }}
                  >
                    Get A Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Window Tint Simulator Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 leading-tight" style={{ color: '#1393c4' }}>
            3. WHAT SHADE?
          </h2>
          <p className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: '#1393c4' }}>
            Try our interactive window tint simulator to see how different shades will look on your vehicle.
          </p>

          <div className="text-center mb-8 sm:mb-12">
            <div className="p-6 sm:p-8 rounded-xl shadow-xl w-full bg-white">
              <a
                href="https://www.xpel.com/automotive-window-tint-simulator"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity duration-300"
              >
                <div className="relative w-full h-[200px] md:h-[400px] max-w-4xl mx-auto">
                  <Image
                    src={WhatShadeImage}
                    alt="Window Tint Simulator - Click to access XPEL interactive simulator"
                    fill
                    className="rounded-lg cursor-pointer object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Tinting Process */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 leading-tight" style={{ color: '#1393c4' }}>
            OUR TINTING PROCESS
          </h2>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { number: "1", title: "WE PREP", image: PrepImage, description: "Using XPEL's DAP software and the best patterns available, we apply film for a precise fit. We then thermally shrink each panel onto the glass and shave all edges for a smooth install." },
              { number: "2", title: "WE PLOT", image: InstallImage, description: "With XPEL's Design Access Program (DAP), we create a perfect blueprint for your vehicle's glass. Every cut is digitally mapped to match your exact year, make, and model, ensuring maximum coverage and precision. This plotting process eliminates the need for risky hand-cutting on your vehicle, preserving your glass and trim while setting the stage for a flawless installation." },
              { number: "3", title: "WE EXECUTE", image: ExecuteImage, description: "We aren't a 'volume' shop that rushes jobs in and out to remain profitable. Rather, we go the extra mile to help you choose the right film, make the install as dust-free as possible, and return the vehicle cleaner than we received it. We want you to find value in how we treat both you and your vehicle, ultimately earning your repeat and referral business." }
            ].map((step, index) => (
              <div 
                key={index}
                ref={el => cardRefs.current[12 + index] = el}
                className={`animate-card text-center ${visibleCards.has(12 + index) ? 'animate-fade-in' : ''}`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4 sm:mb-6 text-white" style={{ backgroundColor: '#1393c4' }}>
                  {step.number}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#1393c4' }}>{step.title}</h3>
                <div className="bg-white rounded-xl overflow-hidden mb-4 sm:mb-6 shadow-lg">
                  <div className="relative w-full h-40 sm:h-48">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: '#1393c4' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 leading-tight" style={{ color: '#1393c4' }}>
            Ready to Transform Your Vehicle?
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto font-medium" style={{ color: '#1393c4' }}>
            Experience the ultimate in UV protection, heat rejection, and style with our professional window tinting services.
          </p>
          <button
            onClick={() => setShowQuote(true)}
            className="text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl sm:shadow-2xl hover:opacity-90"
            style={{ backgroundColor: '#1393c4' }}
          >
            Get Your Free Quote Today
          </button>
        </div>
      </section>

      {/* References Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-sky-100 via-white to-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <References />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-sky-100 via-white to-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Quote Modal */}
      {showQuote && (
        <div className="modal-overlay" onClick={() => setShowQuote(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowQuote(false)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <Quote isOpen={showQuote} onClose={() => setShowQuote(false)} />
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && (
        <div className="modal-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-close"
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
            >
              <X size={20} />
            </button>
            <iframe
              width="800"
              height="450"
              src="https://www.youtube.com/embed/RPLIOjXU_oQ?autoplay=1"
              title="XPEL PRIME Window Film Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg max-w-full"
            ></iframe>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WindowTintingSite;