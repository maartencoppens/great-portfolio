'use client';
// Alles wat je wil schuiven of tweaken staat hier: posities, rotaties, kleuren en de 8 scenes.
// Er zijn twee sets: liggend scherm (desktop) en staand scherm (gsm). Zie onderaan.
// Eenheden: meter. x = rechts, z = naar je toe, y = omhoog (van de tafel af).

export type Vec3 = [number, number, number];

export type CameraConfig = {
  elevation: number;
  distance: number;
  fov: number;
  focus: Vec3;
  frameY: number;
  parallax: number;
};

/** Camera: schuin van voren, alsof je aan de tafel zit. Hoek in graden boven de tafel. */
export const CAMERA: CameraConfig = {
  elevation: 32, // 25 = laag en filmisch, 50 = meer van bovenaf
  distance: 1.3, // afstand tot het focuspunt in meter
  fov: 30,
  focus: [0, 0.05, -0.08] as Vec3, // midden van de scherpe zone (tussen Quad Cortex en laptop)
  frameY: 0.08, // hoger = de tafel zakt in beeld, en er komt meer ruimte voor de typografie
  parallax: 0.02, // hoeveel de camera meebeweegt met je muis (bevriest boven klikbare dingen)
};

/** De flightcase: breder dan het scherm, de voorkant staat naar je toe. */
export const CASE = { w: 2.4, d: 0.78, h: 0.5, back: -0.42 };

/** Breedte van de aluminium randen. */
export const RAIL = 0.032;

export const COLORS = {
  laminate: '#141414',
  accent: '#7a3cf0', // paarse Ernie Ball-kabel
  pink: '#e79ecb', // Pink Ties
  cream: '#f3ead8', // grote typografie
};

type Placement = { pos: Vec3; rotY: number };
export type Layout = {
  laptop: Placement;
  quadCortex: Placement;
  mug: { pos: Vec3 };
  palley: Placement & { scale: number };
  turntable: Placement | null; // null = niet tonen
  setlist: Placement | null;
};

// x = rechts, z = naar je toe, y = omhoog. De laptop staat in het midden.
export const LAYOUT: Layout = {
  // Achteraan: laptop in het midden, platenspeler links
  laptop: { pos: [0.02, 0, -0.2] as Vec3, rotY: 0 },
  turntable: { pos: [-0.5, 0, -0.2] as Vec3, rotY: 0.22 },
  mug: { pos: [0.43, 0, -0.04] as Vec3 },
  // Vooraan: Quad Cortex recht naar je toe, zodat het scherm leesbaar is
  quadCortex: { pos: [-0.17, 0, 0.13] as Vec3, rotY: -Math.PI / 2 + 0.06 },
  palley: { pos: [0.26, 0, -0.13] as Vec3, rotY: -0.35, scale: 1.5 },
  setlist: { pos: [0.47, 0, 0.2] as Vec3, rotY: -0.22 },
};

/* ---------- Staand scherm (gsm) ---------- */

/** Steiler naar beneden: de diepte van de tafel wordt hoogte op je scherm. */
export const CAMERA_PORTRAIT: CameraConfig = {
  elevation: 50,
  distance: 1.45,
  fov: 38,
  focus: [0, 0.04, -0.05],
  frameY: 0.17,
  parallax: 0, // geen muis op een gsm
};

/** Onder elkaar in plaats van naast elkaar. Geen platenspeler en geen setlist. */
export const LAYOUT_PORTRAIT: Layout = {
  laptop: { pos: [0, 0, -0.2], rotY: 0 },
  quadCortex: { pos: [0, 0, 0.07], rotY: -Math.PI / 2 },
  mug: { pos: [0.19, 0, -0.06] },
  palley: { pos: [0.165, 0, 0.18], rotY: -0.6, scale: 1.5 },
  turntable: null,
  setlist: null,
};

/** Vanaf welke beeldverhouding (breedte / hoogte) we de staande versie tonen. */
export const PORTRAIT_BELOW = 0.85;

/** Welke plaat ligt op de draaitafel. */
export const RECORDS = {
  playing: '/werkbank/platen/muse-origin-of-symmetry.webp',
};

export type SceneKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

/** Wat er op tafel ligt of verandert per scene. Alles wat niet vermeld is, staat er gewoon. */
export type SceneProps = {
  /** 'tijd' = zakt doorheen de dag (vol 's ochtends, bijna leeg 's avonds) */
  coffee: 'tijd' | 'vol' | 'leeg' | 'omver';
  steam?: boolean; // dampende koffie
  plaat?: string; // welke plaat op de draaitafel ligt (anders RECORDS.playing)
  laptop?: 'code' | 'screensaver';
  koptelefoon?: boolean;
  qcUit?: boolean; // Quad Cortex-scherm uit
  setlistCentraal?: boolean; // setlist schuift naar voren
  kabelGloeit?: boolean;
  plectrums?: boolean;
  podiumspots?: boolean; // zwaaiende gekleurde spots
  pootjes?: boolean; // pootafdrukken op de case
  palleyOmver?: boolean;
  extraTassen?: number;
  postits?: boolean;
  papieren?: boolean;
  raam?: boolean; // schaduw van een raamkozijn (daglicht)
};

export type SceneConfig = {
  naam: string;
  lamp: { color: string; intensity: number };
  ambient: number; // hoeveel de rest van de tafel zichtbaar blijft
  led: string; // accentkleur van de scene (Quad Cortex, label rechtsboven)
  record: boolean; // draait de plaat?
  props: SceneProps;
};

export const SCENES: Record<SceneKey, SceneConfig> = {
  A: { naam: 'Work', lamp: { color: '#ffd9a8', intensity: 11 }, ambient: 0.16, led: '#ff9ad5', record: true,
    props: { coffee: 'tijd', steam: true } },
  B: { naam: 'Morning', lamp: { color: '#fff4e6', intensity: 4 }, ambient: 0.5, led: '#c7a6ff', record: false,
    props: { coffee: 'vol', steam: true, raam: true } },
  C: { naam: 'Focus', lamp: { color: '#ffe2bd', intensity: 8 }, ambient: 0.04, led: '#7dffb2', record: true,
    props: { coffee: 'tijd', koptelefoon: true, qcUit: true } },
  D: { naam: 'Rehearsal', lamp: { color: '#b98bff', intensity: 9 }, ambient: 0.18, led: '#7a3cf0', record: true,
    props: { coffee: 'tijd', plaat: '/werkbank/platen/pink-ties.webp', setlistCentraal: true, kabelGloeit: true } },
  E: { naam: 'Live', lamp: { color: '#ff5fa8', intensity: 8 }, ambient: 0.1, led: '#5fe4ff', record: true,
    props: { coffee: 'leeg', plaat: '/werkbank/platen/pink-ties.webp', setlistCentraal: true, plectrums: true, podiumspots: true, kabelGloeit: true } },
  F: { naam: 'Cat', lamp: { color: '#ffd9a8', intensity: 9 }, ambient: 0.25, led: '#ff9ad5', record: false,
    props: { coffee: 'omver', pootjes: true, palleyOmver: true } },
  G: { naam: 'Night', lamp: { color: '#9fb4ff', intensity: 2.5 }, ambient: 0.03, led: '#ffffff', record: false,
    props: { coffee: 'leeg', laptop: 'screensaver' } },
  H: { naam: 'Deadline', lamp: { color: '#e8f1ff', intensity: 10 }, ambient: 0.35, led: '#fff27a', record: false,
    props: { coffee: 'leeg', extraTassen: 3, postits: true, papieren: true } },
};

/** Easter egg: typ "pinkties" op je toetsenbord. */
export const PINK_MODE: SceneConfig = {
  naam: 'Pink Ties', lamp: { color: '#ff7ac8', intensity: 12 }, ambient: 0.3, led: '#e79ecb', record: true,
  props: { coffee: 'tijd', steam: true, plaat: '/werkbank/platen/pink-ties.webp', setlistCentraal: true, plectrums: true, kabelGloeit: true },
};

export const SCENE_KEYS = Object.keys(SCENES) as SceneKey[];
