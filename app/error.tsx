'use client';

import { useEffect } from 'react';
import SiteFooter from '../components/SiteFooter';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="utility-page legal-page" id="main-content">
      <article>
        <p>Canby Community Clinic</p>
        <h1>Let’s try that again.</h1>
        <h2>The page could not finish loading. No medical information was submitted.</h2>
        <button className="button primary" type="button" onClick={reset}>Try again <span>↗</span></button>
      </article>
      <SiteFooter />
    </main>
  );
}
