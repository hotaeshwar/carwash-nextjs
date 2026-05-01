'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import References from './Reference1';
import Footer from './Footer';
import VideoCarousel from './VideoCarousel';

// All media files now using public/images folder (videos are also in images folder)
const ceramicCoatingVideo = '/images/ceramic coating.mp4';
const interiorDetailingVideo = '/images/interior detailing.mp4';
const headlightRestorationImage = '/images/Headlight Restoration.png';
const paintCorrectionVideo = '/images/paintcorrectionservice.mp4';
const windowTintVideo = '/images/window tint (1).mp4';
const paintProtectionVideo = '/images/PPF Home page.mp4';
const dentRepairVideo = '/images/Dent Repair.mp4';
const heroBackground = '/images/car6.png';
const grimeImage = '/images/grime.jpg';

const ServicesSection = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);

  const services = [
    {
      id: 'interior-detailing',
      title: 'Interior Detailing',
      media: interiorDetailingVideo,
      mediaType: 'video',
      description: 'We use vapor steam to clean the vehicles dashboard, vents, center console, cup holder area, and door panels. We shampoo the seats and carpet. We also use special vacuum attachments to reach between seats and hard-to-reach areas. We then protect all interior surfaces with a conditioner.'
    },
    {
      id: 'paint-correction',
      title: 'Paint Correction Polishing',
      media: paintCorrectionVideo,
      mediaType: 'video',
      description: 'We gently erase swirls, scratches, and sun damage to revive your cars paint—restoring rich color and mirror-like shine. Say goodbye to water spots, bird etchings, and wash-induced marks. Every polish is hand-tailored, removing buffer trails too. Your ride doesnt just look clean—it gleams like new, with care you can see and feel.'
    },
    {
      id: 'ceramic-coating',
      title: 'Ceramic Coating',
      media: ceramicCoatingVideo,
      mediaType: 'video',
      description: 'FUSION PLUS ceramic coating bonds like armor to your paint—shrugging off dirt, water, and stains so washes take seconds, not hours. Its tougher than factory clear, boosts shine, fights UV fade, and laughs at chemicals. Your car stays cleaner, glossier, and protected—for years—with way less work from you.'
    },
    {
      id: 'headlight-restoration',
      title: 'Headlight Restoration',
      media: headlightRestorationImage,
      mediaType: 'image',
      description: 'Headlight restoration removes dull, yellowed headlight buildup. We clean and restore your headlight with our dry sanding and wet sanding techniques and then apply a clear coat for maximum visibility.'
    },
    {
      id: 'window-tinting',
      title: 'Window Tinting',
      media: windowTintVideo,
      mediaType: 'video',
      description: 'Beat the heat and drive in comfort with XPEL PRIME tint—engineered to block the suns glare and 99% of UV rays while keeping your view crystal clear. Ceramic tech cuts up to 80% heat, protects interiors, and lasts a lifetime without peeling or fading all flawlessly fitted, just for your ride.'
    },
    {
      id: 'paint-protection-film',
      title: 'Paint Protection Film',
      media: paintProtectionVideo,
      mediaType: 'video',
      description: 'Our PPF is like invisible armor—shrugging off rock chips, scratches, and daily wear while magically healing minor marks. Custom-fit to vanish on your paint, it keeps your car flawless longer, boosts resale value, and cuts down on washes. Plus, its backed by XPELs 10-year warranty. Drive bold. Stay protected.'
    },
    {
      id: 'dent-repair',
      title: 'Dent Repair',
      media: dentRepairVideo,
      mediaType: 'video',
      description: 'Dents dont stand a chance. Our pros gently massage out dings—no paint needed—or tackle bigger damage the old-school way. From hail storms to parking lot bumps, even sharp creases—we fix it right. Plus, well help with insurance paperwork. Your car? Back to flawless, fast, and stress-free.'
    },
    {
      id: 'engine-cleaning',
      title: 'Grim to Grime',
      media: grimeImage,
      mediaType: 'image',
      description: 'An important part of vehicle detailing includes skilled and experienced engine cleaning from auto detailing experts equipped with the necessary knowledge to help ensure the engines appearance. We recommend cleaning your engine compartment to not only help retain the value of your vehicle, but to ultimately help keep your vehicles engine cooler through the removal of grease,and dirt.'
    },
    {
      id: 'mpi-remediation',
      title: 'MPI Remediation Claims',
      media: heroBackground,
      mediaType: 'carousel',
      description: 'Were MPI-certified and ICAR-trained to handle the mess life leaves behind—rodents, mold, vandalism, water, fire, or trauma. No jobs too tough or too sensitive. Plus, we simplify Manitoba Public Insurance claims, guiding you through every step. Trust pros who care as much about your peace of mind as they do about getting it spotless.'
    }
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px'
      }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const renderMedia = (service) => {
    if (service.mediaType === 'carousel') {
      return <VideoCarousel />;
    } else if (service.mediaType === 'video') {
      return (
        <video
          src={service.media}
          className="w-full h-64 sm:h-72 lg:h-80 xl:h-96 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 rounded-xl"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      );
    } else {
      return (
        <div className="relative w-full h-64 sm:h-72 lg:h-80 xl:h-96 overflow-hidden rounded-xl">
          <Image
            src={service.media}
            alt={service.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Services Section */}
      <section className="bg-white min-h-screen py-12 lg:py-20">
        <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div 
            id="services-header"
            data-animate
            className={`text-center mt-16 lg:mt-20 transition-all duration-500 transform ${
              visibleItems.has('services-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1393c4] mt-4">
              Our Services
            </h2>
            <div className="w-24 h-1 bg-[#1393c4] mx-auto"></div>
          </div>

          {/* Services Cards */}
          <div className="space-y-16 lg:space-y-24">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={service.id}
                  id={service.id}
                  data-animate
                  className={`transition-all duration-600 transform ${
                    visibleItems.has(service.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-16'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms` 
                  }}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    isEven ? '' : 'lg:ml-8'
                  }`}>
                    
                    {/* Text Content */}
                    <div className={`space-y-6 ${
                      isEven 
                        ? 'order-1 lg:order-1 lg:pr-8' 
                        : 'order-1 lg:order-2 lg:pl-8'
                    }`}>
                      <div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1393c4] mt-4 leading-tight">
                          {service.title}
                        </h3>
                        <div className="w-16 h-1 bg-[#1393c4] mt-6"></div>
                      </div>
                      
                      <p className="text-[#1393c4] text-base sm:text-lg leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Media - VideoCarousel rendered directly */}
                    <div className={`${
                      isEven 
                        ? 'order-2 lg:order-2' 
                        : 'order-2 lg:order-1'
                    }`}>
                      {service.mediaType === 'carousel' ? (
                        renderMedia(service)
                      ) : (
                        <div className="relative overflow-hidden rounded-xl shadow-2xl group">
                          {renderMedia(service)}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1393c4]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {index < services.length - 1 && (
                    <div className={`hidden lg:block relative mt-12 ${
                      isEven ? 'ml-0' : 'ml-8'
                    }`}>
                      <div className={`absolute w-px h-8 bg-gradient-to-b from-[#1393c4]/30 to-transparent ${
                        isEven ? 'right-1/2' : 'left-1/2'
                      }`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* References Component */}
      <References />

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ServicesSection;