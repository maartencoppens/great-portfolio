'use client';
// De schermen van de laptop en de Quad Cortex zijn echte HTML: scherp, selecteerbaar en klikbaar.
// ScreenProjector (in de 3D) legt ze elke frame in perspectief op hun plek.
import { useEffect, useRef } from 'react';
import { SCENES, SCENE_KEYS, type SceneConfig, type SceneKey } from './config';
import { openChat, useChat } from '@/app/components/ask-maarten/store';
import { prefersReducedMotion } from '../hero/capabilities';
import { cursorLabel, hotspotsSeen, hover, screenTargets } from './screenState';
import { bands, useNowPlaying } from '../audio/player';

/* ---------------- De HTML zelf (buiten het canvas, in dezelfde laag) ---------------- */

// Vragen die op het laptopscherm "getypt" worden, als lokaas om te klikken
const TEASERS = ['What sound do you use live?', 'What do you like working on?', 'What is Step Up?', 'Why purple?'];

const layer: React.CSSProperties = { position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', overflow: 'hidden' };

/**
 * Het laptopscherm: een teaser van Ask Maarten in dezelfde stijl als de chat.
 * Een vraag typt zichzelf, de ON AIR-lamp gloeit en een knop nodigt uit om te klikken.
 */
export function LaptopScreenHtml({ scene }: { scene: SceneConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const { open } = useChat();
  const mode = open ? 'leeg' : scene.props.laptop === 'screensaver' ? 'screensaver' : 'teaser';

  useEffect(() => {
    const el = ref.current!;
    el.style.visibility = 'hidden';
    screenTargets.laptop.el = el;
    return () => {
      if (screenTargets.laptop.el === el) screenTargets.laptop.el = null;
    };
  }, []);

  // Typen, even laten staan, wissen, volgende vraag
  useEffect(() => {
    if (mode !== 'teaser') return;
    const el = typed.current!;
    if (prefersReducedMotion()) {
      el.textContent = TEASERS[0]!;
      return;
    }
    let q = 0, n = 0, phase: 'typen' | 'staan' | 'wissen' = 'typen', wait = 0;
    const id = window.setInterval(() => {
      const text = TEASERS[q]!;
      if (phase === 'typen') {
        n++;
        if (n >= text.length) phase = 'staan';
      } else if (phase === 'staan') {
        if (++wait > 40) {
          phase = 'wissen';
          wait = 0;
        }
      } else {
        n = Math.max(0, n - 2);
        if (n === 0) {
          phase = 'typen';
          q = (q + 1) % TEASERS.length;
        }
      }
      el.textContent = text.slice(0, n);
    }, 55);
    return () => clearInterval(id);
  }, [mode]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="teaser"
      onClick={() => {
        hotspotsSeen.mark();
        openChat();
      }}
      onPointerEnter={() => {
        hover.html = true;
        cursorLabel.text = 'Talk to Ask Maarten';
      }}
      onPointerLeave={() => {
        hover.html = false;
        cursorLabel.text = '';
      }}
      style={{ ...layer, width: 924, height: 600, background: mode === 'screensaver' ? '#060509' : '#0e0c12', cursor: 'pointer', pointerEvents: 'auto', color: '#f3ead8' }}
    >
      {mode === 'teaser' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 34px', borderBottom: '1px solid #221d2b' }}>
            <span style={{ font: '800 26px var(--font-display), sans-serif', letterSpacing: '0.02em' }}>ASK MAARTEN</span>
            <span style={{ font: '500 18px var(--font-body), sans-serif', color: '#a39cae' }}>an AI version of me</span>
            <span style={{ flex: 1 }} />
            <span
              className="onair"
              style={{ font: '800 17px var(--font-display), sans-serif', letterSpacing: '0.16em', padding: '8px 14px', borderRadius: 5, background: '#ff4f8b', color: '#16060d', boxShadow: '0 0 22px rgba(255,79,139,0.7)' }}
            >
              ON AIR
            </span>
          </div>
          <div style={{ padding: '46px 34px 0' }}>
            <div style={{ font: '700 16px var(--font-body), sans-serif', letterSpacing: '0.2em', color: '#a39cae', marginBottom: 12 }}>YOU</div>
            <div style={{ font: '400 64px/0.98 var(--font-anton), Impact, sans-serif', textTransform: 'uppercase', minHeight: 130 }}>
              <span ref={typed} />
              <span className="caret" />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 34, right: 34, bottom: 36, display: 'flex', alignItems: 'center', gap: 20 }}>
            <Equalizer />
            <span style={{ flex: 1 }} />
            <span
              className="teaser-cta"
              style={{ font: '800 20px var(--font-display), sans-serif', letterSpacing: '0.12em', padding: '14px 24px', borderRadius: 999, border: '2px solid #7a3cf0', background: 'rgba(122,60,240,0.18)' }}
            >
              CLICK TO TALK ↵
            </span>
          </div>
        </>
      )}
      {mode === 'screensaver' && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <span className="zzz" style={{ font: '800 72px var(--font-display), sans-serif', color: 'rgba(167,123,255,0.55)' }}>
            zzz
          </span>
        </div>
      )}
    </div>
  );
}

/** Kleine niveaumeter, alsof er een stem klaarstaat om te antwoorden. */
function Equalizer() {
  return (
    <span style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 34 }}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span key={i} className="eq-bar" style={{ width: 6, height: '100%', borderRadius: 3, background: i % 3 === 0 ? '#e79ecb' : '#7a3cf0', animationDelay: `${-i * 0.17}s` }} />
      ))}
    </span>
  );
}

export function QuadCortexScreenHtml({ sceneKey, scene, onSelect }: { sceneKey: SceneKey; scene: SceneConfig; onSelect: (k: SceneKey) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    el.style.visibility = 'hidden';
    screenTargets.qc.el = el;
    return () => {
      if (screenTargets.qc.el === el) screenTargets.qc.el = null;
    };
  }, []);
  const off = !!scene.props.qcUit;
  const { playing } = useNowPlaying();
  return (
    // aria-hidden: toetsenbord- en schermlezergebruikers hebben de aparte scene-knoppen
    <div
      ref={ref}
      aria-hidden
      onPointerEnter={() => (hover.html = true)}
      onPointerLeave={() => (hover.html = false)}
      style={{ ...layer, width: 1050, height: 600, background: '#050505', pointerEvents: 'auto' }}>
      {!off && (
        <div style={{ padding: '34px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 34 }}>
            <div style={{ font: '800 84px/1 var(--font-display), sans-serif', color: '#fff', flex: 1 }}>
              1<span style={{ color: scene.led }}>{sceneKey}</span> {scene.naam}
            </div>
            {playing ? (
              <LevelMeter color={scene.led} />
            ) : (
              <span className="qc-keyhint" style={{ font: '500 28px var(--font-body), sans-serif', color: '#8a8a8a', letterSpacing: '0.04em' }}>
                or press A–H
              </span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
            {SCENE_KEYS.map((k) => {
              const active = k === sceneKey;
              return (
                <button
                  key={k}
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    hotspotsSeen.mark();
                    onSelect(k);
                  }}
                  onPointerEnter={() => (cursorLabel.text = `Mood ${k} · ${SCENES[k].naam}`)}
                  onPointerLeave={() => (cursorLabel.text = '')}
                  style={{
                    height: 170,
                    borderRadius: 22,
                    border: `${active ? 6 : 3}px solid ${active ? SCENES[k].led : '#3a3a3a'}`,
                    background: active ? 'rgba(255,255,255,0.08)' : '#0d0d0d',
                    textAlign: 'left',
                    padding: '20px 24px',
                    cursor: 'pointer',
                    color: active ? '#fff' : '#9a9a9a',
                  }}
                >
                  <div style={{ font: '800 54px/1 var(--font-display), sans-serif', color: active ? SCENES[k].led : '#8a8a8a' }}>{k}</div>
                  <div style={{ font: '500 30px/1.4 var(--font-body), sans-serif', marginTop: 14 }}>{SCENES[k].naam}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Niveaumeter op de Quad Cortex: beweegt mee met de Pink Ties-opname. */
function LevelMeter({ color }: { color: string }) {
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const b = bands(10);
      bars.current.forEach((el, i) => el && (el.style.transform = `scaleY(${0.08 + b[i] * 0.92})`));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} ref={(el) => {
            bars.current[i] = el;
          }} style={{ width: 16, height: '100%', borderRadius: 4, background: color, transformOrigin: 'bottom' }} />
      ))}
    </div>
  );
}
