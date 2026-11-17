'use client';
// Onderaan de hero: vier basgitaarsnaren die één voor één worden aangetokkeld (E, A, D, G),
// met "scroll" eronder. Laat zien dat er meer is, zonder een standaard pijltje.
import { useEffect, useState } from 'react';
import { COLORS } from '../scene/config';
import { useChat } from '@/app/components/ask-maarten/store';

const H = 54; // lengte van de snaren in px
const STRAIGHT = `M0 0 Q0 ${H / 2} 0 ${H}`;
// Uitwijking die uitdooft, zoals een snaar die na het tokkelen stilvalt
const PLUCK = [5, -4, 3, -2, 1.2, -0.6, 0]
  .map((a) => `M0 0 Q${a} ${H / 2} 0 ${H}`)
  .join(';');

export function ScrollHint({ reducedMotion, onClick }: { reducedMotion: boolean; onClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const chatOpen = useChat().open;
  const hidden = scrolled || chatOpen; // tijdens de chat niet over het toetsenbord
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={onClick}
      aria-label="Scroll to the projects"
      style={{
        position: 'absolute',
        zIndex: 5,
        left: '50%',
        bottom: 'clamp(16px, 2.4vw, 28px)',
        transform: `translateX(-50%) translateY(${hidden ? 12 : 0}px)`,
        opacity: hidden ? 0 : 1,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        background: 'none',
        border: 'none',
        padding: 8,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        color: COLORS.cream,
      }}
    >
      <svg width={46} height={H + 4} viewBox={`-6 -2 46 ${H + 4}`} aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 11} 0)`}>
            {/* Dikste snaar (E) links, dunste (G) rechts */}
            <path d={STRAIGHT} stroke={i === 0 ? COLORS.accent : COLORS.cream} strokeOpacity={i === 0 ? 1 : 0.75} strokeWidth={2 - i * 0.35} fill="none">
              {!reducedMotion && (
                <animate attributeName="d" values={`${STRAIGHT};${PLUCK}`} dur="0.9s" begin={`${0.4 + i * 0.22}s;pluck${i}.end+2.1s`} id={`pluck${i}`} fill="freeze" />
              )}
            </path>
          </g>
        ))}
      </svg>
      <span style={{ font: '600 11px var(--font-body), sans-serif', letterSpacing: '0.32em', paddingLeft: '0.32em' }}>SCROLL</span>
    </button>
  );
}
