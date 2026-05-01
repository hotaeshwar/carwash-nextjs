// src/app/auto-detailing/page.jsx
import CarDetailingWebsite from '@/app/components/CarDetailingWebsite';

export const metadata = {
  title: 'Auto Detailing Winnipeg - Interior and Exterior Car Detailing',
  description: 'Auto detailing Winnipeg experts offering PPF, window tinting, and ceramic coating. Interior and exterior deep clean to keep your car protected.',
  alternates: { canonical: 'https://actioncardetailing.ca/auto-detailing/' },
  openGraph: { title: 'Auto Detailing Winnipeg - Interior and Exterior Car Detailing', description: 'Auto detailing Winnipeg experts offering PPF, window tinting, and ceramic coating. Interior and exterior deep clean to keep your car protected.', url: 'https://actioncardetailing.ca/auto-detailing/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <CarDetailingWebsite />;
}
