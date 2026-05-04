import { notFound } from 'next/navigation';
import Home from '../page';

const validRoutes = [
  'date-blocking', 
  'remediation-claim', 
  'before-after', 
  'paint-polishing', 
  'choose-your-service', 
  'perfect-solutions', 
  'quality-service'
];

export default async function CatchAll({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug?.[0];
  
  if (slug && validRoutes.includes(slug)) {
    return <Home />;
  }
  
  notFound();
}
