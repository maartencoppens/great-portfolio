'use client';
// Procedurele texturen, getekend op een canvas. Geen extra afbeeldingen nodig.
import * as THREE from 'three';

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

/** Kleine, deterministische random zodat de textuur bij elke reload hetzelfde is. */
export function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** Zwart getextureerd flightcase-laminaat: een fijn korreltje dat het licht vangt. */
export function laminateTextures() {
  const size = 512;
  const [c, ctx] = canvas(size, size);
  const rand = rng(7);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 110 + rand() * 90;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // Zachte "putjes" zoals op echt case-laminaat
  for (let i = 0; i < 2600; i++) {
    const x = rand() * size, y = rand() * size, r = 1 + rand() * 2.5;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(40,40,40,0.7)');
    g.addColorStop(1, 'rgba(40,40,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const bump = new THREE.CanvasTexture(c);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  return { bump };
}

/** Geborsteld aluminium voor de randen. */
export function brushedTexture() {
  const [c, ctx] = canvas(512, 64);
  const rand = rng(3);
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, 512, 64);
  for (let i = 0; i < 400; i++) {
    const y = rand() * 64;
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, y, 512, 0.6 + rand());
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Vinyl met groeven en een glanslijn; het label komt erbovenop. */
export function vinylTexture() {
  const s = 1024;
  const [c, ctx] = canvas(s, s);
  const cx = s / 2;
  ctx.fillStyle = '#0b0b0b';
  ctx.fillRect(0, 0, s, s);
  const rand = rng(5);
  for (let r = 175; r < 505; r += 1.6) {
    ctx.strokeStyle = `rgba(255,255,255,${0.015 + rand() * 0.035})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cx, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Lege ringen tussen de nummers
  for (const r of [230, 300, 365, 430]) {
    ctx.strokeStyle = 'rgba(0,0,0,0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cx, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Matte gaffertape met gescheurde uiteinden (alpha). */
export function tapeTexture(seed: number) {
  const [c, ctx] = canvas(256, 96);
  const rand = rng(seed);
  ctx.fillStyle = '#d8d4cb';
  ctx.beginPath();
  ctx.moveTo(10, 8);
  for (let y = 8; y <= 88; y += 6) ctx.lineTo(4 + rand() * 12, y);
  ctx.lineTo(246, 88);
  for (let y = 88; y >= 8; y -= 6) ctx.lineTo(240 + rand() * 12, y);
  ctx.closePath();
  ctx.fill();
  // Weefsel van de tape
  ctx.globalCompositeOperation = 'source-atop';
  for (let x = 0; x < 256; x += 3) {
    ctx.fillStyle = `rgba(0,0,0,${0.03 + rand() * 0.04})`;
    ctx.fillRect(x, 0, 1, 96);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
