'use client';
// De grote naam. Dit is meteen de loader: de letters staan er direct (echte <h1>, goed voor SEO
// en schermlezers) en schuiven omhoog zoals in de huidige preloader van maartencoppens.be.
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

const SEEN_KEY = 'intro-seen';

export function Title({ style, reducedMotion }: { style: React.CSSProperties; reducedMotion: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}

    // Minder beweging: geen animatie. Terugkerende bezoeker: korte fade.
    if (reducedMotion) return;
    if (seen) {
      const t = gsap.from(el, { opacity: 0, duration: 0.3, ease: 'power1.out' });
      return () => {
        t.kill();
      };
    }

    let split: SplitType | undefined;
    let tl: gsap.core.Timeline | undefined;
    // Wacht op het lettertype, anders splitst SplitType de fallback-letters
    document.fonts.ready.then(() => {
      split = new SplitType(el, { types: 'chars' });
      tl = gsap.timeline().from(split.chars ?? [], {
        yPercent: 110,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.035,
      });
    });
    return () => {
      tl?.kill();
      split?.revert();
    };
  }, [reducedMotion]);

  return (
    <h1 ref={ref} style={style} aria-label="Maarten Coppens">
      MAARTEN
    </h1>
  );
}
