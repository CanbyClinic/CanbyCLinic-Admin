import type { Metadata } from 'next';
import RouteExperience from '../../components/RouteExperience';
import { stories } from '../../content/site';
export const metadata: Metadata = { title: 'New patients', description: 'Prepare for a first visit to Canby Community Clinic with clear information about requests, records, medications, and questions.' };
export default function Page() { return <RouteExperience story={stories['new-patients']} />; }
