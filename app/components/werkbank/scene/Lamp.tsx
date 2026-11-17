'use client';
// Een warme bureaulamp. Met een muis volgt hij je cursor; tik je op de tafel, dan gaat het licht daarheen.
// Doet niemand iets (of is er geen muis), dan dwaalt hij traag over de tafel.
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneConfig } from './config';
import { useView } from './useView';
import { prefersReducedMotion } from '../hero/capabilities';
import { chatStore } from '@/app/components/ask-maarten/store';
import { bassLevel } from '../audio/player';

const IDLE_AFTER = 4; // seconden zonder input voor de lamp zelf gaat dwalen

/** power: 0 = uit (tijdens het laden), 1 = aan. De lamp floept zacht aan bij de onthulling. */
export function Lamp({ scene, power = 1 }: { scene: SceneConfig; power?: number }) {
  const { camera, gl, scene: three } = useThree();
  const { portrait, camera: cfg, layout } = useView();
  const spot = useRef<THREE.SpotLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const goal = useRef(new THREE.Vector3(0, 0, 0));
  const lastInput = useRef(-Infinity);
  const color = useMemo(() => new THREE.Color(), []);

  // Scherm-positie omzetten naar een punt op de tafel
  useEffect(() => {
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const aim = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        goal.current.copy(hit);
        lastInput.current = performance.now() / 1000;
      }
    };
    const onMove = (e: PointerEvent) => e.pointerType === 'mouse' && aim(e);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', aim); // tik op gsm
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', aim);
    };
  }, [camera, gl]);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (chatStore.get().open) {
      // Tijdens de chat schijnt de lamp op de laptop
      goal.current.set(layout.laptop.pos[0], 0, layout.laptop.pos[2] + 0.12);
    } else if (!prefersReducedMotion() && performance.now() / 1000 - lastInput.current > IDLE_AFTER) {
      // Traag dwalen rond het midden van de tafel (een lus die nooit precies herhaalt)
      const [fx, , fz] = cfg.focus;
      const ax = portrait ? 0.14 : 0.3;
      goal.current.set(fx + Math.sin(t * 0.21) * ax, 0, fz + Math.sin(t * 0.33 + 1) * 0.14);
    }
    const k = 1 - Math.pow(0.04, dt); // zacht naijlen
    target.position.lerp(goal.current, k);
    if (spot.current) {
      spot.current.position.set(target.position.x - 0.2, 0.8, target.position.z + 0.12);
      spot.current.color.lerp(color.set(scene.lamp.color), k);
      // Speelt de plaat, dan ademt de lamp een beetje mee op de bas
      const beat = prefersReducedMotion() ? 0 : bassLevel() * 0.22;
      spot.current.intensity = THREE.MathUtils.lerp(spot.current.intensity, scene.lamp.intensity * power * (1 + beat), k * 0.6);
    }
    if (hemi.current) hemi.current.intensity = THREE.MathUtils.lerp(hemi.current.intensity, scene.ambient, k);
    // Ook de reflecties dimmen mee, anders blijft de tafel 's nachts te licht
    three.environmentIntensity = THREE.MathUtils.lerp(three.environmentIntensity, 0.03 + scene.ambient * 0.7, k);
  });

  const mapSize = portrait ? 1024 : 2048; // lichtere schaduwen op gsm
  return (
    <>
      <primitive object={target} />
      <spotLight
        key={mapSize}
        ref={spot}
        target={target}
        angle={0.42}
        penumbra={0.85}
        decay={2}
        intensity={0}
        castShadow
        shadow-mapSize={[mapSize, mapSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.01}
        shadow-camera-near={0.2}
        shadow-camera-far={2}
      />
      <hemisphereLight ref={hemi} args={['#c9c3ff', '#1a1410', scene.ambient]} />
    </>
  );
}
