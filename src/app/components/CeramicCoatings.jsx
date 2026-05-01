'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Check, Shield, Star, Droplets, Settings, HardHat, Sun, Atom, Beaker, X, User, Phone, Mail, Car, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import References from '../components/Reference1';

// Updated: All images and videos now use public folders
const ceramicCoatingVideo = '/images/Ceramic coating (1).mp4';
const financeitLogo = '/images/financeit.jpg.webp';
const fusionPlusLite = '/images/XPEL FUSION PLUS LITE COATING.webp';
const fusionPlusPaintPPF = '/images/XPEL FUSION PLUS PAINT& PPF COATING.webp';
const fusionPlusPremium = '/images/XPEL FUSION PLUS PREMIUM COATING.webp';
const protectVehicleLogo = '/images/PROTECT YOUR VEHICLE WITH XPEL FUSION PLUS CERAMIC COATING.webp';
const fusionPlusProcess = '/images/FUSION PLUS ceamic coating.webp';

// Ceramic Coating Quote Modal Component
const CeramicCoatingQuoteModal = ({ isOpen, onClose, selectedPackage }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    makeModel: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedProtectionLevel, setSelectedProtectionLevel] = useState('');

  // Ceramic Coating Packages
  const protectionLevels = [
    {
      id: 'fusion-plus-lite',
      title: 'FUSION PLUS LITE',
      warranty: '1 year warranty',
      description: 'Basic protection with 1-year coverage',
      features: [
        "Professional-Grade 9H Ceramic Coating",
        "1-year warranty protection",
        "Enhanced gloss & hydrophobic properties",
        "Basic paint protection",
        "Professional application"
      ]
    },
    {
      id: 'fusion-plus-paint-ppf',
      title: 'FUSION PLUS PAINT & PPF',
      warranty: '4 years warranty',
      description: 'Premium paint protection film with 4-year warranty',
      features: [
        "Professional-Grade 9H Ceramic Coating",
        "4-year warranty coverage",
        "PPF-safe formula",
        "Superior chemical resistance",
        "Maximum gloss enhancement",
        "Paint correction included"
      ]
    },
    {
      id: 'fusion-plus-premium',
      title: 'FUSION PLUS PREMIUM',
      warranty: '8 years warranty',
      description: 'Ultimate protection with 8-year comprehensive warranty',
      features: [
        "Professional-Grade 9H Ceramic Coating",
        "8-year warranty protection",
        "Ultimate scratch resistance",
        "Premium hydrophobic coating",
        "Complete paint correction",
        "Full vehicle coverage",
        "Complimentary maintenance kit"
      ]
    }
  ];

  useEffect(() => {
    if (selectedPackage && isOpen) {
      setSelectedProtectionLevel(selectedPackage);
    }
  }, [selectedPackage, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProtectionLevelSelect = (levelId) => {
    setSelectedProtectionLevel(levelId);
    setOpenDropdown(null);
  };

  const toggleDropdown = () => {
    setOpenDropdown(openDropdown === 'protection' ? null : 'protection');
  };

  const generateQuoteId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CERAMIC';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const sendEmail = async (quoteId) => {
    const emailFormData = new FormData();
    
    emailFormData.append('access_key', 'ba99ae3b-60cc-404c-b207-2a42e86aafb6');
    emailFormData.append('autoresponse', 'false');
    emailFormData.append('subject', `Ceramic Coating Quote Request – Confirmation Pending`);
    emailFormData.append('from_name', 'Action Car Detailing');
    emailFormData.append('email', formData.email);
    emailFormData.append('reply_to', 'actioncardetailing@gmail.com');

    const selectedProtectionDetails = protectionLevels.find(level => level.id === selectedProtectionLevel);

    emailFormData.append('message', `
✅ ACTION CAR DETAILING – CERAMIC COATING QUOTE REQUEST

Subject: Ceramic Coating Quote Request Received – Confirmation Pending

Dear ${formData.name},

Thank you for your interest in our XPEL FUSION PLUS Ceramic Coating services!

We have successfully received your quote request. Our team will review your vehicle details and get back to you within 24 hours with a customized quote.

QUOTE SUMMARY

Quote ID: ${quoteId}
Service: Ceramic Coating
Status: Pending Review

CUSTOMER INFORMATION

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

VEHICLE INFORMATION

Make/Model: ${formData.makeModel}

PROTECTION LEVEL SELECTED

${selectedProtectionDetails ? `${selectedProtectionDetails.title} - ${selectedProtectionDetails.warranty}` : 'No protection level selected'}

ADDITIONAL MESSAGE

${formData.message || 'No additional message provided'}

IMPORTANT INFORMATION

- We will review your ceramic coating quote request within 24 hours
- You'll receive a customized quote based on your vehicle and selected protection level
- Our team will contact you to discuss appointment scheduling
- Contact us if you need to modify your request

CONTACT DETAILS

Email: actioncardetailing@gmail.com
Phone: (204) 775-0005
Quote Reference: ${quoteId}

Thank you for choosing Action Car Detailing for your ceramic coating needs!
We look forward to protecting your vehicle.

Best regards,
Action Car Detailing Team
Passion for Detail
    `);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: emailFormData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert('❌ Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const quoteId = generateQuoteId();
      const emailResult = await sendEmail(quoteId);

      if (emailResult.success) {
        alert(`✅ Ceramic Coating Quote Request Submitted Successfully!\n\nYour Quote ID: ${quoteId}\n\nThank you for your interest! We'll review your information and get back to you within 24 hours with a customized quote.\n\nConfirmation email has been sent to: ${formData.email}`);
        
        setFormData({
          name: '',
          phone: '',
          email: '',
          makeModel: '',
          message: ''
        });
        setSelectedProtectionLevel('');
        onClose();
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('❌ Submission Error\n\nThere was an error submitting your request. Please try again or contact us directly at actioncardetailing@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.phone && formData.email && formData.makeModel && selectedProtectionLevel;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative shadow-2xl mx-2 sm:mx-0">
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1393c4' }} />
        </button>
        
        <div className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#1393c4' }}>GET CERAMIC COATING QUOTE</h2>
            <p style={{ color: '#1393c4' }} className="text-sm sm:text-base">Fill out the form below to receive a customized quote for ceramic coating.</p>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>1. CONTACT INFORMATION</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#1393c4' }}>Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1393c4' }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#1393c4', color: '#1393c4', backgroundColor: '#f8fafc' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#1393c4' }}>Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1393c4' }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                    className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#1393c4', color: '#1393c4', backgroundColor: '#f8fafc' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#1393c4' }}>Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1393c4' }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#1393c4', color: '#1393c4', backgroundColor: '#f8fafc' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#1393c4' }}>Vehicle Make and Model *</label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1393c4' }} />
                  <input
                    type="text"
                    name="makeModel"
                    value={formData.makeModel}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Toyota Camry 2020"
                    className="w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#1393c4', color: '#1393c4', backgroundColor: '#f8fafc' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>2. CHOOSE YOUR PROTECTION LEVEL *</h3>
            
            <div className="mb-3 sm:mb-4">
              <button
                onClick={toggleDropdown}
                className="w-full border-2 rounded-lg p-3 sm:p-4 flex justify-between items-center transition-colors duration-200 text-left"
                style={{ borderColor: '#1393c4', backgroundColor: '#f8fafc' }}
              >
                <span className="font-semibold text-base sm:text-lg truncate pr-2" style={{ color: '#1393c4' }}>
                  {selectedProtectionLevel 
                    ? protectionLevels.find(level => level.id === selectedProtectionLevel)?.title
                    : 'Select Protection Level'}
                </span>
                {openDropdown === 'protection' ? <ChevronUp style={{ color: '#1393c4' }} /> : <ChevronDown style={{ color: '#1393c4' }} />}
              </button>
              
              {openDropdown === 'protection' && (
                <div className="mt-2 border rounded-lg overflow-hidden max-h-48 sm:max-h-60 overflow-y-auto" style={{ borderColor: '#1393c4' }}>
                  {protectionLevels.map((level) => (
                    <div
                      key={level.id}
                      onClick={() => handleProtectionLevelSelect(level.id)}
                      className={`p-3 sm:p-4 border-b last:border-b-0 cursor-pointer transition-colors duration-200 ${
                        selectedProtectionLevel === level.id 
                          ? 'text-white' 
                          : 'hover:bg-blue-50'
                      }`}
                      style={{ 
                        backgroundColor: selectedProtectionLevel === level.id ? '#1393c4' : 'white',
                        borderColor: '#1393c4'
                      }}
                    >
                      <div className="flex justify-between items-start mb-1 sm:mb-2">
                        <h3 className={`font-bold text-sm sm:text-lg ${
                          selectedProtectionLevel === level.id ? 'text-white' : ''
                        }`} style={{ color: selectedProtectionLevel === level.id ? 'white' : '#1393c4' }}>
                          {level.title}
                        </h3>
                        <span className={`font-semibold text-xs sm:text-sm ${
                          selectedProtectionLevel === level.id ? 'text-white' : ''
                        }`} style={{ color: selectedProtectionLevel === level.id ? 'white' : '#1393c4' }}>
                          {level.warranty}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm mb-1 sm:mb-2 ${
                        selectedProtectionLevel === level.id ? 'text-blue-100' : ''
                      }`} style={{ color: selectedProtectionLevel === level.id ? '#dbeafe' : '#1393c4' }}>
                        {level.description}
                      </p>
                      <div className={`text-xs ${
                        selectedProtectionLevel === level.id ? 'text-blue-100' : ''
                      }`} style={{ color: selectedProtectionLevel === level.id ? '#dbeafe' : '#1393c4' }}>
                        <ul className="list-disc list-inside space-y-0.5 sm:space-y-1">
                          {level.features.slice(0, 2).map((feature, idx) => (
                            <li key={idx} className="truncate">{feature}</li>
                          ))}
                          {level.features.length > 2 && <li>+{level.features.length - 2} more features</li>}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>3. ADDITIONAL MESSAGE (OPTIONAL)</h3>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
              style={{ borderColor: '#1393c4', color: '#1393c4', backgroundColor: '#f8fafc' }}
              placeholder="Tell us about any specific requirements or questions..."
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 sm:py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg text-sm sm:text-base ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-105 active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'GET MY QUOTE'}
            </button>
            
            <p className="text-xs mt-2 sm:mt-3 px-2" style={{ color: '#1393c4' }}>
              We'll review your request and get back to you within 24 hours with a customized quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CeramicCoatings = () => {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  // Navigation function
  const navigateTo = (path) => {
    router.push(`/${path}`);
  };

  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.preload = 'auto';
      video.poster = '';
      video.style.willChange = 'transform';
      video.style.backfaceVisibility = 'hidden';
      
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
      
      video.addEventListener('canplay', () => {
        setIsVideoPlaying(true);
      });
      
      video.addEventListener('playing', () => {
        setIsVideoPlaying(true);
      });
      
      video.addEventListener('pause', () => {
        setIsVideoPlaying(false);
      });
      
      const playVideo = async () => {
        try {
          if (video.readyState >= 2) {
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
              playPromise.then(() => {
                setIsVideoPlaying(true);
              }).catch(() => {
                const enableVideo = async () => {
                  try {
                    await video.play();
                    setIsVideoPlaying(true);
                    document.removeEventListener('click', enableVideo);
                    document.removeEventListener('touchstart', enableVideo);
                  } catch (err) {
                    // Silent fail for mobile browsers
                  }
                };
                
                document.addEventListener('click', enableVideo, { once: true });
                document.addEventListener('touchstart', enableVideo, { once: true });
              });
            }
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
          // Silent fail for mobile browsers
        }
      };
      
      setTimeout(playVideo, 100);
      
      return () => {
        window.removeEventListener('resize', throttledResize);
        window.removeEventListener('orientationchange', adjustVideoFit);
        clearTimeout(resizeTimeout);
      };
    }
  }, []);

  const getContainerHeight = () => {
    if (typeof window === 'undefined') return '100vh';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width < 768) {
      return Math.min(height * 0.6, 500) + 'px';
    } else if (width < 1024) {
      return Math.min(height * 0.7, 600) + 'px';
    } else {
      return '100vh';
    }
  };

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

  const benefits = [
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#ffffff' }} />,
      title: "Superior Protection",
      description: "Advanced ceramic formula creates a durable barrier against UV rays, oxidation, and environmental contaminants"
    },
    {
      icon: <Droplets className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#ffffff' }} />,
      title: "Hydrophobic Shield",
      description: "Extreme water and dirt repellency makes cleaning effortless while maintaining that showroom shine"
    },
    {
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#ffffff' }} />,
      title: "Enhanced Gloss",
      description: "Deep, mirror-like finish that intensifies your vehicle's color and creates stunning visual depth"
    },
    {
      icon: <Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#ffffff' }} />,
      title: "Scratch Resistance",
      description: "Hard ceramic layer helps prevent minor scratches and swirl marks, keeping your paint pristine"
    },
    {
      icon: <Sun className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#ffffff' }} />,
      title: "UV Protection",
      description: "Blocks harmful UV rays that cause paint fading and oxidation, preserving your vehicle's appearance"
    },
    {
      icon: <HardHat className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#ffffff' }} />,
      title: "Chemical Defense",
      description: "Resists harsh chemicals, bird droppings, tree sap, and road salts that can etch into paint"
    }
  ];

  const packages = [
    {
      name: "FUSION PLUS LITE",
      duration: "1 years",
      features: [
        "Professional-Grade 9H Ceramic Coating",
        "1-year warranty protection",
        "Enhanced gloss & hydrophobic properties",
        "Basic paint protection",
        "Professional application"
      ],
      image: fusionPlusLite,
      gradient: "from-blue-400 to-cyan-500",
      popular: false,
      id: 'fusion-plus-lite'
    },
    {
      name: "FUSION PLUS PAINT & PPF",
      duration: "4 years",
      features: [
        "Professional-Grade 9H Ceramic Coating",
        "4-year warranty coverage",
        "PPF-safe formula",
        "Superior chemical resistance",
        "Maximum gloss enhancement",
        "Paint correction included"
      ],
      image: fusionPlusPaintPPF,
      gradient: "from-cyan-500 to-blue-600",
      popular: true,
      id: 'fusion-plus-paint-ppf'
    },
    {
      name: "FUSION PLUS PREMIUM",
      duration: "8 years",
      features: [
        "Professional-Grade 9H Ceramic Coating",
        "8-year warranty protection",
        "Ultimate scratch resistance",
        "Premium hydrophobic coating",
        "Complete paint correction",
        "Full vehicle coverage",
        "Complimentary maintenance kit"
      ],
      image: fusionPlusPremium,
      gradient: "from-blue-600 to-indigo-700",
      popular: false,
      id: 'fusion-plus-premium'
    }
  ];

  const processSteps = [
    {
      icon: <Beaker className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#ffffff' }} />,
      step: "1",
      title: "Deep Cleaning & Decontamination",
      description: "Thorough washing and clay bar treatment removes all surface contaminants, iron particles, and embedded debris for a pristine foundation"
    },
    {
      icon: <Settings className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#ffffff' }} />,
      step: "2",
      title: "Paint Correction",
      description: "Multi-stage polishing removes swirl marks, scratches, and imperfections to restore your paint to showroom condition"
    },
    {
      icon: <Atom className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#ffffff' }} />,
      step: "3",
      title: "Surface Preparation",
      description: "Panel wipe ensures perfect surface preparation, removing polish oils and residues for optimal coating adhesion"
    },
    {
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#ffffff' }} />,
      step: "4",
      title: "Ceramic Application",
      description: "Precision application of XPEL FUSION PLUS in controlled environment, ensuring even coverage and proper curing"
    },
    {
      icon: <Star className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#ffffff' }} />,
      step: "5",
      title: "Curing & Inspection",
      description: "24-48 hour curing process followed by detailed quality inspection and final finishing touches"
    }
  ];

  const handleGetPricingClick = (packageId) => {
    setSelectedPackage(packageId);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">

      <h1 className="sr-only">Ceramic Coating Near Me in Winnipeg | Best Auto Ceramic Coating for Cars</h1>

      {/* Hero Section with Video Background */}
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
          <source src={ceramicCoatingVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              {/* Admin button removed */}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>
              Why Choose Ceramic Coating?
            </h2>
            <div className="w-24 sm:w-32 h-1 mx-auto mb-4 sm:mb-6" style={{ background: 'linear-gradient(90deg, #1393c4, #0f7a9c)' }} />
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" style={{ color: '#1393c4' }}>
              Experience the ultimate in paint protection with our advanced ceramic coating technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                ref={el => cardRefs.current[index] = el}
                className={`group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 transform ${
                  visibleCards.has(index) ? 'translate-y-0 opacity-100' : 'translate-y-4 sm:translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 shadow-md sm:shadow-lg"
                  style={{ backgroundColor: '#1393c4' }}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4" style={{ color: '#1393c4' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#1393c4' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>
              Choose Your Protection Level
            </h2>
            <div className="w-24 sm:w-32 h-1 mx-auto mb-4 sm:mb-6" style={{ background: 'linear-gradient(90deg, #1393c4, #0f7a9c)' }} />
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" style={{ color: '#1393c4' }}>
              Professional ceramic coating packages designed for every need and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={index}
                ref={el => cardRefs.current[benefits.length + index] = el}
                className={`relative bg-white rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 transform ${
                  visibleCards.has(benefits.length + index) ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 sm:translate-y-10 opacity-0 scale-95'
                } ${pkg.popular ? 'ring-2 sm:ring-4 ring-blue-400 md:scale-105' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md sm:shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className={`h-48 sm:h-56 md:h-64 bg-gradient-to-br ${pkg.gradient} relative overflow-hidden`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-contain p-4 sm:p-6"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2" style={{ color: '#1393c4' }}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: '#1393c4' }}>
                      {pkg.duration}
                    </span>
                    <span className="text-sm sm:text-base" style={{ color: '#1393c4' }}>warranty</span>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0" style={{ color: '#1393c4' }} />
                        <span className="text-xs sm:text-sm md:text-base" style={{ color: '#1393c4' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleGetPricingClick(pkg.id)}
                    className={`w-full py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base ${
                      pkg.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                    }`}
                  >
                    GET PRICING
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ color: '#1393c4' }}>
              Our Professional Process
            </h2>
            <div className="w-24 sm:w-32 h-1 mx-auto mb-4 sm:mb-6" style={{ background: 'linear-gradient(90deg, #1393c4, #0f7a9c)' }} />
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 break-words" style={{ color: '#1393c4' }}>
              Meticulous attention to detail at every step ensures flawless results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <div
                key={index}
                ref={el => cardRefs.current[benefits.length + packages.length + index] = el}
                className={`flex flex-col gap-3 sm:gap-4 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-gray-100 transition-all duration-500 transform ${
                  visibleCards.has(benefits.length + packages.length + index) ? 'translate-y-0 opacity-100' : 'translate-y-4 sm:translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: `#1393c4` }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: '#1393c4' }}
                    >
                      {step.step}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold break-words" style={{ color: '#1393c4' }}>
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm sm:text-base leading-relaxed break-words hyphens-auto" style={{ color: '#1393c4' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* XPEL Fusion Plus Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 bg-white">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 mb-6 sm:mb-8 lg:mb-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 break-words" style={{ color: '#1393c4' }}>
                    PROTECT YOUR VEHICLE WITH XPEL FUSION PLUS CERAMIC COATING
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div
                      className="flex items-center space-x-2 sm:space-x-3 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigateTo('fusion-plus-lite')}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#1393c4' }}></span>
                      <span className="font-semibold text-sm sm:text-base md:text-lg underline transition-colors hover:text-[#0f7ba3] break-words" style={{ color: '#1393c4', textDecorationColor: '#1393c4' }}>
                        FUSION PLUS LITE
                      </span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 sm:space-x-3 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigateTo('fusion-plus-paint-ppf')}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#1393c4' }}></span>
                      <span className="font-semibold text-sm sm:text-base md:text-lg underline transition-colors hover:text-[#0f7ba3] break-words" style={{ color: '#1393c4', textDecorationColor: '#1393c4' }}>
                        FUSION PLUS PAINT & PPF
                      </span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 sm:space-x-3 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigateTo('fusion-plus-premium')}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#1393c4' }}></span>
                      <span className="font-semibold text-sm sm:text-base md:text-lg underline transition-colors hover:text-[#0f7ba3] break-words" style={{ color: '#1393c4', textDecorationColor: '#1393c4' }}>
                        FUSION PLUS PREMIUM
                      </span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 sm:space-x-3 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigateTo('fusion-plus-wheel-caliper')}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#1393c4' }}></span>
                      <span className="font-semibold text-sm sm:text-base md:text-lg underline transition-colors hover:text-[#0f7ba3] break-words" style={{ color: '#1393c4', textDecorationColor: '#1393c4' }}>
                        FUSION PLUS WHEEL & CALIPER
                      </span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 sm:space-x-3 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigateTo('fusion-plus-glass')}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#1393c4' }}></span>
                      <span className="font-semibold text-sm sm:text-base md:text-lg underline transition-colors hover:text-[#0f7ba3] break-words" style={{ color: '#1393c4', textDecorationColor: '#1393c4' }}>
                        FUSION PLUS GLASS
                      </span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 sm:space-x-3 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigateTo('fusion-plus-plastic-trims')}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#1393c4' }}></span>
                      <span className="font-semibold text-sm sm:text-base md:text-lg underline transition-colors hover:text-[#0f7ba3] break-words" style={{ color: '#1393c4', textDecorationColor: '#1393c4' }}>
                        FUSION PLUS PLASTIC & TRIMS
                      </span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 sm:space-x-3 hover:translate-x-1 sm:hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigateTo('fusion-plus-upholstery')}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#1393c4' }}></span>
                      <span className="font-semibold text-sm sm:text-base md:text-lg underline transition-colors hover:text-[#0f7ba3] break-words" style={{ color: '#1393c4', textDecorationColor: '#1393c4' }}>
                        FUSION PLUS UPHOLSTERY
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 lg:pl-8 xl:pl-12">
                  <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto hover:scale-105 transition-transform duration-300">
                    <div className="relative w-full h-64">
                      <Image
                        src={protectVehicleLogo}
                        alt="XPEL Logo"
                        fill
                        className="object-contain drop-shadow-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-12 border-t border-gray-200">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 mb-6 sm:mb-8 lg:mb-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 break-words" style={{ color: '#1393c4' }}>
                    FUSION PLUS
                    <span className="block text-lg sm:text-xl md:text-2xl break-words" style={{ color: '#1393c4' }}>CERAMIC COATING</span>
                  </h2>

                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <p className="leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-lg break-words" style={{ color: '#1393c4' }}>
                      Developed to perform in a wide variety of surface types, <span className="font-bold break-words" style={{ color: '#1393c4' }}>FUSION PLUS</span> Ceramic Coating offers unrivaled gloss, superior hydrophobic protection, and improved scratch resistance.
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-lg sm:text-xl font-bold" style={{ color: '#1393c4' }}>+</span>
                      <span className="font-semibold text-sm sm:text-base break-words" style={{ color: '#1393c4' }}>Provides protection from the elements</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-lg sm:text-xl font-bold" style={{ color: '#1393c4' }}>+</span>
                      <span className="font-semibold text-sm sm:text-base break-words" style={{ color: '#1393c4' }}>Repels water, dirt & road grime</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-lg sm:text-xl font-bold" style={{ color: '#1393c4' }}>+</span>
                      <span className="font-semibold text-sm sm:text-base break-words" style={{ color: '#1393c4' }}>Resist stains & chemical etching</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 lg:pl-8 xl:pl-12 mt-6 lg:mt-0">
                  <div className="relative w-full h-96">
                    <Image
                      src={fusionPlusProcess}
                      alt="Fusion Plus Ceramic Coating Process"
                      fill
                      className="object-contain rounded-lg shadow-lg sm:shadow-xl md:shadow-2xl border-2 sm:border-4 border-gray-200 hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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

      {/* Ceramic Coating Quote Modal */}
      <CeramicCoatingQuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        selectedPackage={selectedPackage}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CeramicCoatings;