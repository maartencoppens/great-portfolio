'use client';
// De geoptimaliseerde GLB-modellen. Ze staan al op echte grootte (meter) met de onderkant op y = 0.
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RECORDS, SCENES, SCENE_KEYS, type SceneConfig, type SceneKey } from './config';
import { useView } from './useView';
import { prefersReducedMotion } from '../hero/capabilities';
import { openChat } from '@/app/components/ask-maarten/store';
import { OBJECT_PROMPTS } from '@/app/components/ask-maarten/prompts';

/** Het scherm-mesh van de laptop, zodat de camera erop kan inzoomen. */
export const laptopScreen: { current: THREE.Mesh | null } = { current: null };

const setHover = (on: boolean, label = '') => {
  hover.object = on;
  cursorLabel.text = on ? label : '';
  document.body.style.cursor = on ? 'pointer' : '';
};

/** Registreert een object voor zijn hotspot-puntje (offset in lokale coördinaten). */
export function useHotspot(id: HotspotId, ref: { current: THREE.Object3D | null }, offset: [number, number, number]) {
  useEffect(() => {
    const obj = ref.current;
    hotspots[id].obj = obj;
    hotspots[id].offset = offset;
    return () => {
      // Alleen wissen als het nog van ons is: in dev bouwt React alles twee keer op, en dan
      // ruimt de eerste versie soms pas op nadat de tweede zich al registreerde
      if (hotspots[id].obj === obj) hotspots[id].obj = null;
    };
  }, [id, ref, offset[0], offset[1], offset[2]]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Maakt een object klikbaar: opent de chat met een vraag (of doet iets anders via onActivate),
 * toont een handje en een label bij de cursor.
 */
export const clickable = (question?: string, label?: string, onActivate?: () => void) => ({
  onClick: (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    hotspotsSeen.mark();
    if (onActivate) onActivate();
    else openChat(question);
  },
  onPointerOver: (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHover(true, label ?? (question ? `Ask: ${question}` : 'Talk to Ask Maarten'));
  },
  onPointerOut: () => setHover(false),
});
import { cursorLabel, hotspots, hotspotsSeen, hover, screenTargets, type HotspotId } from './screenState';
import { isPlaying, togglePinkTies, useNowPlaying } from '../audio/player';
import { vinylTexture } from './textures';

const draco = new DRACOLoader().setDecoderPath('/werkbank/draco/');
// Alle platen die op de draaitafel kunnen liggen alvast laden, zodat wisselen niet hapert
// (per URL apart: een lijst wordt als één geheel bewaard, en dan zou wisselen alsnog even alles verbergen)
useLoader.preload(THREE.TextureLoader, RECORDS.playing);
useLoader.preload(THREE.TextureLoader, '/werkbank/platen/pink-ties.webp');

function useModel(url: string) {
  const gltf = useLoader(GLTFLoader, url, (loader) => loader.setDRACOLoader(draco));
  return useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return scene;
  }, [gltf]);
}

/** Zoekt de mesh met een emissive textuur: dat is bij de laptop en de Quad Cortex het scherm. */
function findScreen(root: THREE.Object3D) {
  let screen: THREE.Mesh | undefined;
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    // userData.isScreen: na darkScreen heeft het scherm geen emissive textuur meer. Zonder deze vlag
    // vond een tweede zoekbeurt (in dev bouwt React alles twee keer op) het scherm niet meer terug
    if (m.isMesh && (m.userData.isScreen || (m.material as THREE.MeshStandardMaterial).emissiveMap)) screen = m;
  });
  return screen;
}

/** Het 3D-scherm wordt een effen donker vlak; de HTML-versie ligt er exact bovenop. */
function darkScreen(mesh: THREE.Mesh, color: string) {
  const old = mesh.material as THREE.MeshStandardMaterial;
  mesh.material = new THREE.MeshBasicMaterial({ color, side: old.side, toneMapped: false });
  mesh.userData.isScreen = true;
}

export function Laptop() {
  const model = useModel('/werkbank/models/macbook.glb');

  useEffect(() => {
    const mesh = findScreen(model);
    if (mesh) darkScreen(mesh, '#0e0c12');
    laptopScreen.current = mesh ?? null;
    Object.assign(screenTargets.laptop, { root: model, mesh: mesh ?? null, corners: null });
    return () => {
      laptopScreen.current = null;
      if (screenTargets.laptop.root === model) Object.assign(screenTargets.laptop, { root: null, mesh: null, corners: null });
    };
  }, [model]);

  const { pos, rotY } = useView().layout.laptop;
  return <primitive object={model} position={pos} rotation-y={rotY} {...clickable(undefined, 'Talk to Ask Maarten')} />;
}

// Klikvlakken voor de voetschakelaars A–H, in het assenstelsel van het model (gemeten op de
// bovenaanzicht-foto). x = van achter (scherm) naar voor, z = van links (A) naar rechts (D).
// Ze bedekken samen het hele voetschakelaar-gebied, zodat je nooit "ernaast" klikt.
const DEBUG_HITS = typeof location !== 'undefined' && location.search.includes('debughits');
const SWITCH_ROWS = [
  { x: 0.0395, depth: 0.047 },
  { x: 0.083, depth: 0.04 },
];
const SWITCH_COLS = [
  { z: 0.1205, width: 0.049 },
  { z: 0.0643, width: 0.0645 },
  { z: 0.0003, width: 0.0635 },
  { z: -0.0633, width: 0.0635 },
];

/** Welke voetschakelaar ligt op dit punt (in model-coördinaten)? null = niet in het voetschakelaar-gebied. */
function switchAt(p: THREE.Vector3): SceneKey | null {
  if (p.x < 0.016) return null; // achterste deel: scherm en volumeknop
  const row = p.x < 0.063 ? 0 : 1;
  const col = p.z > 0.0965 ? 0 : p.z > 0.032 ? 1 : p.z > -0.0315 ? 2 : p.z > -0.095 ? 3 : -1;
  return col < 0 ? null : SCENE_KEYS[row * 4 + col] ?? null;
}

export function QuadCortex({ onSelect }: { onSelect: (k: SceneKey) => void }) {
  const model = useModel('/werkbank/models/quad-cortex.glb');
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    const mesh = findScreen(model);
    if (mesh) darkScreen(mesh, '#050505');
    Object.assign(screenTargets.qc, { root: model, mesh: mesh ?? null, corners: null });
    return () => {
      if (screenTargets.qc.root === model) Object.assign(screenTargets.qc, { root: null, mesh: null, corners: null });
    };
  }, [model]);

  const { pos, rotY } = useView().layout.quadCortex;
  useHotspot('qc', group, [-0.07, 0.056, -0.055]); // rechtsboven op het scherm, niet op een voetschakelaar
  return (
    <group ref={group} position={pos} rotation-y={rotY}>
      <primitive
        object={model}
        {...clickable(OBJECT_PROMPTS.quadCortex)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          // Raak je een knop zelf (die steekt boven de klikvlakken uit), dan telt dat ook als voetschakelaar
          e.stopPropagation();
          hotspotsSeen.mark();
          const k = switchAt(group.current!.worldToLocal(e.point.clone()));
          if (k) onSelect(k);
          else openChat(OBJECT_PROMPTS.quadCortex);
        }}
      />
      {SCENE_KEYS.map((k, i) => {
        const row = SWITCH_ROWS[Math.floor(i / 4)]!;
        const col = SWITCH_COLS[i % 4]!;
        return (
          <mesh
            key={k}
            position={[row.x, 0.038, col.z]}
            onClick={(e) => {
              e.stopPropagation();
              hotspotsSeen.mark();
              onSelect(k);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHover(true, `Mood ${k} · ${SCENES[k].naam}`);
            }}
            onPointerOut={() => setHover(false)}
          >
            {/* Even hoog als de voetschakelaars zelf (tot ~5 cm). Een hoger blok valt in schuin
                perspectief over de rij erachter, waardoor je de verkeerde scene raakt. */}
            <boxGeometry args={[row.depth, 0.026, col.width]} />
            {/* ?debughits in de URL maakt de klikvlakken zichtbaar */}
            <meshBasicMaterial transparent opacity={DEBUG_HITS ? 0.45 : 0} color={i < 4 ? '#ff3366' : '#33ccff'} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Palley({ scene }: { scene: SceneConfig }) {
  const model = useModel('/werkbank/models/palley.glb');
  const { pos, rotY, scale } = useView().layout.palley;
  const tip = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  useHotspot('palley', root, [0, 0.045, 0]);
  useFrame((_, dt) => {
    const g = tip.current;
    if (!g) return;
    const goal = scene.props.palleyOmver ? Math.PI / 2 : 0;
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, goal, prefersReducedMotion() ? 1 : 1 - Math.pow(0.02, dt));
    g.position.y = Math.sin(g.rotation.z) * 0.013;
  });
  return (
    <group ref={root} position={pos} rotation-y={rotY} scale={scale} {...clickable(OBJECT_PROMPTS.palley)}>
      {/* Kat-scene: de palley rolt op zijn kant */}
      <group ref={tip}>
        <primitive object={model} />
      </group>
      {/* Sleutelring */}
      <mesh position={[0.026, 0.0014, 0.004]} rotation-x={Math.PI / 2} castShadow>
        <torusGeometry args={[0.011, 0.0013, 12, 48]} />
        <meshStandardMaterial color="#cfd2d6" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Platenspeler met een draaiende plaat (33⅓ toeren per minuut). */
export function Turntable({ scene }: { scene: SceneConfig }) {
  const placement = useView().layout.turntable;
  return placement ? <TurntableModel scene={scene} pos={placement.pos} rotY={placement.rotY} /> : null;
}

function TurntableModel({ scene, pos, rotY }: { scene: SceneConfig; pos: [number, number, number]; rotY: number }) {
  const model = useModel('/werkbank/models/platenspeler.glb');
  const root = useRef<THREE.Group>(null);
  const vinyl = useRef<THREE.Group>(null);
  const speed = useRef(0);
  const grooves = useMemo(vinylTexture, []);
  const { playing } = useNowPlaying();
  // Speelt de opname, dan ligt de Pink Ties-plaat op
  const label = useLoader(THREE.TextureLoader, playing ? '/werkbank/platen/pink-ties.webp' : (scene.props.plaat ?? RECORDS.playing));
  label.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    const spin = (scene.record || isPlaying()) && !prefersReducedMotion();
    const goal = spin ? (33.333 / 60) * Math.PI * 2 : 0;
    speed.current = THREE.MathUtils.lerp(speed.current, goal, 1 - Math.pow(0.15, dt)); // optrekken en uitbollen
    if (vinyl.current) vinyl.current.rotation.y -= speed.current * dt;
  });

  // Midden en hoogte van de draaitafel in het model (gemeten uit de GLB)
  const platter = { x: -0.043, y: 0.1115, z: 0 };
  useHotspot('turntable', root, [platter.x, 0.13, platter.z]);
  return (
    <group
      ref={root}
      position={pos}
      rotation-y={rotY}
      {...clickable(undefined, playing ? '■ Stop the record' : '▶ Play Pink Ties live', () => togglePinkTies())}
    >
      <primitive object={model} />
      <group ref={vinyl} position={[platter.x, platter.y, platter.z]}>
        <mesh rotation-x={-Math.PI / 2} position-y={0.0006} receiveShadow castShadow>
          <circleGeometry args={[0.1524, 128]} />
          <meshStandardMaterial map={grooves} roughness={0.32} metalness={0.2} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.0009} receiveShadow>
          <circleGeometry args={[0.05, 64]} />
          <meshStandardMaterial map={label} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
