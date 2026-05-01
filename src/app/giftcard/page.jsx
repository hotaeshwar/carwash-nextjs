// src/app/giftcard/page.jsx
import GiftCard from '@/app/components/GiftCard';

export const metadata = {
  title: 'Car Detailing Gift Card Winnipeg - Action Car Detailing',
  description: 'Give the gift of a clean car. Purchase a car detailing gift card in Winnipeg for ceramic coating, PPF, window tinting, or full detail services.',
  alternates: { canonical: 'https://actioncardetailing.ca/giftcard/' },
  openGraph: { title: 'Car Detailing Gift Card Winnipeg - Action Car Detailing', description: 'Give the gift of a clean car. Purchase a car detailing gift card in Winnipeg for ceramic coating, PPF, window tinting, or full detail services.', url: 'https://actioncardetailing.ca/giftcard/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <GiftCard />;
}
