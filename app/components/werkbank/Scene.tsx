'use client';
// Alles wat 3D is. Dit bestand (met three.js) wordt pas geladen nádat de naam op het scherm staat,
// zodat de pagina zelf meteen snel is.
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, DepthOfField, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PINK_MODE, SCENES, type SceneKey } from './scene/config';
import { useView } from './scene/useView';
import { CameraRig, Flightcase } from './scene/Flightcase';
import { DepthAlphaEffect } from './scene/DepthAlpha';
import { Lamp } from './scene/Lamp';
import { Laptop, Palley, QuadCortex, Turntable } from './scene/Models';
import { Cable, Mug, Setlist } from './scene/Props';
import { Extras } from './scene/Extras';
import { ScreenProjector } from './scene/ScreenProjector';
import type { Quality } from './hero/capabilities';
import { useChat } from '@/app/components/ask-maarten/store';

export type SceneProps = {
  sceneKey: SceneKey;
  pink: boolean; // easter egg
  onSelectScene: (k: SceneKey) => void;
  quality: Exclude<Quality, 'poster'>;
  onQualityDrop: (q: Quality) => void;
  onProgress: (p: number) => void;
  onReady: () => void;
  revealed: boolean;
  active: boolean; // false = tabblad verborgen of hero uit beeld: niets renderen
};

/** Zachte reflecties voor metaal (randen, Quad Cortex, laptop). */
function Environment() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    if (location.search.includes('debughits')) Object.assign(window, { __three: { scene, camera, THREE } });
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.18;
    return () => env.dispose();
  }, [gl, scene]);
  return null;
}

/** Volgt de laadvoortgang van alle modellen en texturen. */
function useLoadProgress(onProgress: (p: number) => void) {
  useEffect(() => {
    const m = THREE.DefaultLoadingManager;
    let best = 0;
    m.onProgress = (_url, loaded, total) => {
      best = Math.max(best, (loaded / Math.max(total, 1)) * 0.95); // de laatste 5% is het opwarmen
      onProgress(best);
    };
    return () => {
      m.onProgress = () => {};
    };
  }, [onProgress]);
}

/**
 * Wordt pas gerenderd als alle modellen er zijn (staat als laatste in dezelfde Suspense).
 * Compileert eerst alle shaders, zodat de onthulling niet hapert.
 */
function Ready({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree();
  const done = useRef(false);
  useEffect(() => {
    gl.compileAsync(scene, camera)
      .catch(() => {})
      .then(() => {
        if (!done.current) {
          done.current = true;
          requestAnimationFrame(() => onReady());
        }
      });
  }, [gl, scene, camera, onReady]);
  return null;
}

/**
 * Meet de beeldsnelheid na de onthulling. Haalt het toestel het niet, dan schakelt de hero terug:
 * hoog → licht (geen scherptediepte, lagere resolutie) → poster (vaste afbeelding).
 */
function PerfGuard({ quality, revealed, onDrop }: { quality: Quality; revealed: boolean; onDrop: (q: Quality) => void }) {
  const samples = useRef<number[]>([]);
  const settled = useRef(0);
  useFrame((_, dt) => {
    if (!revealed) return;
    settled.current += dt;
    if (settled.current < 1.5) return; // eerst de onthulling laten uitspelen
    samples.current.push(dt);
    if (samples.current.length < 120) return;
    const fps = samples.current.length / samples.current.reduce((a, b) => a + b, 0);
    samples.current = [];
    settled.current = 0;
    if (quality === 'high' && fps < 45) onDrop('low');
    else if (quality === 'low' && fps < 22) onDrop('poster');
  });
  return null;
}

export default function Scene(p: SceneProps) {
  const scene = p.pink ? PINK_MODE : SCENES[p.sceneKey];
  const { portrait, camera } = useView();
  const depthAlpha = useMemo(() => new DepthAlphaEffect(), []);
  const high = p.quality === 'high';
  const zoomed = useChat().open && !portrait; // ingezoomd op de laptop: alleen het scherm scherp
  useLoadProgress(p.onProgress);

  return (
    <Canvas
      aria-hidden
      style={{ position: 'absolute', inset: 0 }}
      frameloop={p.active ? 'always' : 'never'}
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={high ? [1, 1.5] : 1} // 2x op een retina-scherm kost 78% meer pixels, met scherptediepte bijna onzichtbaar
      gl={{ antialias: !high, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: 'high-performance' }}
      camera={{ fov: camera.fov, position: [0, 0.7, 1] }}
    >
      <Environment />
      <CameraRig />
      <ScreenProjector />
      <Lamp scene={scene} power={p.revealed ? 1 : 0} />
      <Flightcase />
      <Suspense fallback={null}>
        <Laptop />
        <QuadCortex onSelect={p.onSelectScene} />
        <Palley scene={scene} />
        <Mug scene={scene} />
        <Cable scene={scene} />
        <Turntable scene={scene} />
        <Setlist scene={scene} />
        {/* Alle objecten van alle scenes zitten erin, zodat ze mee geladen en gecompileerd worden */}
        <Extras scene={scene} />
        <Ready onReady={p.onReady} />
      </Suspense>
      <PerfGuard quality={p.quality} revealed={p.revealed} onDrop={p.onQualityDrop} />
      {high && (
        <EffectComposer multisampling={portrait ? 0 : 2}>
          {/* Scherp van Quad Cortex tot laptop; alleen de voorste rand en de verte vervagen */}
          <DepthOfField
            worldFocusDistance={zoomed ? 0.6 : camera.distance}
            worldFocusRange={zoomed ? 0.2 : portrait ? 0.7 : 0.55}
            bokehScale={portrait ? 2 : 3}
          />
          <Vignette offset={0.3} darkness={0.55} />
          <primitive object={depthAlpha} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
