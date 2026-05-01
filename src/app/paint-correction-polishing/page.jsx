// src/app/paint-correction-polishing/page.jsx
import PaintCorrection from '@/app/components/PaintCorrection';

export const metadata = {
  title: 'Paint Correction and Polishing Near Me in Winnipeg',
  description: 'Professional paint correction and polishing in Winnipeg. Remove swirl marks and scratches. Restore your cars paint to showroom quality.',
  alternates: { canonical: 'https://actioncardetailing.ca/paint-correction-polishing/' },
  openGraph: { title: 'Paint Correction and Polishing Near Me in Winnipeg', description: 'Professional paint correction and polishing in Winnipeg. Remove swirl marks and scratches. Restore your cars paint to showroom quality.', url: 'https://actioncardetailing.ca/paint-correction-polishing/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <PaintCorrection />;
}
