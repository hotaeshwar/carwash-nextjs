// src/app/references/page.jsx
import References from '@/app/components/References';

export const metadata = {
  title: 'Our Work and References - Action Car Detailing Winnipeg',
  description: 'View our portfolio of ceramic coating, PPF, window tinting, and car detailing work in Winnipeg.',
  alternates: { canonical: 'https://actioncardetailing.ca/references/' },
  openGraph: { title: 'Our Work and References - Action Car Detailing Winnipeg', description: 'View our portfolio of ceramic coating, PPF, window tinting, and car detailing work in Winnipeg.', url: 'https://actioncardetailing.ca/references/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <References />;
}
