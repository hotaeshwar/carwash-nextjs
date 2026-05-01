'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Copy, Check } from 'lucide-react';
import Image from 'next/image';

// Updated: Images from public/images folder
const bbbLogo = '/images/bbb_logo.png.png';
const car6 = '/images/car6.png';

const Reference1 = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const phoneNumber = '(204) 775-0005';
  const whatsappNumber = '2047750005'; // Remove formatting for WhatsApp

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handlePhoneClick = () => {
    setShowOptions(!showOptions);
  };

  const contactOptions = [
    {
      icon: Phone,
      label: 'Call Now',
      action: () => window.open(`tel:${phoneNumber}`, '_self'),
      color: '#10B981'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      action: () => window.open(`https://wa.me/${whatsappNumber}`, '_blank'),
      color: '#25D366'
    },
    {
      icon: Mail,
      label: 'Email',
      action: () => window.open('mailto:info@example.com', '_self'),
      color: '#3B82F6'
    },
    {
      icon: copied ? Check : Copy,
      label: copied ? 'Copied!' : 'Copy Number',
      action: handleCopyNumber,
      color: copied ? '#10B981' : '#6B7280'
    }
  ];

  return (
    <div 
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${car6})` }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 text-center">
        
        {/* BBB Logo Card - Small Size */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 shadow-lg mb-8 sm:mb-10 hover:shadow-xl transition-all duration-300">
          <div className="relative h-12 w-auto sm:h-14 md:h-16 lg:h-18 mx-auto">
            <Image 
              src={bbbLogo} 
              alt="Better Business Bureau Logo" 
              width={72}
              height={48}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Contact Text Section - Medium Size */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-6 sm:mb-8 leading-relaxed">
            CONTACT US TO REQUEST MORE<br />
            INFORMATION ON OUR RATES AND<br />
            SERVICES
          </h2>
          
          {/* Phone number - Medium Size & Clickable */}
          <div className="relative inline-block">
            <button
              onClick={handlePhoneClick}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 rounded-lg px-4 py-2"
              style={{ color: '#1393ca' }}
              aria-label="Contact options"
            >
              {phoneNumber}
            </button>

            {/* Contact Options Popup */}
            {showOptions && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-xl shadow-2xl p-4 min-w-64 z-50 animate-fadeIn">
                <div className="grid grid-cols-2 gap-3">
                  {contactOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          option.action();
                          setShowOptions(false);
                        }}
                        className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                        style={{ color: option.color }}
                      >
                        <IconComponent 
                          size={24} 
                          className="mb-2 group-hover:scale-110 transition-transform duration-200"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setShowOptions(false)}
                  className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 text-sm font-bold transition-colors duration-200"
                  aria-label="Close options"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close */}
        {showOptions && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowOptions(false)}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Reference1;