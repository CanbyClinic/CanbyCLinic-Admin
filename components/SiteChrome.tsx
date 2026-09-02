'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import TransitionLink from './TransitionLink';
import MotionSystem from './MotionSystem';

const ClinicWorld = dynamic(() => import('./ClinicWorld'), { ssr: false });

const nav = [
  { href: '/services', label: 'Services' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/new-patients', label: 'New patients' },
  { href: '/resources', label: 'Resources' },
  { href: '/visit', label: 'Visit' },
  { href: '/our-clinic', label: 'Our clinic' },
];

export default function SiteChrome() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const threshold = document.querySelector<HTMLElement>('.route-curtain');
    if (!threshold) return;
    threshold.dataset.state = 'revealing';
    const timer = window.setTimeout(() => { threshold.dataset.state = 'idle'; }, 760);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? 'true' : 'false';
    return () => { delete document.body.dataset.menuOpen; };
  }, [open]);

  return (
    <>
      <ClinicWorld />
      <MotionSystem />
      <a className="skip-link" href="#main-content">Skip to clinic information</a>
      <header className="site-header">
        <TransitionLink className="brand-logo" href="/" aria-label="Canby Community Clinic home">
          <Image src="/assets/logo/canby-logo-original.jpeg" alt="Canby Community Clinic — Pura Vida Community Clinic" width={1529} height={608} priority />
        </TransitionLink>
        <nav aria-label="Primary navigation">
          {nav.map((item) => <TransitionLink aria-current={pathname === item.href ? 'page' : undefined} href={item.href} key={item.href}>{item.label}</TransitionLink>)}
        </nav>
        <TransitionLink className="header-cta" href="/request-visit">Request a visit <span>↗</span></TransitionLink>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}><span>{open ? 'Close' : 'Menu'}</span><i /><i /></button>
      </header>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} id="mobile-menu" aria-hidden={!open}>
        <p>Find your way through Canby</p>
        {nav.map((item, index) => <TransitionLink href={item.href} key={item.href} onClick={() => setOpen(false)}><small>{String(index + 1).padStart(2, '0')}</small><span>{item.label}</span><i>↗</i></TransitionLink>)}
        <TransitionLink className="mobile-request" href="/request-visit" onClick={() => setOpen(false)}>Request a visit</TransitionLink>
        <a className="mobile-call" href="tel:+18186744414">Call (818) 674-4414</a>
      </div>
      <div className="route-curtain" data-state="idle" aria-hidden="true"><div className="threshold-door threshold-left" /><div className="threshold-door threshold-right" /><span>Canby Community Clinic</span></div>
    </>
  );
}
