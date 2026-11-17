'use client';
// Kleinere objecten die we zelf opbouwen: setlist, tape, koffie en kabel.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { CASE, COLORS, type SceneConfig, type Vec3 } from './config';
import { prefersReducedMotion } from '../hero/capabilities';
import { useView } from './useView';
import { clickable, useHotspot } from './Models';
import { bassLevel } from '../audio/player';
import { OBJECT_PROMPTS } from '@/app/components/ask-maarten/prompts';
import { rng, tapeTexture } from './textures';

/** Verkreukelde setlist, vastgeplakt met gaffertape. */
export function Setlist({ scene }: { scene: SceneConfig }) {
  const { layout, portrait } = useView();
  const placement = layout.setlist;
  const ref = useRef<THREE.Group>(null);
  useHotspot('setlist', ref, [0, 0.01, 0.06]);
  // Repetitie en Live: de setlist schuift naar voren, recht voor je
  const central = !!scene.props.setlistCentraal && !portrait;
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g || !placement) return;
    const [x, , z] = central ? [0.17, 0, 0.21] : placement.pos;
    const r = central ? -0.08 : placement.rotY;
    const k = prefersReducedMotion() ? 1 : 1 - Math.pow(0.03, dt);
    g.position.x = THREE.MathUtils.lerp(g.position.x, x, k);
    g.position.z = THREE.MathUtils.lerp(g.position.z, z, k);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, r, k);
  });
  if (!placement) return null;
  return (
    <group ref={ref} position={placement.pos} rotation-y={placement.rotY}>
      <SetlistPaper pos={[0, 0, 0]} rotY={0} />
    </group>
  );
}

function SetlistPaper({ pos, rotY }: { pos: Vec3; rotY: number }) {
  const map = useLoader(THREE.TextureLoader, '/werkbank/setlist.webp');
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const geometry = useMemo(() => {
    const w = 0.21, h = 0.297;
    const g = new THREE.PlaneGeometry(w, h, 60, 84);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position!;
    const rand = rng(21);
    // Een paar willekeurige kreukels + een horizontale en verticale vouw (in vieren gevouwen)
    const creases = Array.from({ length: 9 }, () => ({
      a: rand() * Math.PI, o: (rand() - 0.5) * 0.25, s: 0.0012 + rand() * 0.0018,
    }));
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      let y = 0.0016;
      y += Math.abs(z) < 0.004 ? 0.0012 : 0; // vouw
      y += 0.0018 * Math.exp(-Math.abs(x) * 60); // vouw
      for (const c of creases) {
        const d = x * Math.cos(c.a) + z * Math.sin(c.a) - c.o;
        y += c.s * Math.max(0, 1 - Math.abs(d) * 45);
      }
      // Hoeken krullen een beetje op, behalve waar de tape zit (boven)
      const corner = Math.max(0, Math.abs(x) / (w / 2) - 0.75) * Math.max(0, z / (h / 2) - 0.6);
      y += corner * 0.02;
      p.setY(i, y);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group position={pos} rotation-y={rotY} {...clickable(OBJECT_PROMPTS.setlist)}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial map={map} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <Tape position={[-0.09, 0.0035, -0.14]} rot={0.7} seed={4} />
      <Tape position={[0.09, 0.0035, -0.14]} rot={-0.6} seed={9} />
    </group>
  );
}

function Tape({ position, rot, seed }: { position: Vec3; rot: number; seed: number }) {
  const map = useMemo(() => tapeTexture(seed), [seed]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rot]} receiveShadow>
      <planeGeometry args={[0.075, 0.028]} />
      <meshStandardMaterial map={map} transparent roughness={0.95} />
    </mesh>
  );
}

/** Hoe vol de tas is volgens het uur in België: vol om 7 uur, bijna leeg rond 23 uur. */
function levelForNow() {
  const hour = Number(new Intl.DateTimeFormat('nl-BE', { hour: 'numeric', timeZone: 'Europe/Brussels' }).format(new Date()));
  const t = THREE.MathUtils.clamp((hour - 7) / 16, 0, 1);
  return THREE.MathUtils.lerp(0.08, 0.018, t);
}

const MUG_PROFILE = [
  [0.0, 0.0], [0.038, 0.0], [0.041, 0.004], [0.042, 0.09], [0.0425, 0.095],
  [0.039, 0.095], [0.0385, 0.008], [0.0, 0.008],
].map(([x, y]) => new THREE.Vector2(x, y));

/** De tas zelf. level = hoogte van de koffie (0 = leeg); verandert vloeiend. */
export function MugBody({ level, steam = false }: { level: number; steam?: boolean }) {
  const body = useMemo(() => new THREE.LatheGeometry(MUG_PROFILE, 64), []);
  const coffee = useRef<THREE.Mesh>(null);
  const current = useRef(level);
  useFrame((_, dt) => {
    current.current = THREE.MathUtils.lerp(current.current, level, 1 - Math.pow(0.05, dt));
    const c = coffee.current;
    if (!c) return;
    c.visible = current.current > 0.011;
    c.position.y = current.current;
  });
  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial color="#ece6da" roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={coffee} rotation-x={-Math.PI / 2} position-y={level}>
        <circleGeometry args={[0.0386, 48]} />
        <meshStandardMaterial color="#2a160b" roughness={0.12} />
      </mesh>
      {/* Oor: een halve torus als C-vorm, met beide uiteinden tegen de wand */}
      <mesh position={[0.041, 0.05, 0]} rotation-z={-Math.PI / 2} castShadow>
        <torusGeometry args={[0.024, 0.0065, 16, 40, Math.PI]} />
        <meshStandardMaterial color="#ece6da" roughness={0.35} />
      </mesh>
      <Steam top={0.1} on={steam && level > 0.01} />
    </group>
  );
}

/** Stoom: een paar zachte pluimen die opstijgen en vervagen. */
function Steam({ top, on }: { top: number; on: boolean }) {
  const strength = useRef(on ? 1 : 0);
  const map = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 64, 0, 32, 64, 30);
    g.addColorStop(0, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.scale(1, 2);
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  useFrame(({ clock }, dt) => {
    const still = prefersReducedMotion();
    strength.current = THREE.MathUtils.clamp(strength.current + (on ? dt : -dt) * 0.8, 0, 1);
    refs.current.forEach((s, i) => {
      if (!s) return;
      const t = still ? 0.4 : ((clock.elapsedTime * 0.35 + i / 3) % 1);
      s.position.set(Math.sin(t * 6 + i) * 0.008, top + t * 0.09, Math.cos(t * 5 + i) * 0.006);
      s.scale.set(0.03 + t * 0.03, 0.06 + t * 0.05, 1);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(t * Math.PI) * 0.35 * strength.current;
    });
  });
  return (
    <>
      {[0, 1, 2].map((i) => (
        <sprite key={i} ref={(el) => (refs.current[i] = el)}>
          <spriteMaterial map={map} transparent depthWrite={false} />
        </sprite>
      ))}
    </>
  );
}

/** De tas koffie op de tafel. Bij de kat-scene valt hij om en loopt er een plas uit. */
export function Mug({ scene }: { scene: SceneConfig }) {
  const { coffee, steam } = scene.props;
  const pos = useView().layout.mug.pos;
  const tipped = coffee === 'omver';
  const level = coffee === 'vol' ? 0.082 : coffee === 'leeg' || tipped ? 0 : levelForNow();
  const tilt = useRef<THREE.Group>(null);
  const spill = useRef<THREE.Mesh>(null);
  const root = useRef<THREE.Group>(null);
  useHotspot('mug', root, [0, 0.12, 0]);
  const t = useRef(tipped ? 1 : 0);
  useFrame((_, dt) => {
    const speed = prefersReducedMotion() ? 100 : tipped ? 2.4 : 1.6;
    t.current = THREE.MathUtils.clamp(t.current + (tipped ? dt : -dt) * speed, 0, 1);
    // Omvallen: versnellen zoals iets dat valt, met een kleine stuit op het einde
    const e = tipped ? Math.min(1, t.current * t.current * 1.15) : t.current;
    if (tilt.current) {
      tilt.current.rotation.z = (e * Math.PI) / 2;
      tilt.current.position.y = Math.sin((e * Math.PI) / 2) * 0.0425;
    }
    if (spill.current) {
      // De plas groeit pas na het omvallen
      const grow = tipped ? THREE.MathUtils.clamp((t.current - 0.6) / 0.4, 0, 1) : t.current;
      spill.current.scale.set(1.6 * grow + 0.0001, grow + 0.0001, 1);
      spill.current.visible = grow > 0.01;
    }
  });
  return (
    <group ref={root} position={pos} {...clickable(OBJECT_PROMPTS.mug)}>
      <group rotation-y={0.8}>
        <group ref={tilt}>
          <group rotation-y={-0.8}>
            <MugBody level={level} steam={!!steam && !tipped} />
          </group>
        </group>
      </group>
      <mesh ref={spill} rotation-x={-Math.PI / 2} position={[-0.11, 0.0005, 0.03]} visible={false}>
        <circleGeometry args={[0.05, 40]} />
        <meshStandardMaterial color="#160a03" roughness={0.18} metalness={0} envMapIntensity={0.3} transparent opacity={0.94} />
      </mesh>
    </group>
  );
}

/** De paarse kabel: uit de achterkant van de Quad Cortex, rond het toestel, over de voorrand naar beneden (naar jouw bas). */
export function Cable({ scene }: { scene: SceneConfig }) {
  const { layout, portrait } = useView();
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const anchor = useRef<THREE.Object3D>(null);
  useHotspot('cable', anchor, [0, 0.01, 0]);
  // Repetitie en Live: de kabel gloeit zacht. Speelt de plaat, dan pulseert hij op de bas.
  useFrame(({ clock }) => {
    if (!mat.current) return;
    const scene_ = scene.props.kabelGloeit ? 0.6 + Math.sin(clock.elapsedTime * 2.2) * (prefersReducedMotion() ? 0 : 0.25) : 0;
    const bass = bassLevel() * 1.6;
    const goal = Math.max(scene_, bass);
    mat.current.emissiveIntensity = THREE.MathUtils.lerp(mat.current.emissiveIntensity, goal, bass > scene_ ? 0.5 : 0.08);
  });
  const { tube, plug, plugQuat, mid } = useMemo(() => {
    const r = 0.0035;
    // Plaats van de input-jack in het assenstelsel van de Quad Cortex, omgezet naar de wereld
    const { pos, rotY } = layout.quadCortex;
    const local = (x: number, z: number, y = r) =>
      new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY).add(new THREE.Vector3(...pos));
    const front = CASE.back + CASE.d;
    const pts = [
      local(-0.105, 0.06),
      local(-0.15, 0.08),
      local(-0.17, 0.17),
      local(-0.08, 0.22),
      new THREE.Vector3(pos[0] - 0.13, r, front - 0.06),
      new THREE.Vector3(pos[0] - 0.07, 0.012, front + 0.004),
      new THREE.Vector3(pos[0] - 0.055, -0.05, front + 0.0045),
      new THREE.Vector3(pos[0] - 0.045, -0.6, front + 0.0045),
    ];
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const tube = new THREE.TubeGeometry(curve, 260, r, 12, false);
    const start = curve.getPointAt(0);
    const dir = curve.getTangentAt(0).negate();
    const plugQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return { tube, plug: start, plugQuat, mid: curve.getPointAt(0.35) };
  }, [layout, portrait]);

  return (
    <group {...clickable(OBJECT_PROMPTS.cable)}>
      <object3D ref={anchor} position={mid} />
      <mesh geometry={tube} castShadow receiveShadow>
        <meshStandardMaterial ref={mat} color={COLORS.accent} emissive={COLORS.accent} emissiveIntensity={0} roughness={0.42} />
      </mesh>
      {/* Jackplug: zwarte trekontlasting + metalen huls */}
      <group position={plug} quaternion={plugQuat}>
        <mesh position-y={0.012} castShadow>
          <cylinderGeometry args={[0.0042, 0.0038, 0.024, 20]} />
          <meshStandardMaterial color="#111" roughness={0.6} />
        </mesh>
        <mesh position-y={0.032} castShadow>
          <cylinderGeometry args={[0.0055, 0.0055, 0.018, 24]} />
          <meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.22} />
        </mesh>
      </group>
    </group>
  );
}
