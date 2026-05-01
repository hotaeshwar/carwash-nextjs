// src/app/paint-protection-film/page.jsx
import PaintProtectionFilm from '@/app/components/PaintProtectionFilm';

export const metadata = {
  title: 'XPEL Paint Protection Film PPF Near Me in Winnipeg',
  description: 'Find paint protection film near me to shield your cars paint from scratches. Number one installer of XPEL Ultimate Plus PPF in Winnipeg.',
  alternates: { canonical: 'https://actioncardetailing.ca/paint-protection-film/' },
  openGraph: { title: 'XPEL Paint Protection Film PPF Near Me in Winnipeg', description: 'Find paint protection film near me to shield your cars paint from scratches. Number one installer of XPEL Ultimate Plus PPF in Winnipeg.', url: 'https://actioncardetailing.ca/paint-protection-film/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <PaintProtectionFilm />;
}
