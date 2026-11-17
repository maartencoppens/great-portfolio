'use client';
// Objecten en effecten die per scene verschijnen (zie SceneProps in config.ts).
import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { SceneConfig, Vec3 } from './config';
import { useView } from './useView';
import { rng } from './textures';
import { MugBody } from './Props';
import { prefersReducedMotion } from '../hero/capabilities';

const draco = new DRACOLoader().setDecoderPath('/werkbank/draco/');
// Vooraf laden (23 KB), zodat de koptelefoon er meteen ligt bij Focus
useLoader.preload(GLTFLoader, '/werkbank/models/koptelefoon.glb', (l) => l.setDRACOLoader(draco));

/** Plaatsen van de extra objecten, voor liggend en staand scherm. */
function usePlaces() {
  const { portrait } = useView();
  return portrait
    ? {
        koptelefoon: { pos: [-0.2, 0, -0.04] as Vec3, rotY: 0.5 },
        tassen: [[-0.2, 0, -0.06], [0.22, 0, -0.17], [-0.21, 0, -0.21]] as Vec3[],
        postits: [[0.06, 0.0125, -0.1], [-0.07, 0.0125, -0.11]] as Vec3[],
        papieren: [[0.16, 0, 0.27], [-0.18, 0, 0.18]] as Vec3[],
        plectrums: [[0.17, 0, 0.18], [0.21, 0, 0.21], [-0.17, 0, 0.21]] as Vec3[],
      }
    : {
        // Links vooraan, naast de Quad Cortex: daar is het vrij (de platenspeler staat achteraan links)
        koptelefoon: { pos: [-0.47, 0, 0.21] as Vec3, rotY: 0.25 },
        tassen: [[0.55, 0, -0.17], [0.3, 0, 0.12], [-0.48, 0, 0.13]] as Vec3[],
        postits: [[0.09, 0.0125, -0.1], [-0.06, 0.0125, -0.11], [0.15, 0.0005, 0.02]] as Vec3[],
        papieren: [[0.08, 0, 0.17], [0.42, 0, 0.12], [-0.02, 0, 0.26]] as Vec3[],
        plectrums: [[0.08, 0, 0.12], [0.12, 0, 0.16], [0.04, 0, 0.2], [0.33, 0, 0.18]] as Vec3[],
      };
}

export function Extras({ scene }: { scene: SceneConfig }) {
  const p = scene.props;
  const places = usePlaces();
  // Alles staat altijd in de scene (vooraf geladen en gecompileerd); Appear laat het
  // zacht op de tafel vallen of weer verdwijnen. Zo hapert wisselen van scene nooit.
  return (
    <>
      <CoffeeRings />
      <Appear show={!!p.koptelefoon}>
        <Headphones {...places.koptelefoon} />
      </Appear>
      {places.plectrums.map((pos, i) => (
        <Appear key={i} show={!!p.plectrums} delay={i * 0.07}>
          <Plectrum pos={pos} seed={i} />
        </Appear>
      ))}
      {places.postits.map((pos, i) => (
        <Appear key={i} show={!!p.postits} delay={i * 0.12}>
          <PostIt pos={pos} seed={i} />
        </Appear>
      ))}
      {places.papieren.map((pos, i) => (
        <Appear key={i} show={!!p.papieren} delay={i * 0.1}>
          <Paper pos={pos} seed={i} />
        </Appear>
      ))}
      {places.tassen.map((pos, i) => (
        <Appear key={i} show={i < (p.extraTassen ?? 0)} delay={i * 0.15}>
          <group position={pos} rotation-y={i * 1.7}>
            <MugBody level={i === 1 ? 0.02 : 0} />
          </group>
        </Appear>
      ))}
      <PawPrints show={!!p.pootjes} />
      <StageSpots show={!!p.podiumspots} />
      <WindowLight show={!!p.raam} />
    </>
  );
}

/**
 * Laat objecten verschijnen alsof ze op tafel gelegd worden (klein → normaal, van iets hoger),
 * en verdwijnen in omgekeerde richting. Verborgen objecten blijven bestaan (piepklein), zodat er
 * bij het wisselen niets geladen of gecompileerd moet worden.
 */
export function Appear({ show, delay = 0, children }: { show: boolean; delay?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(show ? 1 : 0);
  const wait = useRef(0);
  const prev = useRef(show);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    if (prev.current !== show) {
      prev.current = show;
      wait.current = show ? delay : 0;
    }
    if (wait.current > 0) {
      wait.current -= dt;
      return;
    }
    const speed = prefersReducedMotion() ? 100 : show ? 2.2 : 3.5;
    t.current = THREE.MathUtils.clamp(t.current + (show ? dt : -dt) * speed, 0, 1);
    const e = show ? easeOutBack(t.current) : t.current * t.current;
    const s = Math.max(e, 0.0001);
    g.scale.setScalar(s);
    g.position.y = (1 - Math.min(e, 1)) * 0.05;
  });
  return (
    <group ref={ref} scale={show ? 1 : 0.0001}>
      {children}
    </group>
  );
}

const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);

function Headphones({ pos, rotY }: { pos: Vec3; rotY: number }) {
  const gltf = useLoader(GLTFLoader, '/werkbank/models/koptelefoon.glb', (l) => l.setDRACOLoader(draco));
  const model = useMemo(() => {
    const m = gltf.scene.clone(true);
    m.traverse((o) => (o.castShadow = o.receiveShadow = true));
    return m;
  }, [gltf]);
  // Plat op tafel: op zijn kant gekanteld
  return (
    <group position={[pos[0], 0.049, pos[2]]} rotation-y={rotY}>
      <primitive object={model} rotation-x={-Math.PI / 2} position-z={0.099} />
    </group>
  );
}

/** Plectrum: afgeronde driehoek, in Pink Ties-roze of paars. */
function Plectrum({ pos, seed }: { pos: Vec3; seed: number }) {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.015);
    s.quadraticCurveTo(0.014, 0.014, 0.011, -0.002);
    s.quadraticCurveTo(0.006, -0.013, 0, -0.016);
    s.quadraticCurveTo(-0.006, -0.013, -0.011, -0.002);
    s.quadraticCurveTo(-0.014, 0.014, 0, 0.015);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.0008, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const r = rng(seed + 3);
  return (
    <mesh geometry={geometry} position={[pos[0], 0.0002, pos[2]]} rotation-y={r() * Math.PI * 2} castShadow receiveShadow>
      <meshStandardMaterial color={seed % 2 ? '#e79ecb' : '#7a3cf0'} roughness={0.35} />
    </mesh>
  );
}

function PostIt({ pos, seed }: { pos: Vec3; seed: number }) {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = ['#ffe86b', '#ff9ad5', '#9ff0c0'][seed % 3]!;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, 256, 34);
    ctx.fillStyle = '#2b2b2b';
    ctx.font = `600 40px ${getComputedStyle(document.body).getPropertyValue('--font-body') || 'sans-serif'}, sans-serif`;
    const lines = [['deadline', 'friday!'], ['fix', 'the bug'], ['get', 'coffee']][seed % 3]!;
    lines.forEach((l, i) => ctx.fillText(l, 26, 110 + i * 56));
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [seed]);
  const r = rng(seed + 11);
  return (
    <mesh position={pos} rotation={[-Math.PI / 2, 0, (r() - 0.5) * 0.6]} receiveShadow castShadow>
      <planeGeometry args={[0.076, 0.076]} />
      <meshStandardMaterial map={map} roughness={0.9} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-1} />
    </mesh>
  );
}

function Paper({ pos, seed }: { pos: Vec3; seed: number }) {
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 420;
    c.height = 594;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, 420, 594);
    ctx.fillStyle = 'rgba(40,40,60,0.35)';
    const r = rng(seed + 20);
    for (let y = 70; y < 540; y += 26) ctx.fillRect(40, y, 120 + r() * 240, 5);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [seed]);
  const r = rng(seed + 31);
  return (
    <mesh position={[pos[0], 0.0006 + seed * 0.0004, pos[2]]} rotation={[-Math.PI / 2, 0, (r() - 0.5) * 1.2]} receiveShadow>
      <planeGeometry args={[0.21, 0.297]} />
      <meshStandardMaterial map={map} roughness={0.95} />
    </mesh>
  );
}

/** Koffiekringen: altijd aanwezig, voor de geleefde look. */
function CoffeeRings() {
  const { layout } = useView();
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const r = rng(2);
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(120,80,40,${0.25 + r() * 0.2})`;
      ctx.lineWidth = 2 + r() * 4;
      ctx.beginPath();
      ctx.arc(128 + (r() - 0.5) * 6, 128 + (r() - 0.5) * 6, 100 - i * 3, r() * 2, r() * 2 + 4.5 + r());
      ctx.stroke();
    }
    return new THREE.CanvasTexture(c);
  }, []);
  const [x, , z] = layout.mug.pos;
  return (
    <>
      {([[x - 0.07, z + 0.06], [x + 0.06, z - 0.08]] as [number, number][]).map(([px, pz], i) => (
        <mesh key={i} position={[px, 0.0003, pz]} rotation={[-Math.PI / 2, 0, i * 2]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshStandardMaterial map={map} transparent roughness={0.6} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

/** Pootafdrukken van je kat, schuin over de case. */
function PawPrints({ show }: { show: boolean }) {
  const { portrait } = useView();
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgba(205,195,180,0.75)';
    ctx.beginPath();
    ctx.ellipse(64, 80, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const [x, y] of [[30, 42], [52, 28], [76, 28], [98, 42]] as [number, number][]) {
      ctx.beginPath();
      ctx.ellipse(x, y, 10, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }, []);
  const steps = useMemo(() => {
    const out: { pos: Vec3; rot: number }[] = [];
    const [sx, sz, ex, ez] = portrait ? [0.25, 0.32, -0.22, -0.02] : [0.62, 0.3, -0.12, 0.02];
    const n = 9;
    const angle = Math.atan2(ex - sx, ez - sz);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const side = i % 2 ? 1 : -1;
      out.push({
        pos: [sx + (ex - sx) * t + Math.cos(angle) * 0.02 * side, 0.0004, sz + (ez - sz) * t - Math.sin(angle) * 0.02 * side],
        rot: angle + Math.PI,
      });
    }
    return out;
  }, [portrait]);
  const mats = useMemo(
    () => steps.map(() => new THREE.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: 0.9, opacity: 0 })),
    [steps, map],
  );
  const since = useRef(0);
  useFrame((_, dt) => {
    since.current = show ? since.current + dt : 0;
    mats.forEach((m, i) => {
      // Elke stap 0,12 s na de vorige; verdwijnen gaat in één keer
      const goal = show && (prefersReducedMotion() || since.current > i * 0.12) ? 1 : 0;
      m.opacity = THREE.MathUtils.lerp(m.opacity, goal, show ? 0.25 : 0.12);
    });
  });
  return (
    <>
      {steps.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[-Math.PI / 2, 0, s.rot]} material={mats[i]!}>
          <planeGeometry args={[0.035, 0.035]} />
        </mesh>
      ))}
    </>
  );
}

/** Twee gekleurde podiumspots die over de tafel zwaaien. */
function StageSpots({ show }: { show: boolean }) {
  const a = useRef<THREE.SpotLight>(null);
  const b = useRef<THREE.SpotLight>(null);
  const ta = useMemo(() => new THREE.Object3D(), []);
  const tb = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const t = prefersReducedMotion() ? 0 : clock.elapsedTime;
    ta.position.set(Math.sin(t * 0.9) * 0.4, 0, Math.cos(t * 0.7) * 0.15);
    tb.position.set(Math.sin(t * 0.6 + 2) * 0.4, 0, Math.cos(t * 1.1 + 1) * 0.15);
    for (const l of [a.current, b.current]) if (l) l.intensity = THREE.MathUtils.lerp(l.intensity, show ? 14 : 0, 0.06);
  });
  return (
    <>
      <primitive object={ta} />
      <primitive object={tb} />
      <spotLight ref={a} target={ta} position={[-0.6, 1.1, -0.6]} color="#5fe4ff" intensity={0} angle={0.22} penumbra={0.6} decay={2} />
      <spotLight ref={b} target={tb} position={[0.6, 1.1, -0.6]} color="#ff5fa8" intensity={0} angle={0.22} penumbra={0.6} decay={2} />
    </>
  );
}

/** Ochtendlicht door een raam: een spot die het silhouet van een raamkozijn op de tafel projecteert. */
function WindowLight({ show }: { show: boolean }) {
  const light = useRef<THREE.SpotLight>(null);
  const frames = useRef(0);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    l.intensity = THREE.MathUtils.lerp(l.intensity, show ? 30 : 0, 0.05);
    // Schaduwkaart enkel bijwerken als het licht aan is. De eerste frames altijd: zonder kaart
    // weigert de grafische kaart elk object te tekenen.
    l.shadow.autoUpdate = l.intensity > 0.05 || frames.current++ < 3;
  });
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0.05, 0, -0.05);
    return o;
  }, []);
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#fff';
    // Vier ruiten met een kruis ertussen
    for (const [x, y] of [[40, 40], [136, 40], [40, 136], [136, 136]] as [number, number][]) ctx.fillRect(x, y, 80, 80);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={light}
        target={target}
        position={[-1.1, 1.0, -0.2]}
        color="#ffe7c2"
        intensity={0}
        angle={0.5}
        penumbra={0.25}
        decay={2}
        map={map}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </>
  );
}
