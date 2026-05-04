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

export default function CatchAll({ params }) {
  const slug = params?.slug?.[0];
  
  if (validRoutes.includes(slug)) {
    return <Home />;
  }
  
  notFound();
}
