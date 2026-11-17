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

    // Minder beweging: geen animatie
    if (reducedMotion) return;

    // gsap.context: bij het opruimen (navigeren, of React die het effect twee keer draait)
    // zet ctx.revert() alle stijlen terug. Zonder dat bleef de titel soms op opacity 0 staan.
    const ctx = gsap.context(() => {}, el);
    let split: SplitType | undefined;
    let cancelled = false;

    if (seen) {
      // Terugkerende bezoeker: korte fade
      ctx.add(() => gsap.from(el, { opacity: 0, duration: 0.3, ease: 'power1.out', clearProps: 'opacity' }));
    } else {
      // Wacht op het lettertype, anders splitst SplitType de fallback-letters
      document.fonts.ready.then(() => {
        if (cancelled) return;
        split = new SplitType(el, { types: 'chars' });
        ctx.add(() =>
          gsap.from(split?.chars ?? [], {
            yPercent: 110,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
            stagger: 0.035,
          }),
        );
      });
    }
    return () => {
      cancelled = true;
      ctx.revert();
      split?.revert();
    };
  }, [reducedMotion]);

  return (
    <h1 ref={ref} style={style} aria-label="Maarten Coppens, interactive designer and developer">
      MAARTEN
    </h1>
  );
}
