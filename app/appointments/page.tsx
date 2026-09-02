import type { Metadata } from 'next';
import RouteExperience from '../../components/RouteExperience';
import { stories } from '../../content/site';
export const metadata: Metadata = { title: 'Appointments', description: 'Understand how to request, confirm, prepare for, and arrive for a visit at Canby Community Clinic.' };
export default function Page() { return <RouteExperience story={stories.appointments} />; }
