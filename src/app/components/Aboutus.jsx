"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Car, Medal, ShieldCheck, Wrench, MapPin } from 'lucide-react';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import References from '../components/Reference1';

const ActionCarAbout = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const phrases = [
    "About Us - Factory-Trained.",
    "About Us - Award-Winning.",
    "About Us - Detail-Obsessed."
  ];

  const videoData = [
    {
      title: "Auto Detailing Winnipeg",
      videoId: "HizJuRhbYdE",
      description: "Complete detailing transformation"
    },
    {
      title: "Silver Package Service",
      videoId: "wfvj2vqgrsw",
      description: "Mid-tier detailing excellence"
    },
    {
      title: "Diamond Package Service",
      videoId: "fXgGjLL6pYs",
      description: "Premium detailing experience"
    },
    {
      title: "Ceramic Coating Application",
      videoId: "Bz-g7qz0Iqo",
      description: "Long-lasting paint protection"
    }
  ];

  const services = [
    'Auto Detailing',
    'Ceramic Coating',
    'Paint Protection Film (PPF)',
    'Window Tinting',
    'Paintless Dent Removal'
  ];

  const commitments = [
    'Quality work',
    'Premium products',
    '100% customer satisfaction',
    'Expert craftsmanship'
  ];

  const trustReasons = [
    'XPEL Certified Dealer & Installer',
    'Fully Insured, Professional Studio',
    'Trusted by thousands of happy customers',
    'Clean, modern facility with precision-focused care'
  ];

  // Enhanced typewriter effect
  useEffect(() => {
    const typewriterEffect = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (isDeleting) {
        setDisplayedText(currentPhrase.substring(0, currentCharIndex - 1));
        setCurrentCharIndex(prev => prev - 1);

        if (currentCharIndex === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
        }
      } else {
        setDisplayedText(currentPhrase.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(prev => prev + 1);

        if (currentCharIndex === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const typingSpeed = isDeleting ? 75 : 150;
    const timer = setTimeout(typewriterEffect, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentCharIndex, currentPhraseIndex, isDeleting]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-12');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* SEO via Next.js Head */}
      <Head>
        <title>About Us | Best Car Detailing Winnipeg | XPEL Certified | Action Car Detailing</title>
        <meta name="description" content="Action Car Detailing Winnipeg. 14+ years experience, A+ BBB rating, MPI accredited, XPEL certified. Consumer Choice Award Winner 2026. Best car detailing services including ceramic coating, PPF and window tinting. Free quotes available. Call (204) 775-0005." />
        <link rel="canonical" href="https://actioncardetailing.ca/about-us" />
        <meta property="og:title" content="About Us | Best Car Detailing Winnipeg | XPEL Certified | Action Car Detailing" />
        <meta property="og:description" content="XPEL certified auto detailing studio in Winnipeg. 14+ years experience, Consumer Choice Award Winner 2026. Offering ceramic coating, PPF, window tinting, and paintless dent removal." />
        <meta property="og:image" content="https://actioncardetailing.ca/images/about-us-og.jpg" />
        <meta property="og:url" content="https://actioncardetailing.ca/about-us" />
        <meta name="robots" content="index, follow" />
      </Head>

      <h1 className="sr-only">About Action Car Detailing Winnipeg | XPEL Certified Installers | Best Car Detailing Near Me | Consumer Choice Award Winner 2026</h1>

      {/* Hero Video Section */}
      <div className="relative w-full overflow-hidden bg-white mobile-video-hero">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/images/aboutusbanner.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Enhanced overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40"></div>
      </div>

      {/* Ladder Cards Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">

            {/* Card 1 - Who We Are */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-800 w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12">
              <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-xl border border-sky-300 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-sky-100 p-3 sm:p-4 rounded-lg flex-shrink-0 self-start lg:self-center border border-sky-300">
                    <Car className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" style={{ color: '#1393c4' }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>Who We Are</h2>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg" style={{ color: '#1393c4' }}>
                      <p className="leading-relaxed">
                        At <span className="font-semibold">Action Car Detailing</span>, we do more than clean cars — we restore, protect, and elevate them. Based in Winnipeg with 14+ years of industry experience.
                      </p>
                      <ul className="space-y-2 sm:space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="mt-1 text-lg" style={{ color: '#1393c4' }}>•</span>
                          <span>Certified and authorized by XPEL</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 text-lg" style={{ color: '#1393c4' }}>•</span>
                          <span>Studio run by factory-trained professionals</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - What Sets Us Apart */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-800 w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 ml-auto">
              <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-xl border border-sky-300 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-sky-100 p-3 sm:p-4 rounded-lg flex-shrink-0 self-start lg:self-center border border-sky-300">
                    <Medal className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" style={{ color: '#1393c4' }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>What Sets Us Apart</h2>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg" style={{ color: '#1393c4' }}>
                      <p className="leading-relaxed">
                        We're proud to be the <span className="font-semibold">2026 Consumer Choice Award Winner</span> in the Auto Detailing category — the only winner in Winnipeg & the Greater Region.
                      </p>
                      <div className="bg-sky-50 p-4 sm:p-5 lg:p-6 rounded-lg border border-sky-200">
                        <p className="font-semibold mb-3 text-sm sm:text-base" style={{ color: '#1393c4' }}>Our commitment:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {commitments.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-sm sm:text-base" style={{ color: '#1393c4' }}>✓</span>
                              <span className="font-medium text-sm sm:text-base" style={{ color: '#1393c4' }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Our Services */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-800 w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12">
              <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-xl border border-sky-300 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-sky-100 p-3 sm:p-4 rounded-lg flex-shrink-0 self-start lg:self-center border border-sky-300">
                    <Wrench className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" style={{ color: '#1393c4' }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>Our Services</h2>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg" style={{ color: '#1393c4' }}>
                      <p className="leading-relaxed">Every car gets personalized attention with our premium services:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {services.map((service, index) => (
                          <div key={index} className="flex items-center gap-2 bg-sky-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-sky-200">
                            <span className="font-bold" style={{ color: '#1393c4' }}>•</span>
                            <span className="font-medium text-sm sm:text-base" style={{ color: '#1393c4' }}>{service}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 sm:p-4 rounded-lg text-center mt-4" style={{ backgroundColor: '#1393c4' }}>
                        <p className="font-semibold text-sm sm:text-base lg:text-lg text-white">
                          We don't rush — we perfect every detail.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 - Why Clients Trust Us */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-800 w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 ml-auto">
              <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-xl border border-sky-300 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-sky-100 p-3 sm:p-4 rounded-lg flex-shrink-0 self-start lg:self-center border border-sky-300">
                    <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" style={{ color: '#1393c4' }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>Why Clients Trust Us</h2>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg" style={{ color: '#1393c4' }}>
                      <ul className="space-y-2 sm:space-y-3">
                        {trustReasons.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-lg" style={{ color: '#1393c4' }}>•</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5 - Visit Us */}
            <div className="scroll-animate opacity-0 translate-y-12 transition-all duration-800 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 mx-auto">
              <div className="bg-white text-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 overflow-hidden relative border border-sky-300">
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-sky-100 p-3 sm:p-4 rounded-lg flex-shrink-0 border border-sky-300">
                    <MapPin className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" style={{ color: '#1393c4' }} />
                  </div>
                  <div className="text-center lg:text-left flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>Visit Us</h2>
                    <p className="mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg leading-relaxed" style={{ color: '#1393c4' }}>
                      Come see why Winnipeg trusts us to protect what moves them.
                    </p>
                    <div className="bg-sky-50 p-3 sm:p-4 rounded-lg border border-sky-200 max-w-md mx-auto lg:mx-0">
                      <p className="font-semibold text-sm sm:text-base lg:text-lg" style={{ color: '#1393c4' }}>
                        Experience detailing — done right.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 scroll-animate opacity-0 translate-y-12 transition-all duration-800">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4" style={{ color: '#1393c4' }}>Our Work in Action</h2>
            <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#1393c4' }}>
              See the precision and care we put into every vehicle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {videoData.map((video, index) => (
              <div
                key={index}
                className="scroll-animate opacity-0 translate-y-12 bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-sky-300 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
              >
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2" style={{ color: '#1393c4' }}>
                    {video.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#1393c4' }}>
                    {video.description}
                  </p>
                </div>
                <div className="aspect-video sm:aspect-[21/9] md:aspect-video rounded-lg overflow-hidden bg-sky-50 border border-sky-200">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* References Section */}
      <References />

      <ContactForm />
      <Footer />

      {/* Custom Styles */}
      <style jsx>{`
        .mobile-video-hero {
          height: 60vh;
          min-height: 400px;
        }

        @media (max-width: 767px) {
          .mobile-video-hero {
            height: 50vh;
            min-height: 350px;
            max-height: 500px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .mobile-video-hero {
            height: 70vh;
            min-height: 450px;
          }
        }

        @media (min-width: 1024px) {
          .mobile-video-hero {
            height: 80vh;
            min-height: 500px;
          }
        }

        @media (min-width: 1280px) {
          .mobile-video-hero {
            height: 90vh;
            min-height: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default ActionCarAbout;