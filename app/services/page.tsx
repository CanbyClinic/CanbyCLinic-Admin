import type { Metadata } from 'next';
import RouteExperience from '../../components/RouteExperience';
import { stories } from '../../content/site';
export const metadata: Metadata = { title: 'Care services', description: 'Explore primary care, prevention, medication support, testing, education, and care navigation at Canby Community Clinic.' };
export default function Page() { return <RouteExperience story={stories.services} />; }
