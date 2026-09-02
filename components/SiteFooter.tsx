import Image from 'next/image';
import TransitionLink from './TransitionLink';
import { clinic } from '../content/site';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><Image src="/assets/logo/canby-logo-original.jpeg" alt="Canby Community Clinic — Pura Vida Community Clinic" width={1529} height={608} /><p>Community-centered care and practical patient support in Reseda.</p></div>
      <div><strong>Explore</strong><TransitionLink href="/services">Services</TransitionLink><TransitionLink href="/appointments">Appointments</TransitionLink><TransitionLink href="/new-patients">New patients</TransitionLink><TransitionLink href="/resources">Resources</TransitionLink><TransitionLink href="/our-clinic">Our clinic</TransitionLink></div>
      <div><strong>Contact</strong><a href={clinic.phoneHref}>{clinic.phoneDisplay}</a><a href={clinic.directions}>{clinic.addressLine1}<br />{clinic.addressLine2}</a><p>{clinic.hours}</p></div>
        <div><strong>Information</strong><a href="https://puravidacc.org/es/" lang="es">Español</a><TransitionLink href="/legal/accessibility">Accessibility</TransitionLink><TransitionLink href="/legal/nondiscrimination">Nondiscrimination</TransitionLink><TransitionLink href="/legal/privacy">Privacy</TransitionLink><TransitionLink href="/legal/notice-of-privacy-practices">Notice of privacy practices</TransitionLink><TransitionLink href="/legal/emergency">Emergency information</TransitionLink></div>
      <small>© 2026 Canby Community Clinic · This website is not monitored for emergencies. Call 911 for urgent emergency care. Representative website imagery is original AI-generated media and does not depict actual Canby staff, patients, or facilities.</small>
    </footer>
  );
}
