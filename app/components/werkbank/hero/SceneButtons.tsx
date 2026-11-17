'use client';
// De 8 scenes als echte knoppen: bereikbaar met het toetsenbord (Tab) en voor schermlezers.
// Onzichtbaar tot ze focus krijgen; muis- en aanraakgebruikers gebruiken de Quad Cortex.
import { useState } from 'react';
import { SCENES, SCENE_KEYS, type SceneKey } from '../scene/config';

export function SceneButtons({ active, onSelect }: { active: SceneKey; onSelect: (k: SceneKey) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <>
      <nav
        aria-label="Workbench mood"
        onFocus={() => setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
        style={{
          position: 'absolute',
          zIndex: 4,
          left: '50%',
          bottom: 72,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          padding: 6,
          borderRadius: 12,
          background: 'rgba(10,10,10,0.85)',
          ...(focused ? {} : visuallyHidden),
        }}
      >
        {SCENE_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => onSelect(k)}
            aria-pressed={k === active}
            style={{
              font: '800 13px var(--font-display), sans-serif',
              letterSpacing: '0.04em',
              padding: '8px 10px',
              borderRadius: 8,
              border: `1px solid ${k === active ? SCENES[k].led : '#333'}`,
              background: k === active ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: '#f3ead8',
              cursor: 'pointer',
            }}
          >
            {k} · {SCENES[k].naam}
          </button>
        ))}
      </nav>
      {/* Kondigt de nieuwe scene aan voor schermlezers */}
      <div aria-live="polite" style={visuallyHidden}>
        Mood: {SCENES[active].naam}
      </div>
    </>
  );
}

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
