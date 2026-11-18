'use client';
import './werkbank.css';
import { createPortal } from 'react-dom';
import { ScrollSmoother } from '@/app/lib/gsap';
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { COLORS, PINK_MODE, SCENES, SCENE_KEYS, type SceneKey } from './scene/config';
import { useView } from './scene/useView';
import { Title } from './hero/Title';
import { LoadBar } from './hero/LoadBar';
import { SceneButtons } from './hero/SceneButtons';
import { ChatPanel } from '@/app/components/ask-maarten/ChatPanel';
import { openChat, useChat } from '@/app/components/ask-maarten/store';
import { ScrollHint } from './hero/ScrollHint';
import { CursorLabel, Hotspots, NowPlaying } from './hero/Interactions';
import { LaptopScreenHtml, QuadCortexScreenHtml } from './scene/HtmlScreens';
import { initialQuality, qualityForced, rememberQuality, usePageVisible, useReducedMotion, type Quality } from './hero/capabilities';

// three.js en de modellen zitten in een apart bestand dat pas laadt als de naam al op het scherm staat
const Scene = lazy(() => import('./Scene'));

/** Na hoeveel seconden we opgeven en de vaste afbeelding tonen (heel trage verbinding). */
const GIVE_UP_AFTER = 12;

/** Scene volgt het tijdstip in België, tot je zelf een andere kiest. */
function sceneForNow(): SceneKey {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', timeZone: 'Europe/Brussels' }).format(new Date()));
  if (hour >= 6 && hour < 10) return 'B';
  if (hour >= 23 || hour < 6) return 'G';
  return 'A';
}

export default function Hero() {
  const [sceneKey, setSceneKey] = useState<SceneKey>(() => {
    const fromUrl = new URLSearchParams(location.search).get('scene')?.toUpperCase();
    return (SCENE_KEYS as string[]).includes(fromUrl ?? '') ? (fromUrl as SceneKey) : sceneForNow();
  });
  const [pink, setPink] = useState(false); // easter egg: typ "pinkties"
  const scene = pink ? PINK_MODE : SCENES[sceneKey];
  const { portrait } = useView();
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();

  const [quality, setQuality] = useState<Quality>(initialQuality);
  const [mount3D, setMount3D] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const revealed = ready; // zodra alles klaar is, schuift de tafel omhoog onder de letters
  const [inView, setInView] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // 1. De 3D pas inladen als de browser even tijd heeft (de naam staat er dan al)
  useEffect(() => {
    if (quality === 'poster') return;
    const start = () => setMount3D(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 500 }) ?? window.setTimeout(start, 200);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(idle) : clearTimeout(idle));
  }, [quality]);

  // 2. Duurt het te lang, dan tonen we de vaste afbeelding
  useEffect(() => {
    if (ready || quality === 'poster') return;
    const id = window.setTimeout(() => setQuality('poster'), GIVE_UP_AFTER * 1000);
    return () => clearTimeout(id);
  }, [ready, quality]);

  // 4. Niet renderen als de hero uit beeld is
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Toetsen A–H wisselen van scene. "pinkties" typen zet de easter egg aan of uit.
  useEffect(() => {
    let typed = '';
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      typed = (typed + e.key.toLowerCase()).slice(-8);
      if (typed === 'pinkties') {
        setPink((v) => !v);
        typed = '';
        return;
      }
      const k = e.key.toUpperCase() as SceneKey;
      if (SCENE_KEYS.includes(k)) {
        setPink(false);
        setSceneKey(k);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Ingezoomd op de laptop (chat open): niet scrollen, anders schuift de pagina onder het
  // vaste chatvenster weg en lijkt de interface los van het model te bewegen
  const chatOpen = useChat().open;
  useScrollLock(chatOpen);

  const onQualityDrop = useCallback((q: Quality) => {
    if (qualityForced()) return;
    rememberQuality(q);
    setQuality(q);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const selectScene = useCallback((k: SceneKey) => {
    setPink(false);
    setSceneKey(k);
  }, []);
  const onProgress = useCallback((p: number) => setProgress(p), []);

  const showPoster = quality === 'poster';
  // ?capture=1: enkel de 3D op een transparante achtergrond, om de vaste afbeelding (poster) te maken
  const capture = new URLSearchParams(location.search).has('capture');
  useStageReveal(stageRef, revealed || showPoster, showPoster, reducedMotion);
  const loading = !showPoster && !ready;

  return (
    <main style={capture ? { ...styles.page, background: 'transparent' } : styles.page} className={capture ? 'capture' : undefined}>
      <section ref={heroRef} aria-busy={loading} aria-label="Intro" style={styles.hero}>
        {/* Laag 1: grote typografie, meteen zichtbaar */}
        <Title style={(portrait ? styles.giantPortrait : styles.giant)!} reducedMotion={reducedMotion} />

        {/* Laag 2: de werkbank (3D), of de vaste afbeelding als vangnet */}
        <div ref={stageRef} style={styles.stage}>
          {showPoster ? (
            <picture>
              <source media={`(max-aspect-ratio: 85/100)`} srcSet="/werkbank/poster-mobiel.webp" />
              <img src="/werkbank/poster-desktop.webp" alt="" style={styles.poster} />
            </picture>
          ) : (
            mount3D && (
              <Suspense fallback={null}>
                {/* De schermen van laptop en Quad Cortex: echte HTML, in perspectief op de 3D gelegd */}
                <div className="screens" style={styles.screens}>
                  <LaptopScreenHtml scene={scene} />
                  <QuadCortexScreenHtml sceneKey={sceneKey} scene={scene} onSelect={selectScene} />
                  <Hotspots visible={revealed} />
                </div>
                <Scene
                  sceneKey={sceneKey}
                  pink={pink}
                  onSelectScene={selectScene}
                  quality={quality}
                  onQualityDrop={onQualityDrop}
                  onProgress={onProgress}
                  onReady={onReady}
                  revealed={revealed}
                  active={pageVisible && inView}
                />
              </Suspense>
            )
          )}
        </div>

        <LoadBar progress={ready ? 1 : progress} visible={loading} portrait={portrait} />

        {/* Laag 3: kleine typografie (de Navbar staat bovenaan) */}
        <div style={portrait ? styles.scene : styles.sceneDesktop} aria-hidden>
          <span style={{ color: scene.led }}>{pink ? '♥' : `1${sceneKey}`}</span> {scene.naam.toUpperCase()}
        </div>
        <NowPlaying style={(portrait ? styles.nowPlaying : styles.nowPlayingDesktop)!} />
        <p style={portrait ? styles.captionPortrait : styles.caption}>
          INTERACTIVE MEDIA DEVELOPER
          <br />
          BASSIST IN PINK TIES
        </p>
        {!showPoster && <SceneButtons active={sceneKey} onSelect={selectScene} />}
        {(revealed || showPoster) && (
          <ScrollHint reducedMotion={reducedMotion} onClick={scrollToProjects} />
        )}
        {/* De chat opent door op de laptop te klikken; deze knop is de ingang voor toetsenbordgebruikers */}
        <button className="focus-reveal" onClick={() => openChat()} style={styles.chatKey}>
          Talk to Ask Maarten
        </button>
      </section>

      {/* Buiten de ScrollSmoother-wrapper, anders verschuiven de vaste lagen mee */}
      {createPortal(
        <>
          <ChatPanel portrait={portrait || showPoster} sceneKey={sceneKey} />
          <CursorLabel />
        </>,
        document.body,
      )}
    </main>
  );
}

/** Zet scrollen op slot: ScrollSmoother pauzeren, en de pagina zelf niet laten scrollen. */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    // Touchpads en touchscreens: ook het scroll-gebaar zelf tegenhouden (behalve in de chat zelf)
    const block = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[role="dialog"]')) return;
      e.preventDefault();
    };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    return () => {
      smoother?.paused(false);
      root.style.overflow = previous;
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
    };
  }, [locked]);
}

/** Naar de projecten onder de hero, ook met ScrollSmoother. */
function scrollToProjects() {
  const target = document.getElementById('projects');
  if (!target) return;
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(target, true, 'top top');
  else target.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Laat de werkbank omhoog schuiven en invaden. Tijdgebaseerd (niet per frame): op een traag toestel
 * verspringt de animatie hooguit, maar ze raakt altijd op tijd klaar.
 */
function useStageReveal(ref: React.RefObject<HTMLDivElement | null>, shown: boolean, instant: boolean, reduced: boolean) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!shown) {
      el.style.opacity = '0';
      el.style.transform = reduced ? 'none' : 'translateY(9vh)';
      return;
    }
    if (instant) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    const duration = reduced ? 400 : 1400;
    const delay = reduced ? 0 : 500; // de letters even laten landen
    const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start - delay) / duration));
      const e = reduced ? t : expoOut(t);
      el.style.opacity = String(e);
      el.style.transform = reduced ? 'none' : `translateY(${(1 - e) * 9}vh)`;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [ref, shown, instant, reduced]);
}

const small: React.CSSProperties = {
  position: 'absolute',
  zIndex: 2,
  margin: 0,
  font: '600 15px/1.15 var(--font-body), system-ui, sans-serif',
  letterSpacing: '0.04em',
  pointerEvents: 'none',
};

const giantBase: React.CSSProperties = {
  position: 'absolute',
  zIndex: 0,
  left: 0,
  right: 0,
  margin: 0,
  textAlign: 'center',
  color: COLORS.cream,
  userSelect: 'none',
  fontWeight: 400,
};

const styles: Record<string, React.CSSProperties> = {
  page: { position: 'relative', background: 'var(--stage-base)' },
  hero: { position: 'relative', height: '100svh', overflow: 'hidden' },
  below: { minHeight: '100svh', padding: '18vh 6vw', boxSizing: 'border-box', borderTop: '1px solid #1d1a22' },
  belowLabel: { margin: 0, color: '#6d6676', font: '600 13px var(--font-body), sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' },
  belowTitle: { margin: '16px 0 0', color: COLORS.cream, font: '400 clamp(64px, 14vw, 220px)/0.85 var(--font-anton), Impact, sans-serif' },
  nowPlaying: { ...small, top: 'calc(var(--nav-h) + 30px)', right: 'clamp(20px, 3vw, 40px)', color: COLORS.cream, fontSize: 12, letterSpacing: '0.04em', pointerEvents: 'auto', zIndex: 6 },
  chatKey: { zIndex: 6, left: '50%', bottom: 90, transform: 'translateX(-50%)', padding: '10px 16px', borderRadius: 999, border: `1px solid ${COLORS.accent}`, background: '#0a0a0a', color: COLORS.cream, font: '600 13px var(--font-body), sans-serif' },
  // Op desktop staat de Navbar bovenaan en de naam eronder: scene-label linksonder, de plaat rechtsonder
  sceneDesktop: { ...small, bottom: 'calc(clamp(24px, 3vw, 36px) + 44px)', left: 'clamp(20px, 3vw, 40px)', color: COLORS.cream, font: '800 15px var(--font-display), sans-serif', letterSpacing: '0.08em' },
  nowPlayingDesktop: { ...small, bottom: 'clamp(24px, 3vw, 36px)', right: 'clamp(20px, 3vw, 40px)', color: COLORS.cream, fontSize: 12, letterSpacing: '0.04em', pointerEvents: 'auto', zIndex: 6 },
  giant: { ...giantBase, top: '11vh', font: '400 min(25.5vw, 50vh)/0.82 var(--font-anton), Impact, sans-serif', letterSpacing: '-0.005em' },
  giantPortrait: { ...giantBase, top: '20.5vh', font: '400 26vw/0.82 var(--font-anton), Impact, sans-serif' },
  stage: { position: 'absolute', inset: 0, zIndex: 1 },
  // Boven het canvas; de schermen zelf vangen kliks, de rest laat ze door naar de 3D
  screens: { position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', pointerEvents: 'none' },
  poster: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  logo: { ...small, top: 'clamp(20px, 3vw, 32px)', left: 'clamp(20px, 3vw, 40px)', color: COLORS.cream, font: '800 19px/0.95 var(--font-display), sans-serif', letterSpacing: '-0.01em' },
  scene: { ...small, top: 'calc(var(--nav-h) + 4px)', right: 'clamp(20px, 3vw, 40px)', color: COLORS.cream, font: '800 15px var(--font-display), sans-serif', letterSpacing: '0.08em' },
  caption: { ...small, bottom: 'clamp(24px, 3vw, 36px)', left: 'clamp(20px, 3vw, 40px)', color: COLORS.pink, letterSpacing: '0.1em', fontSize: 13 },
  // Op gsm staat de chatknop onderaan in het midden: de ondertitel schuift erboven
  captionPortrait: { ...small, bottom: 'calc(clamp(16px, 2.4vw, 28px) + 96px)', left: 0, right: 0, textAlign: 'center', color: COLORS.pink, letterSpacing: '0.1em', fontSize: 12 },
  arrow: { ...small, bottom: 'clamp(14px, 2.4vw, 26px)', right: 'clamp(20px, 3vw, 40px)', color: COLORS.cream, fontSize: 34 },
};
