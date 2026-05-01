// src/app/booking/page.jsx
import Booking from '@/app/components/Booking';

export const metadata = {
  title: 'Book Car Detailing in Winnipeg - Action Car Detailing',
  description: 'Book your car detailing, ceramic coating, PPF, or window tinting online. Fast and easy booking for Winnipeg best car detailing service.',
  alternates: { canonical: 'https://actioncardetailing.ca/booking/' },
  openGraph: { title: 'Book Car Detailing in Winnipeg - Action Car Detailing', description: 'Book your car detailing, ceramic coating, PPF, or window tinting online. Fast and easy booking for Winnipeg best car detailing service.', url: 'https://actioncardetailing.ca/booking/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <Booking />;
}
