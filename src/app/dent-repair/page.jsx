// src/app/dent-repair/page.jsx
import DentRepairComponent from '@/app/components/DentRepairComponent';

export const metadata = {
  title: 'Paintless Dent Repair Near Me in Winnipeg',
  description: 'Expert paintless dent repair in Winnipeg. Fast and affordable dent removal without repainting. Get your car looking perfect again.',
  alternates: { canonical: 'https://actioncardetailing.ca/dent-repair/' },
  openGraph: { title: 'Paintless Dent Repair Near Me in Winnipeg', description: 'Expert paintless dent repair in Winnipeg. Fast and affordable dent removal without repainting. Get your car looking perfect again.', url: 'https://actioncardetailing.ca/dent-repair/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <DentRepairComponent />;
}
