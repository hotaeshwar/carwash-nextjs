// src/app/car-detailing/page.jsx
import CarDetailing from '@/app/components/CarDetailing';

export const metadata = {
  title: 'Car Detailing Near Me in Winnipeg',
  description: 'Best car detailing near me in Winnipeg. Professional interior and exterior car detailing including vehicle detailing and full packages.',
  alternates: { canonical: 'https://actioncardetailing.ca/car-detailing/' },
  openGraph: { title: 'Car Detailing Near Me in Winnipeg', description: 'Best car detailing near me in Winnipeg. Professional interior and exterior car detailing including vehicle detailing and full packages.', url: 'https://actioncardetailing.ca/car-detailing/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <CarDetailing />;
}
