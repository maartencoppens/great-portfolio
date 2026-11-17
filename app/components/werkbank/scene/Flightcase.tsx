'use client';
// De flightcase als tafel: een brede kist waarvan je het blad en de voorkant ziet.
// Achter de case is niets: daar komt de grote typografie (HTML) door het transparante canvas heen.
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CASE, RAIL, COLORS } from './config';
import { useView } from './useView';
import { prefersReducedMotion } from '../hero/capabilities';
import { chatStore, useChat } from '@/app/components/ask-maarten/store';
import { laptopScreen } from './Models';
import { hover } from './screenState';
import { brushedTexture, laminateTextures } from './textures';

/** Kantelhoek van het laptopscherm: de normaal staat iets naar boven (deksel ~20° achterover). */
const SCREEN_NORMAL = new THREE.Vector3(0, 0.347, 0.938).normalize();
/** Afstand tot het scherm bij inzoomen: het scherm vult dan ongeveer 60% van de hoogte. */
const ZOOM_DISTANCE = 0.6;

/**
 * Camera schuin van voren, met een klein beetje parallax op de muis.
 * Is de chat open (desktop), dan zoomt hij in tot recht voor het laptopscherm.
 */
export function CameraRig() {
  const { camera, size } = useThree();
  const { camera: cfg, portrait } = useView();
  const { open } = useChat();
  const mouse = useRef(new THREE.Vector2());
  const look = useRef(new THREE.Vector3(...cfg.focus));
  const settled = useRef(0);
  const tmp = useMemo(() => ({ goal: new THREE.Vector3(), target: new THREE.Vector3(), box: new THREE.Box3(), v: new THREE.Vector3() }), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // Boven iets klikbaars bevriest de parallax: anders schuift je doel weg terwijl je mikt
      if (e.pointerType === 'mouse' && !prefersReducedMotion() && !hover.active) mouse.current.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    settled.current = 0; // opnieuw meten na openen/sluiten of een resize
  }, [open, size.width, size.height]);

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const zoom = open && !portrait && laptopScreen.current;
    const { goal, target, box } = tmp;

    if (zoom) {
      box.setFromObject(laptopScreen.current!);
      box.getCenter(target);
      goal.copy(target).addScaledVector(SCREEN_NORMAL, ZOOM_DISTANCE);
    } else {
      const [fx, fy, fz] = cfg.focus;
      const el = THREE.MathUtils.degToRad(cfg.elevation);
      target.set(fx, fy + cfg.frameY, fz);
      goal.set(
        fx + mouse.current.x * cfg.parallax,
        fy + Math.sin(el) * cfg.distance - mouse.current.y * cfg.parallax * 0.5,
        fz + Math.cos(el) * cfg.distance,
      );
    }

    const k = prefersReducedMotion() ? 1 : 1 - Math.pow(zoom ? 0.004 : 0.02, dt);
    cam.position.lerp(goal, k);
    look.current.lerp(target, k);
    cam.lookAt(look.current);
    if (cam.fov !== cfg.fov) {
      cam.fov = cfg.fov;
      cam.near = 0.05;
      cam.far = 10;
      cam.updateProjectionMatrix();
    }

    // Ingezoomd en tot rust gekomen: vertel de HTML-chat waar het scherm staat
    if (zoom && cam.position.distanceTo(goal) < 0.002 && settled.current++ === 2) {
      cam.updateMatrixWorld();
      // Alle hoekpunten van het scherm projecteren (exacter dan de bounding box van een schuin vlak)
      const mesh = laptopScreen.current!;
      const pos = mesh.geometry.attributes.position!;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < pos.count; i++) {
        const c = tmp.v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld).project(cam);
        const sx = ((c.x + 1) / 2) * size.width, sy = ((1 - c.y) / 2) * size.height;
        minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
      }
      // Een paar pixels binnen de rand, zodat de rand van het echte scherm zichtbaar blijft
      chatStore.set({ rect: { left: minX + 6, top: minY + 6, width: maxX - minX - 12, height: maxY - minY - 12 } });
    }
  });
  return null;
}

export function Flightcase() {
  const { bump } = useMemo(laminateTextures, []);
  const brushed = useMemo(brushedTexture, []);
  const front = CASE.back + CASE.d;

  const laminate = useMemo(() => {
    const t = bump.clone();
    t.repeat.set(CASE.w * 3, CASE.d * 3);
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ color: COLORS.laminate, roughness: 0.78, metalness: 0.05, bumpMap: t, bumpScale: 0.6 });
  }, [bump]);
  const laminateFront = useMemo(() => {
    const t = bump.clone();
    t.repeat.set(CASE.w * 3, CASE.h * 3);
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ color: COLORS.laminate, roughness: 0.8, metalness: 0.05, bumpMap: t, bumpScale: 0.6 });
  }, [bump]);
  const railMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b9bcc2', metalness: 1, roughness: 0.3, bumpMap: brushed, bumpScale: 0.4 }),
    [brushed],
  );
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4d6da', metalness: 1, roughness: 0.18 }), []);

  return (
    <group>
      {/* Blad */}
      <mesh position={[0, 0, CASE.back + CASE.d / 2]} rotation-x={-Math.PI / 2} material={laminate} receiveShadow>
        <planeGeometry args={[CASE.w, CASE.d]} />
      </mesh>
      {/* Voorkant */}
      <mesh position={[0, -CASE.h / 2, front]} material={laminateFront} receiveShadow>
        <planeGeometry args={[CASE.w, CASE.h]} />
      </mesh>

      {/* Aluminium hoekprofiel langs de voorrand (bovenop en aan de voorkant) */}
      <mesh position={[0, 0.003, front - RAIL / 2]} material={railMat} receiveShadow castShadow>
        <boxGeometry args={[CASE.w, 0.006, RAIL]} />
      </mesh>
      <mesh position={[0, -RAIL / 2, front + 0.003]} material={railMat} receiveShadow>
        <boxGeometry args={[CASE.w, RAIL, 0.006]} />
      </mesh>
      {/* Hetzelfde profiel achteraan */}
      <mesh position={[0, 0.003, CASE.back + RAIL / 2]} material={railMat} receiveShadow castShadow>
        <boxGeometry args={[CASE.w, 0.006, RAIL]} />
      </mesh>

      {/* Naad tussen deksel en kist, met twee vlindersluitingen */}
      <mesh position={[0, -0.085, front + 0.004]} material={railMat} receiveShadow>
        <boxGeometry args={[CASE.w, 0.024, 0.008]} />
      </mesh>
      {[-0.32, 0.32].map((x) => (
        <group key={x} position={[x, -0.085, front + 0.009]}>
          <mesh material={chrome} castShadow>
            <boxGeometry args={[0.07, 0.065, 0.004]} />
          </mesh>
          <mesh position={[0, -0.006, 0.006]} rotation-x={Math.PI / 2} material={chrome} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.006, 32]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
