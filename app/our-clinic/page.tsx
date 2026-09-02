import type { Metadata } from 'next';
import RouteExperience from '../../components/RouteExperience';
import { stories } from '../../content/site';
export const metadata: Metadata = { title: 'Our clinic', description: 'Learn about the community-centered care approach of Canby Community Clinic in Reseda.' };
export default function Page() { return <RouteExperience story={stories['our-clinic']} />; }
