'use client';

import { RotateCcw, Droplets, Target, RefreshCw, Zap, Car, Calendar } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import PaintPolishingForm from '../components/PaintPolishingForm';
import ContactForm from '../components/ContactForm';
import References from '../components/Reference1';

// ✅ CHANGED: No imports - served from /public folder
const paintCorrectionVideo = '/images/PaintCorrectionPolishing.mp4';
const heroBackground = '/images/car6.png';

const PaintCorrection = () => {
  const videoRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [visibleSections, setVisibleSections] = useState([]);

  const scrollToPaintPolishingForm = () => {
    const formSection = document.getElementById('paint-polishing-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Video handling effect
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isIPad = (
        (width === 768) || (width === 820) || (width === 834) || (width === 1024) ||
        navigator.userAgent.includes('iPad') || 
        (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document)
      );
      setIsSmallScreen(width < 768 && !isIPad);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const video = videoRef.current;
    
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.preload = 'metadata';
      video.poster = '';
      video.style.willChange = 'transform';
      video.style.backfaceVisibility = 'hidden';
      
      const adjustVideoFit = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const isIPad = (
          (width === 768 && height === 1024) ||
          (width === 820 && height === 1180) ||
          (width === 834 && height === 1194) ||
          (width === 1024 && height === 1366) ||
          (height === 768 && width === 1024) ||
          (height === 820 && width === 1180) ||
          (height === 834 && width === 1194) ||
          (height === 1024 && width === 1366) ||
          (navigator.userAgent.includes('iPad') || 
           (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document))
        );
        
        const screenRatio = width / height;
        const videoRatio = 16 / 9;
        
        video.style.objectFit = 'cover';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.transform = 'translateZ(0)';
        
        if (isIPad) {
          video.style.objectPosition = 'center center';
          video.style.minWidth = '100%';
          video.style.minHeight = '100%';
        } else if (screenRatio > videoRatio) {
          video.style.objectPosition = 'center center';
        } else {
          video.style.objectPosition = 'center 40%';
        }
      };
      
      adjustVideoFit();
      
      let resizeTimeout;
      const throttledResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustVideoFit, 100);
      };
      
      window.addEventListener('resize', throttledResize);
      window.addEventListener('orientationchange', () => {
        setTimeout(adjustVideoFit, 300);
      });
      
      const playVideo = async () => {
        try {
          if (video.readyState >= 2) {
            await video.play();
          } else {
            video.addEventListener('loadeddata', async () => {
              try {
                await video.play();
              } catch (error) {
                console.log('Autoplay failed, waiting for user interaction');
              }
            }, { once: true });
          }
        } catch (error) {
          const enableVideo = async () => {
            try {
              await video.play();
              document.removeEventListener('click', enableVideo);
              document.removeEventListener('touchstart', enableVideo);
            } catch (err) {
              console.log('Video play failed:', err);
            }
          };
          document.addEventListener('click', enableVideo, { once: true });
          document.addEventListener('touchstart', enableVideo, { once: true });
        }
      };
      
      setTimeout(playVideo, 100);
      
      return () => {
        window.removeEventListener('resize', throttledResize);
        window.removeEventListener('orientationchange', adjustVideoFit);
        clearTimeout(resizeTimeout);
      };
    }

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // iPad-specific height calculation
  const getContainerHeight = () => {
    if (typeof window === 'undefined') return '100vh';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const isIPad = (
      (width === 768 && height === 1024) ||
      (width === 820 && height === 1180) ||
      (width === 834 && height === 1194) ||
      (width === 1024 && height === 1366) ||
      (height === 768 && width === 1024) ||
      (height === 820 && width === 1180) ||
      (height === 834 && width === 1194) ||
      (height === 1024 && width === 1366) ||
      (navigator.userAgent.includes('iPad') || 
       (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document))
    );
    
    if (width < 768) {
      return Math.min(height * 0.6, 500);
    } else if (isIPad) {
      return Math.min(width * 0.5625, height * 0.6);
    } else if (width < 1024) {
      return Math.min(height * 0.7, 600);
    } else {
      return '100vh';
    }
  };

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('[data-card-index]');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.8) {
          setTimeout(() => {
            setVisibleCards(prev => {
              if (!prev.includes(index)) return [...prev, index];
              return prev;
            });
          }, index * 200);
        }
      });

      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.8) {
          const sectionName = section.dataset.section;
          setVisibleSections(prev => {
            if (!prev.includes(sectionName)) return [...prev, sectionName];
            return prev;
          });
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f2027' }}>

      {/* Hero Section with Video */}
      <section className="bg-black">
        <div 
          className="relative w-full overflow-hidden bg-black"
          style={{ 
            height: getContainerHeight(),
            minHeight: isSmallScreen ? '300px' : '400px'
          }}
        >
          <div className="absolute inset-0 z-0" style={{ height: '100%', width: '100%' }}>
            <video
              ref={videoRef}
              className="w-full h-full"
              src={paintCorrectionVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster=""
              controls={false}
              style={{
                objectFit: 'cover',
                objectPosition: 'center center',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
                WebkitTransform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                height: '100%',
                width: '100%',
                minHeight: '100%',
                minWidth: '100%'
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1/4 sm:h-1/3 md:h-1/3 lg:h-1/3 bg-gradient-to-t from-black/40 to-transparent z-10" />

          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex flex-col items-center">
              <span className="text-white text-sm mb-2 tracking-widest font-medium drop-shadow-md">SCROLL</span>
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-sky-500/40 animate-pulse"></div>
                <div className="animate-bounce bg-sky-600/90 p-2 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Content */}
      <section className="bg-white">
        <div 
          className={`bg-white py-10 transition-all duration-1000 ease-out transform ${
            visibleSections.includes('hero') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
          data-section="hero"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4 tracking-tight" style={{ color: '#1393c4' }}>
              PAINT CORRECTION
              <span className="block text-3xl mt-2" style={{ color: '#1393c4' }}>
                POLISHING
              </span>
            </h1>
            
            <div className="mt-6 mb-6">
              <button
                onClick={scrollToPaintPolishingForm}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-[#1393c4] rounded-md hover:bg-[#0f7ba3] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Calendar className="w-5 h-5 mr-2" />
                BOOK NOW
              </button>
            </div>
            
            <p className="text-lg max-w-3xl mx-auto font-medium px-6 py-4 rounded-lg border-2 bg-white" style={{ color: '#1393c4', borderColor: '#1393c4' }}>
              Transform your vehicle's paint to showroom perfection with our professional correction services
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section 
        className={`py-12 bg-white relative overflow-hidden transition-all duration-1000 ease-out transform ${
          visibleSections.includes('services') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
        data-section="services"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1393c4' }}>
              GET THAT CAR PAINT LOOKING
              <span className="block" style={{ color: '#1393c4' }}>NEW AGAIN!</span>
            </h2>
            <p className="text-lg max-w-4xl mx-auto" style={{ color: '#1393c4' }}>
              <span className="font-semibold">Eliminate imperfections</span> formed on your vehicle's paint surface back to a true shine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[
              {
                icon: RotateCcw,
                title: "Scratch and Swirl Marks",
                description: "Remove heavy swirls and scratch marks, restoring your car paint to near factory conditions. Our skilled specialists safely repair these imperfections, achieving the best results."
              },
              {
                icon: RefreshCw,
                title: "Oxidation and Fading",
                description: "Bring your car's paint colour back to its original luster and shine. We restore the years of paint faded away under the sun's brutal UV rays and remove accelerated damage from heavy oxidation."
              },
              {
                icon: Target,
                title: "Paint Holograms",
                description: "Our polishing team has the right knowledge and experience to correct improper use of high speed rotary buffers that have formed buffer trails or buffer swirls on the surface of your car."
              },
              {
                icon: Zap,
                title: "Bird Dropping Etching",
                description: "Bird droppings contain uric acid – a chemical that is corrosive enough to quickly eat through wax or sealants, etching your car paint. Our experts address the situation with precision."
              },
              {
                icon: Droplets,
                title: "Water Spot Damage",
                description: "Rainwater is not pure and naturally acidic. If left unattended, can result in etching your paint or clear coat. These drops will appear as rough or circular-shaped marks where the water has evaporated."
              },
              {
                icon: Car,
                title: "Automatic Carwashes",
                description: "An automatic car wash can leave scratches and swirls behind damaging your paint. Many times brushes used to scrub your vehicle are not cleaned from previously washed cars."
              }
            ].map((service, index) => {
              const IconComponent = service.icon;
              const isVisible = visibleCards.includes(index);
              return (
                <div 
                  key={index}
                  data-card-index={index}
                  className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 transform transition-all duration-800 ease-out hover:-translate-y-2 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-16 scale-95'
                  }`}
                  style={{ borderColor: '#1393c4' }}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#1393c4' }}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#1393c4' }}>{service.title}</h3>
                  </div>
                  <p className="leading-relaxed text-center text-sm" style={{ color: '#1393c4' }}>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        className={`py-12 bg-white relative transition-all duration-1000 ease-out transform ${
          visibleSections.includes('process') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
        data-section="process"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1393c4' }}>OUR PROCESS</h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#1393c4' }}>
              Professional paint correction through our proven 4-step process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* ✅ CHANGED: img src now uses /public path */}
                <img
                  src={heroBackground}
                  alt="Paint Correction Process"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(19, 147, 196, 0.3), transparent)` }}></div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              {[
                { step: "1", title: "Wash Process followed by Clay Bar", description: "Eliminate all surface contaminants causing permanent damage.", bgColor: '#1393c4' },
                { step: "2", title: "Wet Sanding / Leveling", description: "Remove top layer clear coat, buffing & polishing deep scratches.", bgColor: '#0f8bb8' },
                { step: "3", title: "Buffing & Polishing", description: "Several stages of polishing are often required to achieve full correction.", bgColor: '#1aa3d0' },
                { step: "4", title: "Sealing and Coating", description: "Coat your car's paint to protect it from further scratching.", bgColor: '#0c7aa4' }
              ].map((process, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300" 
                       style={{ backgroundColor: process.bgColor }}>
                    {process.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#1393c4' }}>{process.title}</h3>
                    <p className="leading-relaxed text-sm" style={{ color: '#1393c4' }}>{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        className={`py-16 bg-white relative transition-all duration-1000 ease-out transform ${
          visibleSections.includes('pricing') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
        data-section="pricing"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1393c4' }}>PAINT CORRECTION COSTS</h2>
            <p className="text-xl font-bold mb-8" style={{ color: '#1393c4' }}>GET A FLAWLESS FINISH</p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-12 text-center shadow-2xl transform hover:scale-105 transition-all duration-300 border-2" 
                 style={{ borderColor: '#1393c4' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1393c4' }}>
                PAINT CORRECTION AND POLISHING
              </h3>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <span className="text-lg" style={{ color: '#1393c4' }}>starting at</span>
                <span className="text-4xl font-bold" style={{ color: '#1393c4' }}>$200</span>
              </div>
            </div>
          </div>

          <div className="text-center bg-white rounded-2xl p-12 shadow-xl border-2" style={{ borderColor: '#1393c4' }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: '#1393c4' }}>Our Packages</h3>
            <p className="text-lg font-semibold mb-6" style={{ color: '#1393c4' }}>Pick your vehicle and Detailing Package</p>
            <p className="text-base" style={{ color: '#1393c4' }}>
              Please note that for all the services <span className="font-semibold">scheduled</span> later in the <span className="font-semibold">afternoon</span>, the vehicle pickup will be the <span className="font-semibold">next day</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className={`py-16 bg-white transition-all duration-1000 ease-out transform ${
          visibleSections.includes('cta') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
        data-section="cta"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#1393c4' }}>Ready to Transform Your Vehicle?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#1393c4' }}>
            Get professional paint correction that brings back your car's showroom shine
          </p>
        </div>
      </section>

      {/* Paint Polishing Form Section */}
      <section id="paint-polishing-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PaintPolishingForm />
        </div>
      </section>
      
      {/* References Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <References />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaintCorrection;