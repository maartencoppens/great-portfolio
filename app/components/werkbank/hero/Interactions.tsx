'use client';
// Alles wat laat zien dat de werkbank klikbaar is: pulserende puntjes, een label bij de cursor,
// en wat er speelt op de draaitafel.
import { useEffect, useRef, useState } from 'react';
import { COLORS } from '../scene/config';
import { cursorLabel, hotspots, hotspotsSeen, type HotspotId } from '../scene/screenState';
import { stop, TRACK, useNowPlaying } from '../audio/player';
import { useChat } from '@/app/components/ask-maarten/store';

const IDS: HotspotId[] = ['qc', 'turntable', 'palley', 'mug', 'setlist', 'cable'];

/**
 * Pulserende puntjes boven elk klikbaar object. Ze verdwijnen zodra je ergens op klikt
 * (voor de rest van je bezoek), en tijdens de chat.
 */
export function Hotspots({ visible }: { visible: boolean }) {
  const [seen, setSeen] = useState(hotspotsSeen.value);
  const { open } = useChat();
  useEffect(() => {
    if (seen) return;
    const id = window.setInterval(() => hotspotsSeen.value && setSeen(true), 400);
    return () => clearInterval(id);
  }, [seen]);
  const show = visible && !seen && !open;
  return (
    <>
      {IDS.map((id, i) => (
        <span
          key={id}
          ref={(el) => {
            hotspots[id].el = el;
          }}
          aria-hidden
          className="hotspot"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            opacity: show ? 1 : 0,
            transition: 'opacity 0.6s ease',
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </>
  );
}

/** Een klein label naast de cursor: zegt wat er gebeurt als je klikt. Alleen met een muis. */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return;
    let x = 0, y = 0, raf = 0, shown = '';
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const tick = () => {
      const el = ref.current;
      if (el) {
        const text = cursorLabel.text;
        if (text !== shown) {
          shown = text;
          el.textContent = text;
          el.style.opacity = text ? '1' : '0';
        }
        el.style.transform = `translate(${x + 18}px, ${y + 14}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 20,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.15s ease',
        padding: '6px 10px',
        borderRadius: 6,
        background: COLORS.cream,
        color: '#0e0c12',
        font: '700 12px var(--font-body), sans-serif',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}
    />
  );
}

/** "Nu op de draaitafel": verschijnt rechtsboven zodra de opname speelt. */
export function NowPlaying({ style }: { style: React.CSSProperties }) {
  const { playing, loading, error } = useNowPlaying();
  if (!playing && !loading && !error) return null;
  return (
    <div
      role="status"
      style={{ ...style, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', padding: '6px 6px 6px 12px', borderRadius: 999, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)' }}
    >
      {error ? (
        <span style={{ color: '#ff9ab0' }}>{error}</span>
      ) : (
        <>
          <span className="np-bars" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span>
            <b style={{ color: COLORS.pink }}>{TRACK.titel}</b> · {TRACK.ondertitel}
          </span>
          <button onClick={stop} aria-label="Stop the record" style={{ pointerEvents: 'auto', background: 'none', border: `1px solid ${COLORS.cream}55`, borderRadius: 999, color: COLORS.cream, font: 'inherit', padding: '3px 10px', cursor: 'pointer' }}>
            stop
          </button>
        </>
      )}
    </div>
  );
}
