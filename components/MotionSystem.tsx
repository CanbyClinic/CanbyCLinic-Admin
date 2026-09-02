'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function MotionSystem() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceQuery.matches) return;
    const lenis = new Lenis({ lerp: .095, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('main');
    if (!root || !root.querySelector('.route-hero')) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const context = gsap.context(() => {
      if (reduce) {
        gsap.set(root.querySelectorAll('.reveal, .hero-copy > *'), { opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }
      const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
      hero.fromTo('.hero-eyebrow', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .55 })
        .fromTo('.hero-title span', { yPercent: 112, rotateX: -12 }, { yPercent: 0, rotateX: 0, duration: .95, stagger: .08 }, '-=.25')
        .fromTo('.hero-lead, .hero-actions', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .62, stagger: .09 }, '-=.52');

      gsap.to('.hero-copy', { yPercent: -17, opacity: .12, ease: 'none', scrollTrigger: { trigger: '.route-hero', start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.to('.threshold-lines i', { scaleX: 1, stagger: .06, ease: 'none', scrollTrigger: { trigger: '.route-hero', start: 'top top', end: 'bottom bottom', scrub: .6 } });

      root.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
        gsap.fromTo(element, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none reverse' } });
      });

      if (root.dataset.page === 'services') {
        root.querySelectorAll<HTMLElement>('.story-item').forEach((doorway) => {
          gsap.fromTo(doorway, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: doorway, start: 'top 92%', end: 'center 58%', scrub: .65 } });
        });
      }
      if (root.dataset.page === 'appointments') {
        gsap.to('.physical-door.left', { xPercent: -108, ease: 'none', scrollTrigger: { trigger: '.signature-stage', start: 'top top', end: 'bottom bottom', scrub: .7 } });
        gsap.to('.physical-door.right', { xPercent: 108, ease: 'none', scrollTrigger: { trigger: '.signature-stage', start: 'top top', end: 'bottom bottom', scrub: .7 } });
      }
      if (root.dataset.page === 'new-patients') {
        gsap.utils.toArray<HTMLElement>('.preparation-card').forEach((card, index) => {
          gsap.fromTo(card, { rotateY: index % 2 ? 8 : -8, y: 70 }, { rotateY: 0, y: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'center center', scrub: .8 } });
        });
      }
      if (root.dataset.page === 'resources') {
        gsap.fromTo('.resource-folder', { xPercent: (i) => i % 2 ? 14 : -14 }, { xPercent: 0, stagger: .05, ease: 'none', scrollTrigger: { trigger: '.resource-shelf', start: 'top bottom', end: 'center center', scrub: .7 } });
      }
      if (root.dataset.page === 'visit') {
        gsap.fromTo('.approach-frame', { rotateX: 58, scale: .78, yPercent: 15 }, { rotateX: 8, scale: 1, yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.signature-stage', start: 'top top', end: 'bottom bottom', scrub: .8 } });
      }
      if (root.dataset.page === 'our-clinic') {
        root.querySelectorAll<HTMLElement>('.story-item').forEach((portrait, index) => {
          gsap.fromTo(portrait, { filter: 'blur(10px)', scale: .97, transformOrigin: index % 2 ? 'right center' : 'left center' }, { filter: 'blur(0px)', scale: 1, ease: 'none', scrollTrigger: { trigger: portrait, start: 'top 90%', end: 'center 55%', scrub: .7 } });
        });
      }
    }, root);
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [pathname]);

  return null;
}
