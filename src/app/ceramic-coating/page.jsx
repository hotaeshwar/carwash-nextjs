// src/app/ceramic-coating/page.jsx
import CeramicCoatings from '@/app/components/CeramicCoatings';

export const metadata = {
  title: 'Find Xpel Fusion Plus Ceramic Coating Near Me in Winnipeg',
  description: 'Find the best ceramic coating near me for ultimate paint protection and shine. Trust our professional car detailing services to elevate your cars beauty.',
  alternates: { canonical: 'https://actioncardetailing.ca/ceramic-coating/' },
  openGraph: { title: 'Find Xpel Fusion Plus Ceramic Coating Near Me in Winnipeg', description: 'Find the best ceramic coating near me for ultimate paint protection and shine. Trust our professional car detailing services to elevate your cars beauty.', url: 'https://actioncardetailing.ca/ceramic-coating/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <CeramicCoatings />;
}
