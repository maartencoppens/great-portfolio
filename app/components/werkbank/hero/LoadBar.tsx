'use client';
// Laadbalk in de vorm van de paarse kabel, op de plek waar straks de tafel verschijnt.
import { COLORS } from '../scene/config';

export function LoadBar({ progress, visible, portrait }: { progress: number; visible: boolean; portrait: boolean }) {
  const pct = Math.round(progress * 100);
  return (
    <div
      role="progressbar"
      aria-label="Loading the workbench"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      style={{
        position: 'absolute',
        zIndex: 3,
        left: '50%',
        top: portrait ? '62vh' : '72vh',
        width: portrait ? '56vw' : 'min(28vw, 420px)',
        transform: 'translateX(-50%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }}
    >
      <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 3,
            background: COLORS.accent,
            boxShadow: `0 0 12px ${COLORS.accent}`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', font: '500 12px var(--font-body), sans-serif', letterSpacing: '0.08em', color: '#8b8496' }}>
        SETTING UP THE WORKBENCH · {pct}%
      </div>
    </div>
  );
}
