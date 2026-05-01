'use client';

import { useRouter } from 'next/navigation';

const BusinessDescription = ({ setCurrentView }) => {
  const router = useRouter();

  const handleAboutClick = () => {
    if (setCurrentView) {
      setCurrentView('about');
    } else {
      router.push('/about-us');
    }
  };

  return (
    <div className="w-full bg-white py-8 md:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center lg:text-left">
          {/* Business description text */}
          <div className="mb-8 lg:mb-10">
            <div className="text-base md:text-lg lg:text-xl leading-relaxed space-y-4" style={{ color: '#1393c4' }}>
              <p>
                <span className="font-semibold">Locally owned and operated since 2011</span>, we specialize in
                <span className="font-medium"> Auto Detailing</span>,
                <span className="font-medium"> Ceramic Coating</span>,
                <span className="font-medium"> Window Tinting</span>,
                <span className="font-medium"> Paint Protection Film (PPF)</span>, and
                <span className="font-medium"> Paintless Dent Removal</span>.
              </p>

              <p>
                We are an <span className="font-semibold">MPI accredited auto detailing shop</span> and
                proud members of <span className="font-semibold">CFIB and BBB with an A+ rating</span>.
                Our reputation is backed by several accolades that prove our years of commitment to consumer care.
              </p>

              <p>
                Our most recent recognition came in the form of a <span className="font-bold">2026 Consumer Choice Award</span>.
                We're proud to be the <span className="font-semibold">only winner in our industry</span>.
              </p>

              <p>
                We have a team of <span className="font-medium">factory trained professionals</span> ready to work on your vehicle.
                We are an <span className="font-semibold">XPEL certified dealer and installation center</span>.
              </p>
            </div>
          </div>

          {/* Call-to-action button */}
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={handleAboutClick}
              className="
                inline-flex items-center justify-center
                px-6 py-3 lg:px-8 lg:py-4
                text-base lg:text-lg font-semibold
                text-white rounded-lg
                shadow-md hover:shadow-lg
                transform hover:scale-105 transition-all duration-300
                focus:outline-none focus:ring-4
                active:scale-95
                w-full sm:w-auto max-w-xs sm:max-w-none
              "
              style={{ backgroundColor: '#1393c4', '--tw-ring-color': '#1393c4' }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#0f7ba8')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#1393c4')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDescription;