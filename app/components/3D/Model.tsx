import { useRef, useMemo, useEffect, useLayoutEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { usePageReady } from "@/app/lib/pageReady";

const PARTICLE_COUNT = 18000;
const HOLD_DURATION = 3.0;
const MORPH_DURATION = 1.8;
const RING_RADIUS = 0.35;
const INFLUENCE_RADIUS = 0.4;
const HOVER_STRENGTH = 0.7;
const MOUSE_OFFSCREEN = 9999;

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

  const { setModelReady } = usePageReady();
  useLayoutEffect(() => {
    setModelReady(false);
  }, [setModelReady]);

  const pointsRef = useRef<THREE.Points>(null);
  const mouseWorld = useRef({ x: MOUSE_OFFSCREEN, y: MOUSE_OFFSCREEN });
  const state = useRef({
    current: 0,
    phase: "hold" as "hold" | "morph",
    timer: 0,
  });

  const [shapes, setShapes] = useState<Float32Array[] | null>(null);

  useEffect(() => {
    fetch("/particles.bin")
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const i16 = new Int16Array(buf);
        const size = PARTICLE_COUNT * 3;
        setShapes(
          [0, 1, 2, 3].map((k) =>
            Float32Array.from(
              i16.subarray(k * size, (k + 1) * size),
              (v) => v / 32767,
            ),
          ),
        );
      })
      .catch((err) => {
        console.error("Failed to load particles", err);
        setModelReady(true);
      });
  }, []);

  const fallbackShape = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const initialShape = shapes?.[0] ?? fallbackShape;
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
    if (!shapes) return;
    setModelReady(true);
  }, [geometry, shapes, setModelReady]);

  useEffect(() => {
    // Skip mouse effect on touchscreens
    if (window.matchMedia("(pointer: coarse)").matches) return;

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
    if (!shapes) return;
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

  if (!shapes) return null;

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

export default Model;
