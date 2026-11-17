'use client';
// Wat kan dit toestel, en wat wil deze bezoeker? Bepaalt hoe zwaar de hero mag zijn.
import { useEffect, useState } from 'react';

export type Quality = 'high' | 'low' | 'poster';

const mq = (q: string) => (typeof matchMedia !== 'undefined' ? matchMedia(q) : null);

/** "Minder beweging" in de systeeminstellingen. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => mq('(prefers-reduced-motion: reduce)')?.matches ?? false);
  useEffect(() => {
    const m = mq('(prefers-reduced-motion: reduce)');
    if (!m) return;
    const on = () => setReduced(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Voor 3D-code buiten React-state (bv. in useFrame): de huidige voorkeur, zonder elke frame te meten. */
let reducedNow = mq('(prefers-reduced-motion: reduce)')?.matches ?? false;
mq('(prefers-reduced-motion: reduce)')?.addEventListener('change', (e) => (reducedNow = e.matches));
export const prefersReducedMotion = () => reducedNow;

function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * Startkwaliteit. 'poster' = geen 3D, enkel een vooraf gerenderde afbeelding.
 * Tijdens het draaien kan PerfGuard nog terugschakelen als het toestel het niet trekt.
 * Testen kan met ?quality=high|low|poster in de URL.
 */
/** Staat de kwaliteit vast via de URL? Dan schakelt PerfGuard niet terug (handig om te testen). */
export const qualityForced = () => /[?&]quality=(high|low|poster)/.test(location.search);

export function initialQuality(): Quality {
  const forced = new URLSearchParams(location.search).get('quality');
  if (forced === 'high' || forced === 'low' || forced === 'poster') return forced;
  try {
    const stored = sessionStorage.getItem('hero-quality');
    if (stored === 'low' || stored === 'poster') return stored;
  } catch {}
  if (!hasWebGL2()) return 'poster';
  // Databesparing aan of een heel trage verbinding: geen 2 MB aan modellen
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') return 'poster';
  // Weinig geheugen of rekenkernen: start meteen licht
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if ((mem && mem <= 4) || navigator.hardwareConcurrency <= 4) return 'low';
  return 'high';
}

export function rememberQuality(q: Quality) {
  try {
    sessionStorage.setItem('hero-quality', q);
  } catch {}
}

/** Is de pagina zichtbaar (tabblad actief)? Zo niet, dan renderen we niets. */
export function usePageVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  useEffect(() => {
    const on = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return visible;
}
