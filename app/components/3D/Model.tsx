import { useRef, useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { useThree } from "@react-three/fiber";

const PARTICLE_COUNT = 18000;
const HOLD_DURATION = 3.0;
const MORPH_DURATION = 1.8;
const RING_RADIUS = 0.35;
const INFLUENCE_RADIUS = 0.4;
const HOVER_STRENGTH = 0.7;
const MOUSE_OFFSCREEN = 9999;

const MODELS = [
  "/models/skateboard.glb",
  "/models/drums.glb",
  "/models/headphones.glb",
  "/models/bass.glb",
] as const;

function toParticles(scene: THREE.Group, count: number): Float32Array {
  scene.updateWorldMatrix(true, true);
  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) meshes.push(child);
  });
  if (meshes.length === 0) return new Float32Array(count * 3);

  const raw: number[] = [];
  const tempPosition = new THREE.Vector3();
  const samplesPerMesh = Math.ceil(count / meshes.length);
  for (const mesh of meshes) {
    const sampler = new MeshSurfaceSampler(mesh).build();
    for (let i = 0; i < samplesPerMesh && raw.length / 3 < count; i++) {
      sampler.sample(tempPosition);
      tempPosition.applyMatrix4(mesh.matrixWorld);
      raw.push(tempPosition.x, tempPosition.y, tempPosition.z);
    }
  }

  const n = raw.length / 3;
  if (n === 0) return new Float32Array(count * 3);

  let cx = 0,
    cy = 0,
    cz = 0;
  for (let i = 0; i < raw.length; i += 3) {
    cx += raw[i] ?? 0;
    cy += raw[i + 1] ?? 0;
    cz += raw[i + 2] ?? 0;
  }
  cx /= n;
  cy /= n;
  cz /= n;

  let maxDist = 0;
  for (let i = 0; i < raw.length; i += 3)
    maxDist = Math.max(
      maxDist,
      Math.hypot(
        (raw[i] ?? 0) - cx,
        (raw[i + 1] ?? 0) - cy,
        (raw[i + 2] ?? 0) - cz,
      ),
    );
  const safeMaxDist = maxDist || 1;

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = ((raw[i * 3] ?? 0) - cx) / safeMaxDist;
    out[i * 3 + 1] = ((raw[i * 3 + 1] ?? 0) - cy) / safeMaxDist;
    out[i * 3 + 2] = ((raw[i * 3 + 2] ?? 0) - cz) / safeMaxDist;
  }
  return out;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

function applyRingEffect(
  baseX: number,
  baseY: number,
  baseZ: number,
  mouseX: number,
  mouseY: number,
): [number, number, number] {
  const dx = baseX - mouseX;
  const dy = baseY - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist >= INFLUENCE_RADIUS) return [baseX, baseY, baseZ];

  const safeDist = Math.max(dist, 0.0001);
  const ringX = mouseX + (dx / safeDist) * RING_RADIUS;
  const ringY = mouseY + (dy / safeDist) * RING_RADIUS;
  const force = Math.pow(1 - dist / INFLUENCE_RADIUS, 2) * HOVER_STRENGTH;

  return [
    baseX + (ringX - baseX) * force,
    baseY + (ringY - baseY) * force,
    baseZ,
  ];
}

const Model = () => {
  const { viewport, gl } = useThree();
  const [skateboardModel, drumsModel, headphonesModel, bassModel] = MODELS;
  const pointsRef = useRef<THREE.Points>(null);
  const mouseWorld = useRef({ x: MOUSE_OFFSCREEN, y: MOUSE_OFFSCREEN });
  const state = useRef({
    current: 0,
    phase: "hold" as "hold" | "morph",
    timer: 0,
  });

  const skateboardScene = useGLTF(skateboardModel).scene;
  const drumsScene = useGLTF(drumsModel).scene;
  const headphonesScene = useGLTF(headphonesModel).scene;
  const bassScene = useGLTF(bassModel).scene;

  const shapes = useMemo(
    () =>
      [skateboardScene, drumsScene, headphonesScene, bassScene].map((scene) =>
        toParticles(scene, PARTICLE_COUNT),
      ),
    [skateboardScene, drumsScene, headphonesScene, bassScene],
  );

  const fallbackShape = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const initialShape = shapes[0] ?? fallbackShape;
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(initialShape.slice(), 3),
    );
    return geo;
  }, [shapes, fallbackShape]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseWorld.current.x = nx * viewport.width * 0.25;
      mouseWorld.current.y = -ny * viewport.height * 0.25;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [viewport, gl]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const s = state.current;
    const pos = pointsRef.current.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (!pos) return;
    const from = shapes[s.current] ?? fallbackShape;
    const next = (s.current + 1) % shapes.length;
    const to = shapes[next] ?? fallbackShape;
    const { x: mouseX, y: mouseY } = mouseWorld.current;

    s.timer += delta;

    if (s.phase === "hold") {
      const t = performance.now() * 0.001;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const o = i * 0.0003;
        const fromX = from[i * 3] ?? 0;
        const fromY = from[i * 3 + 1] ?? 0;
        const fromZ = from[i * 3 + 2] ?? 0;
        const [x, y, z] = applyRingEffect(
          fromX + Math.sin(t * 0.4 + o * 13) * 0.008,
          fromY + Math.cos(t * 0.3 + o * 17) * 0.008,
          fromZ + Math.sin(t * 0.5 + o * 11) * 0.008,
          mouseX,
          mouseY,
        );
        pos.setXYZ(i, x, y, z);
      }
      if (s.timer >= HOLD_DURATION) {
        s.phase = "morph";
        s.timer = 0;
      }
    } else {
      const p = easeInOut(Math.min(s.timer / MORPH_DURATION, 1));
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const fromX = from[i * 3] ?? 0;
        const fromY = from[i * 3 + 1] ?? 0;
        const fromZ = from[i * 3 + 2] ?? 0;
        const toX = to[i * 3] ?? 0;
        const toY = to[i * 3 + 1] ?? 0;
        const toZ = to[i * 3 + 2] ?? 0;
        const [x, y, z] = applyRingEffect(
          fromX + (toX - fromX) * p,
          fromY + (toY - fromY) * p,
          fromZ + (toZ - fromZ) * p,
          mouseX,
          mouseY,
        );
        pos.setXYZ(i, x, y, z);
      }
      if (s.timer >= MORPH_DURATION) {
        s.current = next;
        s.phase = "hold";
        s.timer = 0;
      }
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} scale={2}>
      <pointsMaterial
        color="#9810fa"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
};

MODELS.forEach((url) => useGLTF.preload(url));
export default Model;
