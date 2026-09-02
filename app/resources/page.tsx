import type { Metadata } from 'next';
import RouteExperience from '../../components/RouteExperience';
import { stories } from '../../content/site';
export const metadata: Metadata = { title: 'Patient resources', description: 'Practical preparation, medication, follow-up, privacy, and patient-rights resources from Canby Community Clinic.' };
export default function Page() { return <RouteExperience story={stories.resources} />; }
