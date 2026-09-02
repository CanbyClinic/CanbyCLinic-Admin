import Image from 'next/image';
import type { RouteStory } from '../content/site';
import { clinic } from '../content/site';
import TransitionLink from './TransitionLink';
import SiteFooter from './SiteFooter';

function Signature({ story }: { story: RouteStory }) {
  if (story.variant === 'appointments') {
    return (
      <section className="signature-stage door-stage" aria-labelledby="signature-title">
        <div className="signature-pin">
          <div className="physical-door left"><span>Request</span></div>
          <div className="physical-door right"><span>Enter</span></div>
          <div className="signature-message"><p>{story.sectionKicker}</p><h2 id="signature-title">{story.sectionTitle}</h2><span>Scroll to open the clinic entrance.</span></div>
        </div>
      </section>
    );
  }

  if (story.variant === 'visit') {
    return (
      <section className="signature-stage approach-stage" aria-labelledby="signature-title">
        <div className="signature-pin approach-pin">
          <div className="approach-frame"><Image src={story.asset} alt="" fill sizes="100vw" priority={false} /></div>
          <div className="location-beacon"><span>Canby</span><i /></div>
          <div className="signature-message"><p>{story.sectionKicker}</p><h2 id="signature-title">{story.sectionTitle}</h2></div>
        </div>
      </section>
    );
  }

  return (
    <section className={`signature-stage ${story.variant}-stage`} aria-labelledby="signature-title">
      <div className="signature-pin">
        <div className="signature-message"><p>{story.sectionKicker}</p><h2 id="signature-title">{story.sectionTitle}</h2><span>{story.sceneLabel}</span></div>
      </div>
    </section>
  );
}

export default function RouteExperience({ story }: { story: RouteStory }) {
  return (
    <main className={`route-page route-${story.variant}`} data-page={story.variant} id="main-content">
      <div className="route-poster" aria-hidden="true"><Image src={story.asset} alt="" fill priority sizes="100vw" /></div>
      <section className="route-hero" aria-labelledby="route-title">
        <div className="hero-copy">
          <p className="hero-eyebrow">{story.kicker}</p>
          <h1 className="hero-title" id="route-title"><span>{story.title}</span></h1>
          <p className="hero-lead">{story.lead}</p>
          <div className="hero-actions">
            <TransitionLink className="button primary" href="/request-visit">Request a visit <span>↗</span></TransitionLink>
            <a className="button secondary" href={clinic.phoneHref}>Call {clinic.phoneDisplay}</a>
          </div>
        </div>
        <div className="scene-id"><span>{story.assetId}</span><span>{story.sceneLabel}</span></div>
        <div className="threshold-lines" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <Signature story={story} />

      <section className={`story-index ${story.variant === 'resources' ? 'resource-shelf' : ''}`} aria-label={`${story.variant} information`}>
        <header className="index-heading reveal"><p>{story.sectionKicker}</p><h2>{story.sectionTitle}</h2></header>
        <div className="story-items">
          {story.items.map((item, index) => (
            <article className={`story-item reveal ${story.variant === 'new-patients' ? 'preparation-card' : ''} ${story.variant === 'resources' ? 'resource-folder' : ''}`} id={item.title.toLowerCase().replaceAll(' ', '-')} key={item.title}>
              <div className="item-number"><span>{String(index + 1).padStart(2, '0')}</span><i /></div>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <div><span>{item.copy}</span>{item.detail && <small>{item.detail}</small>}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="route-final">
        <div className="final-copy reveal"><p>Canby Community Clinic</p><h2>{story.finalTitle}</h2><span>{story.finalCopy}</span><div className="hero-actions"><TransitionLink className="button primary" href="/request-visit">Request a visit <b>↗</b></TransitionLink><a className="button secondary" href={clinic.phoneHref}>Call clinic</a></div></div>
        <SiteFooter />
      </section>
    </main>
  );
}
