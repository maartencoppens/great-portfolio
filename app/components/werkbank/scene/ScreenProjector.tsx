'use client';
// Legt elke frame de HTML-schermen exact op de 3D-schermen: we berekenen waar de vier hoeken
// van het scherm op je scherm vallen, en vervormen de HTML met een perspectief-transformatie (matrix3d).
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { hotspots, screenTargets, type Target } from './screenState';

/** Zoekt de vier hoeken van het scherm: de hoekpunten die het verst in elke richting liggen. */
function findCorners(t: Target) {
  if (!t.root || !t.mesh) return null;
  t.root.updateWorldMatrix(true, true);
  const toRoot = new THREE.Matrix4().copy(t.root.matrixWorld).invert().multiply(t.mesh.matrixWorld);
  const pos = t.mesh.geometry.attributes.position!;
  const best = [-Infinity, -Infinity, -Infinity, -Infinity];
  const out = [0, 1, 2, 3].map(() => new THREE.Vector3());
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyMatrix4(toRoot);
    const [u, r] = t.axes(v);
    const scores = [u - r, u + r, -u + r, -u - r]; // TL, TR, BR, BL
    scores.forEach((s, k) => {
      if (s > best[k]!) {
        best[k] = s;
        out[k]!.copy(v);
      }
    });
  }
  return out;
}

type P = { x: number; y: number };

/** Perspectief-transformatie die een rechthoek w×h op vier punten legt (Heckbert). */
function quadMatrix(w: number, h: number, p: { x: number; y: number }[]) {
  const [p0, p1, p2, p3] = p as [P, P, P, P]; // TL, TR, BR, BL
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y, dy2 = p3.y - p2.y, dy3 = p0.y - p1.y + p2.y - p3.y;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = p1.x - p0.x + g * p1.x, b = p3.x - p0.x + hh * p3.x, c = p0.x;
  const d = p1.y - p0.y + g * p1.y, e = p3.y - p0.y + hh * p3.y, f = p0.y;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${hh / h},0,0,1,0,${c},${f},0,1)`;
}

/** In het canvas: legt elke frame de HTML-schermen op hun plek. Moet ná de CameraRig staan. */
export function ScreenProjector() {
  const { camera, size } = useThree();
  const world = useRef(new THREE.Vector3());
  useFrame(() => {
    for (const t of Object.values(screenTargets)) {
      if (!t.el || !t.root || !t.mesh) continue;
      t.corners ??= findCorners(t);
      if (!t.corners) continue;
      let behind = false;
      const pts = t.corners.map((c) => {
        const v = world.current.copy(c).applyMatrix4(t.root!.matrixWorld).project(camera);
        if (v.z > 1) behind = true;
        return { x: ((v.x + 1) / 2) * size.width, y: ((1 - v.y) / 2) * size.height };
      });
      t.el.style.visibility = behind ? 'hidden' : 'visible';
      if (!behind) t.el.style.transform = quadMatrix(t.w, t.h, pts);
    }
    // Hotspot-puntjes boven de klikbare objecten
    for (const h of Object.values(hotspots)) {
      if (!h.el) continue;
      if (!h.obj) {
        h.el.style.visibility = 'hidden';
        continue;
      }
      const v = world.current.set(...h.offset);
      h.obj.localToWorld(v).project(camera);
      h.el.style.visibility = v.z > 1 ? 'hidden' : 'visible';
      h.el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`;
    }
  });
  // Bij een nieuwe opstelling (bv. draaien van gsm) de hoeken opnieuw zoeken
  useEffect(() => {
    for (const t of Object.values(screenTargets)) t.corners = null;
  }, [size.width, size.height]);
  return null;
}

