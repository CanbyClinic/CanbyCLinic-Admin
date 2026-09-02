import Image from 'next/image';
import TransitionLink from '../components/TransitionLink';
import SiteFooter from '../components/SiteFooter';
import { clinic } from '../content/site';

const pathways = [
  ['Primary care', 'Everyday concerns and practical follow-up', '/services#primary-care'],
  ['Preventive care', 'Screening conversations and earlier action', '/services#preventive-care'],
  ['Medication support', 'Lists, access questions, and safer use', '/services#medication-support'],
  ['Testing and referrals', 'Outside services with a visible next step', '/services#testing-and-referrals'],
  ['Health education', 'Plain-language tools for everyday decisions', '/services#health-education'],
  ['Care navigation', 'Results, pharmacies, referrals, and follow-through', '/services#care-navigation'],
];

const visit = [
  ['Request', 'Choose a reason, preferred day, and time.'],
  ['Confirm', 'Wait for the clinic to confirm availability.'],
  ['Prepare', 'Bring ID, medications, records, and questions.'],
  ['Continue', 'Leave knowing what happens next.'],
];

export default function Home() {
  return (
    <main className="route-page route-home" data-page="home" id="main-content">
      <div className="route-poster" aria-hidden="true"><Image src="/assets/scenes/h-01-arrival.png" alt="" fill priority sizes="100vw" /></div>
      <section className="route-hero home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="hero-eyebrow">Community care · Reseda, California</p>
          <h1 className="hero-title" id="home-title"><span>Care begins</span>{' '}<span>with being heard.</span></h1>
          <p className="hero-lead">Canby Community Clinic brings primary care, prevention, medication support, and practical guidance into one human conversation.</p>
          <div className="hero-actions"><TransitionLink className="button primary" href="/request-visit">Request a visit <span>↗</span></TransitionLink><a className="button secondary" href={clinic.phoneHref}>Call {clinic.phoneDisplay}</a></div>
        </div>
        <div className="scene-id"><span>H-01</span><span>The open door</span></div>
        <div className="threshold-lines" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="home-threshold" aria-label="Clinic arrival sequence">
        <div className="threshold-copy reveal"><p>Nearby. Welcomed. Heard.</p><h2>One clear path through care.</h2><span>Scroll through the entrance. The camera moves from the Reseda sidewalk into a calm clinic conversation—then pauses so the practical choices remain easy to read.</span></div>
        <div className="glass-doors" aria-hidden="true"><i /><i /></div>
      </section>

      <section className="care-hallway" aria-labelledby="care-title">
        <header className="index-heading reveal"><p>Choose a care path</p><h2 id="care-title">What brings you in today?</h2></header>
        <div className="hallway-grid">
          {pathways.map(([title, copy, href], index) => (
            <TransitionLink className="hallway-door reveal" href={href} key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{copy}</p></div><i>↗</i>
            </TransitionLink>
          ))}
        </div>
      </section>

      <section className="visit-journey" aria-labelledby="visit-title">
        <header className="index-heading reveal"><p>Your visit</p><h2 id="visit-title">Four moments. One continuous path.</h2></header>
        <div className="journey-rail">
          {visit.map(([title, copy], index) => <article className="journey-stop reveal" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="facts-room" aria-label="Essential clinic information">
        <div className="facts-copy reveal"><p>Essential information</p><h2>Care, close to home.</h2></div>
        <div className="facts-grid">
          <article><span>Call</span><a href={clinic.phoneHref}>{clinic.phoneDisplay}</a></article>
          <article><span>Visit</span><p>{clinic.addressLine1}<br />{clinic.addressLine2}</p></article>
          <article><span>Hours</span><p>{clinic.hours}</p></article>
          <article><span>Before you go</span><p>Call to confirm availability and appointment status.</p></article>
        </div>
        <div className="hero-actions"><TransitionLink className="button primary" href="/request-visit">Request a visit <span>↗</span></TransitionLink><a className="button secondary dark" href={clinic.directions}>Get directions</a></div>
      </section>

      <section className="route-final home-final"><div className="final-copy reveal"><p>A clear next step</p><h2>Begin with a conversation.</h2><span>A visit request is not confirmation. Call or send a request and wait for the clinic to confirm availability.</span></div><SiteFooter /></section>
    </main>
  );
}
