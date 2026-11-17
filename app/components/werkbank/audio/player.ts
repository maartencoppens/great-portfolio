'use client';
// De Pink Ties-opname op de draaitafel. Laadt pas bij de eerste klik (geen gewicht bij het laden),
// fadet zacht in en uit, en meet het lage geluid zodat de werkbank kan meebewegen.
import { useSyncExternalStore } from 'react';

export const TRACK = { src: '/werkbank/audio/pink-ties-live.m4a', titel: 'Pink Ties', ondertitel: 'Plug In Baby · live' };

type State = { playing: boolean; loading: boolean; error: string | null };
let state: State = { playing: false, loading: false, error: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => {
  state = { ...state, ...p };
  subs.forEach((f) => f());
};
export const useNowPlaying = () =>
  useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => state,
  );
export const isPlaying = () => state.playing;

let ctx: AudioContext | null = null;
let audio: HTMLAudioElement | null = null;
let gain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let bins: Uint8Array<ArrayBuffer> | null = null;

function setup() {
  audio = new Audio(TRACK.src);
  audio.loop = true;
  audio.preload = 'auto';
  ctx = new AudioContext();
  const source = ctx.createMediaElementSource(audio);
  gain = ctx.createGain();
  gain.gain.value = 0;
  analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.75;
  bins = new Uint8Array(analyser.frequencyBinCount);
  source.connect(gain).connect(analyser).connect(ctx.destination);
  audio.addEventListener('error', () => set({ playing: false, loading: false, error: 'The recording is missing.' }));
}

export async function togglePinkTies() {
  if (!audio) setup();
  if (state.playing) return stop();
  set({ loading: true, error: null });
  try {
    await ctx!.resume();
    await audio!.play();
    gain!.gain.cancelScheduledValues(ctx!.currentTime);
    gain!.gain.setTargetAtTime(0.9, ctx!.currentTime, 0.25); // naald zakt, volume komt op
    set({ playing: true, loading: false });
  } catch {
    set({ playing: false, loading: false, error: state.error ?? 'Playback failed.' });
  }
}

export function stop() {
  if (!audio || !ctx || !gain) return;
  gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
  const a = audio;
  window.setTimeout(() => a.pause(), 600);
  set({ playing: false });
}

/** Energie in het lage register (bas en kick), 0 tot 1. Bedoeld om elke frame op te vragen. */
export function bassLevel() {
  if (!state.playing || !analyser || !bins) return 0;
  analyser.getByteFrequencyData(bins);
  // Laagste ~ 170 Hz: de eerste bins bij 44,1 kHz en fftSize 512 (86 Hz per bin)
  let sum = 0;
  for (let i = 1; i < 3; i++) sum += bins[i]!;
  return Math.min(1, Math.max(0, (sum / 2 - 90) / 140));
}

/** Volledig spectrum in een paar banden, voor de niveaumeter op de Quad Cortex. */
export function bands(n: number) {
  const out = new Array(n).fill(0);
  if (!state.playing || !analyser || !bins) return out;
  analyser.getByteFrequencyData(bins);
  const max = 96; // tot ~ 8 kHz
  for (let b = 0; b < n; b++) {
    const from = Math.floor(Math.pow(b / n, 2) * max) + 1;
    const to = Math.max(from + 1, Math.floor(Math.pow((b + 1) / n, 2) * max) + 1);
    let s = 0;
    for (let i = from; i < to; i++) s += bins[i]!;
    out[b] = s / (to - from) / 255;
  }
  return out;
}
