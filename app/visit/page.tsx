import type { Metadata } from 'next';
import RouteExperience from '../../components/RouteExperience';
import { stories } from '../../content/site';
export const metadata: Metadata = { title: 'Visit the clinic', description: 'Find the address, hours, directions, and arrival information for Canby Community Clinic in Reseda.' };
export default function Page() { return <RouteExperience story={stories.visit} />; }
