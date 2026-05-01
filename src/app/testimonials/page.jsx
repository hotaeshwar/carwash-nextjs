// src/app/testimonials/page.jsx
import Testimonials from '@/app/components/Testimonials';

export const metadata = {
  title: 'Customer Reviews and Testimonials - Action Car Detailing Winnipeg',
  description: 'Read what our happy customers say about Action Car Detailing Winnipeg. Reviews for ceramic coating, PPF, window tinting, and vehicle detailing.',
  alternates: { canonical: 'https://actioncardetailing.ca/testimonials/' },
  openGraph: { title: 'Customer Reviews and Testimonials - Action Car Detailing Winnipeg', description: 'Read what our happy customers say about Action Car Detailing Winnipeg. Reviews for ceramic coating, PPF, window tinting, and vehicle detailing.', url: 'https://actioncardetailing.ca/testimonials/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <Testimonials />;
}
