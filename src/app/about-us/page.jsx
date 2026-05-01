// src/app/about-us/page.jsx
import Aboutus from '@/app/components/Aboutus';

export const metadata = {
  title: 'About Us - Action Car Detailing Winnipeg',
  description: 'Learn about Action Car Detailing, Winnipeg trusted car detailing experts. Specializing in ceramic coating, PPF, window tinting, and full car detailing.',
  alternates: { canonical: 'https://actioncardetailing.ca/about-us/' },
  openGraph: { title: 'About Us - Action Car Detailing Winnipeg', description: 'Learn about Action Car Detailing, Winnipeg trusted car detailing experts. Specializing in ceramic coating, PPF, window tinting, and full car detailing.', url: 'https://actioncardetailing.ca/about-us/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <Aboutus />;
}
