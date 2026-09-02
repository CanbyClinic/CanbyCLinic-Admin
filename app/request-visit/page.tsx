import type { Metadata } from 'next';
import { clinic } from '../../content/site';
import SiteFooter from '../../components/SiteFooter';
export const metadata: Metadata = { title: 'Request a visit', description: 'Call Canby Community Clinic to request a visit and confirm availability.' };
export default function Page() {
  return <main className="utility-page request-page" id="main-content"><section className="request-shell"><p>Request a visit</p><h1>Tell us how we can help.</h1><div className="request-grid"><article><span>Recommended</span><h2>Call the clinic</h2><p>The current release uses a direct phone workflow so sensitive medical information is not sent through an unapproved web form.</p><a className="button primary" href={clinic.phoneHref}>Call {clinic.phoneDisplay} <b>↗</b></a></article><article><span>What happens next</span><ol><li>Share the reason for the visit.</li><li>Offer a preferred day and time.</li><li>Wait for the clinic to confirm availability.</li><li>Ask what to bring and how to arrive.</li></ol><small>A request is not a confirmed appointment. For emergencies, call 911.</small></article></div></section><SiteFooter /></main>;
}
