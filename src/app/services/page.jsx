// src/app/services/page.jsx
import ServicesSection from '@/app/components/ServicesSection';

export const metadata = {
  title: 'Car Detailing Services Winnipeg - Action Car Detailing',
  description: 'Explore all car detailing services in Winnipeg. Ceramic coating, PPF, window tinting, paint correction, interior and exterior car detailing.',
  alternates: { canonical: 'https://actioncardetailing.ca/services/' },
  openGraph: { title: 'Car Detailing Services Winnipeg - Action Car Detailing', description: 'Explore all car detailing services in Winnipeg. Ceramic coating, PPF, window tinting, paint correction, interior and exterior car detailing.', url: 'https://actioncardetailing.ca/services/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <ServicesSection />;
}
