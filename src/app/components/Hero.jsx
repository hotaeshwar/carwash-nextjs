'use client';

import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const videoRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // ✅ CHANGED: No import needed - video is served from /public/images/
  const carwashVideo = '/images/carwash.mp4';

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

      video.preload = 'auto';
      video.poster = '';
      video.crossOrigin = 'anonymous';

      video.style.transition = 'none';
      video.style.animation = 'none';
      video.style.willChange = 'auto';
      video.style.backfaceVisibility = 'hidden';
      video.style.perspective = '1000px';
      video.style.transformStyle = 'preserve-3d';

      if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
          video.style.filter = 'blur(0.5px)';
        }
      }

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
        resizeTimeout = setTimeout(adjustVideoFit, 500);
      };

      window.addEventListener('resize', throttledResize, { passive: true });
      window.addEventListener('orientationchange', () => {
        setTimeout(adjustVideoFit, 600);
      }, { passive: true });

      const forceVideoLoad = () => {
        return new Promise((resolve) => {
          if (video.readyState === 4) {
            resolve();
            return;
          }

          const checkLoad = () => {
            if (video.readyState === 4) {
              resolve();
            } else {
              setTimeout(checkLoad, 50);
            }
          };

          video.addEventListener('canplaythrough', resolve, { once: true });
          video.addEventListener('loadeddata', checkLoad, { once: true });
          video.load();
        });
      };

      const playVideo = async () => {
        try {
          await forceVideoLoad();
          await new Promise(resolve => setTimeout(resolve, 200));
          await video.play();
        } catch (error) {
          console.log('Initial autoplay failed, setting up user interaction');

          const enableVideo = async () => {
            try {
              await forceVideoLoad();
              await video.play();
              document.removeEventListener('click', enableVideo);
              document.removeEventListener('touchstart', enableVideo);
              document.removeEventListener('scroll', enableVideo);
            } catch (err) {
              console.log('Video play failed:', err);
            }
          };

          document.addEventListener('click', enableVideo, { once: true });
          document.addEventListener('touchstart', enableVideo, { once: true });
          document.addEventListener('scroll', enableVideo, { once: true });
        }
      };

      setTimeout(playVideo, 1000);

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

  // ✅ FIXED: Added SSR guard for window access (required in Next.js)
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

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{
        height: getContainerHeight(),
        minHeight: isSmallScreen ? '300px' : '400px'
      }}
    >
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full"
          src={carwashVideo}          // ✅ CHANGED: Now uses /public path
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster=""
          controls={false}
          crossOrigin="anonymous"
          disablePictureInPicture
          disableRemotePlayback
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'auto',
            WebkitTransform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            imageRendering: 'optimizeSpeed',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            transition: 'none',
            animation: 'none',
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/4 sm:h-1/3 md:h-1/3 lg:h-1/3 bg-gradient-to-t from-black/40 to-transparent z-10" />

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center">
          <span className="text-white text-xs sm:text-sm md:text-base mb-1 sm:mb-2 tracking-widest font-medium drop-shadow-md">SCROLL</span>
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-sky-500/40 animate-pulse"></div>
            <div className="animate-bounce bg-sky-600/90 p-1.5 sm:p-2 rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;