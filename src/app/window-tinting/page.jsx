// src/app/window-tinting/page.jsx
import WindowTintingSite from '@/app/components/WindowTintingSite';

export const metadata = {
  title: 'Window Tint Near Me in Winnipeg - Expert Tinting Installers',
  description: 'We offer full service window tinting in Winnipeg. Expert installations of car window tinting near me for better UV protection and less heat.',
  alternates: { canonical: 'https://actioncardetailing.ca/window-tinting/' },
  openGraph: { title: 'Window Tint Near Me in Winnipeg - Expert Tinting Installers', description: 'We offer full service window tinting in Winnipeg. Expert installations of car window tinting near me for better UV protection and less heat.', url: 'https://actioncardetailing.ca/window-tinting/', siteName: 'Action Car Detailing', locale: 'en_CA', type: 'website' },
};

export default function Page() {
  return <WindowTintingSite />;
}
