'use client';
// Gedeelde toestand tussen de 3D (projectie, klikbare objecten) en de HTML-laag.
// Bewust zonder three.js te importeren: zo blijft three uit het eerste, kleine JS-bestand.
import type * as THREE from 'three';

/**
 * Zweeft de muis boven iets klikbaars? Dan bevriest de camera-parallax, zodat het doel
 * niet onder je cursor wegschuift terwijl je erop wil klikken.
 */
export const hover = {
  object: false, // boven een klikbaar 3D-object
  html: false, // boven een HTML-scherm
  get active() {
    return this.object || this.html;
  },
};

export type Target = {
  root: THREE.Object3D | null; // het model (laptop of Quad Cortex)
  mesh: THREE.Mesh | null; // het scherm-mesh in het model
  /** Welke richting in het model "boven" en "rechts" is op het scherm. */
  axes: (v: THREE.Vector3) => [up: number, right: number];
  corners: THREE.Vector3[] | null; // TL, TR, BR, BL in het assenstelsel van root
  el: HTMLElement | null;
  w: number; // basismaat van de HTML in px
  h: number;
};

export const screenTargets: Record<'laptop' | 'qc', Target> = {
  // Laptop: boven = +y, rechts = +x
  laptop: { root: null, mesh: null, axes: (v) => [v.y, v.x], corners: null, el: null, w: 924, h: 600 },
  // Quad Cortex (model-assen): boven = -x (naar het scherm), rechts = -z
  qc: { root: null, mesh: null, axes: (v) => [-v.x, -v.z], corners: null, el: null, w: 1050, h: 600 },
};


/* ---------------- Klikbaarheid: hotspots en het label bij de cursor ---------------- */

export type HotspotId = 'qc' | 'turntable' | 'palley' | 'mug' | 'setlist' | 'cable';

/** Een pulserend puntje boven elk klikbaar object. obj + offset (lokaal) bepaalt de plek. */
export const hotspots: Record<HotspotId, { obj: THREE.Object3D | null; offset: [number, number, number]; el: HTMLElement | null }> = {
  qc: { obj: null, offset: [0, 0, 0], el: null },
  turntable: { obj: null, offset: [0, 0, 0], el: null },
  palley: { obj: null, offset: [0, 0, 0], el: null },
  mug: { obj: null, offset: [0, 0, 0], el: null },
  setlist: { obj: null, offset: [0, 0, 0], el: null },
  cable: { obj: null, offset: [0, 0, 0], el: null },
};

/** Tekst naast de cursor bij hover ("Vraag: waarom paars?"). Leeg = niets tonen. */
export const cursorLabel = { text: '' };

/** Heeft de bezoeker al eens op een object geklikt? Dan verdwijnen de hotspots. */
const SEEN = 'hotspots-gezien';
export const hotspotsSeen = {
  get value() {
    try {
      return sessionStorage.getItem(SEEN) === '1';
    } catch {
      return false;
    }
  },
  mark() {
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {}
  },
};
