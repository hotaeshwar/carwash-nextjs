'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Footer from './components/Footer';
import DateBlockingManager from './components/DateBlockingManager';

const actionCarLogo = '/images/actioncarlogo.png';

import Hero from './components/Hero';
import Service from './components/Service';
import CustomerReview from './components/CustomerReview';
import ContactForm from './components/ContactForm';

const GiftCard = lazy(() => import('./components/GiftCard'));
const Aboutus = lazy(() => import('./components/Aboutus'));
const References = lazy(() => import('./components/References'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const CarDetailingWebsite = lazy(() => import('./components/CarDetailingWebsite'));
const PaintCorrection = lazy(() => import('./components/PaintCorrection'));
const WindowTintingSite = lazy(() => import('./components/WindowTintingSite'));
const CeramicCoatings = lazy(() => import('./components/CeramicCoatings'));
const RemediationClaim = lazy(() => import('./components/RemediationClaim'));
const PaintProtectionFilm = lazy(() => import('./components/PaintProtectionFilm'));
const DentRepairComponent = lazy(() => import('./components/DentRepairComponent'));
const BeforeAfterVideo = lazy(() => import('./components/BeforeAfterVideo'));
const Booking = lazy(() => import('./components/Booking'));
const PaintPolishingForm = lazy(() => import('./components/PaintPolishingForm'));
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const FusionPlusLite = lazy(() => import('./components/FusionPlusLite'));
const FusionPlusLanding = lazy(() => import('./components/FusionPlusLanding'));
const FusionPlusPremium = lazy(() => import('./components/FusionPlusPremium'));
const FusionPlusWheelCaliper = lazy(() => import('./components/FusionPlusWheelCaliper'));
const FusionPlusGlass = lazy(() => import('./components/FusionPlusGlass'));
const FusionPlusPlasticTrims = lazy(() => import('./components/FusionPlusPlasticTrims'));
const FusionPlusUpholstery = lazy(() => import('./components/FusionPlusUpholstery'));
const ChooseYourService = lazy(() => import('./components/Chooseyourservice'));
const QualityService = lazy(() => import('./components/QualityService'));
const PerfectSolutionsCarousel = lazy(() => import('./components/PerfectSolutionsCarousel'));
const CarDetailing = lazy(() => import('./components/CarDetailing'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function FlashScreen({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: '#0a0f1a' }}>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-64 mb-6">
          <Image src={actionCarLogo} alt="ActionCarLogo" fill className="object-contain" priority unoptimized={process.env.NODE_ENV === 'production'} />
        </div>
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: '#22d3ee', animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: '#22d3ee', animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: '#22d3ee', animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

// ✅ Inner component that safely uses useSearchParams
function HomeInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFlash, setShowFlash] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hash = window.location.hash;
    if (hash === '#admin' || hash === '#/admin') {
      router.replace('/date-blocking');
    }
    const timer = setTimeout(() => { setShowFlash(false); }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    const redirectParam = searchParams?.get('p');
    if (redirectParam) {
      const path = redirectParam.replace(/~and~/g, '&');
      router.replace(path);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (isClient) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, isClient]);

  const renderContent = () => {
    if (pathname === '/date-blocking') return <DateBlockingManager />;
    if (pathname === '/fusion-plus-lite') return <FusionPlusLite />;
    if (pathname === '/fusion-plus-paint-ppf') return <FusionPlusLanding />;
    if (pathname === '/fusion-plus-premium') return <FusionPlusPremium />;
    if (pathname === '/fusion-plus-wheel-caliper') return <FusionPlusWheelCaliper />;
    if (pathname === '/fusion-plus-glass') return <FusionPlusGlass />;
    if (pathname === '/fusion-plus-plastic-trims') return <FusionPlusPlasticTrims />;
    if (pathname === '/fusion-plus-upholstery') return <FusionPlusUpholstery />;
    if (pathname === '/auto-detailing') return <CarDetailingWebsite />;
    if (pathname === '/paint-correction-polishing') return <PaintCorrection />;
    if (pathname === '/window-tinting') return <WindowTintingSite />;
    if (pathname === '/ceramic-coating') return <CeramicCoatings />;
    if (pathname === '/paint-protection-film') return <PaintProtectionFilm />;
    if (pathname === '/dent-repair') return <DentRepairComponent />;
    if (pathname === '/car-detailing') return <CarDetailing />;
    if (pathname === '/remediation-claim') return <RemediationClaim />;
    if (pathname === '/before-after') return <BeforeAfterVideo />;
    if (pathname === '/paint-polishing') return <PaintPolishingForm />;
    if (pathname === '/booking') return <Booking />;
    if (pathname === '/choose-your-service') return <ChooseYourService />;
    if (pathname === '/perfect-solutions') return <PerfectSolutionsCarousel />;
    if (pathname === '/about-us') return <Aboutus />;
    if (pathname === '/references') return <References />;
    if (pathname === '/testimonials') return <Testimonials />;
    if (pathname === '/giftcard') return <GiftCard />;
    if (pathname === '/services') return <ServicesSection />;
    if (pathname === '/quality-service') return <QualityService />;
    if (pathname === '/about') { router.replace('/about-us'); return <LoadingSpinner />; }
    if (pathname === '/home' || pathname === '/index.html') { router.replace('/'); return <LoadingSpinner />; }
    return (
      <>
        <Hero />
        <Service />
        <CustomerReview />
        <ContactForm />
        <Footer />
      </>
    );
  };

  const is404Route = () => {
    const validRoutes = ['/', '/date-blocking', '/fusion-plus-lite', '/fusion-plus-paint-ppf', '/fusion-plus-premium', '/fusion-plus-wheel-caliper', '/fusion-plus-glass', '/fusion-plus-plastic-trims', '/fusion-plus-upholstery', '/auto-detailing', '/paint-correction-polishing', '/window-tinting', '/ceramic-coating', '/paint-protection-film', '/dent-repair', '/car-detailing', '/remediation-claim', '/before-after', '/paint-polishing', '/booking', '/choose-your-service', '/perfect-solutions', '/about-us', '/references', '/testimonials', '/giftcard', '/services', '/quality-service'];
    if (pathname === '/about' || pathname === '/home' || pathname === '/index.html') return false;
    return !validRoutes.includes(pathname);
  };

  if (is404Route()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you are looking for does not exist or has been moved.</p>
          <button onClick={() => router.push('/')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">Go to Homepage</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <FlashScreen show={showFlash} />
      <Suspense fallback={<LoadingSpinner />}>
        {renderContent()}
      </Suspense>
    </>
  );
}

// ✅ Default export wraps HomeInner in Suspense to satisfy useSearchParams requirement
export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeInner />
    </Suspense>
  );
}