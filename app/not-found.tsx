import SiteFooter from '../components/SiteFooter';
import TransitionLink from '../components/TransitionLink';

export default function NotFound() {
  return (
    <main className="utility-page legal-page" id="main-content">
      <article>
        <p>Canby Community Clinic · 404</p>
        <h1>That path ends here.</h1>
        <h2>The page may have moved, but the clinic information is still close.</h2>
        <TransitionLink className="button primary" href="/">Return home <span>↗</span></TransitionLink>
      </article>
      <SiteFooter />
    </main>
  );
}
