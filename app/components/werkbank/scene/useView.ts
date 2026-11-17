'use client';
// Kiest de juiste camera en opstelling voor het scherm: liggend (desktop) of staand (gsm).
import { useEffect, useState } from 'react';
import { CAMERA, CAMERA_PORTRAIT, LAYOUT, LAYOUT_PORTRAIT, PORTRAIT_BELOW } from './config';

const isPortrait = () => innerWidth / innerHeight < PORTRAIT_BELOW;

export function useView() {
  const [portrait, setPortrait] = useState(isPortrait);
  useEffect(() => {
    const onResize = () => setPortrait(isPortrait());
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, []);
  return portrait
    ? { portrait, camera: CAMERA_PORTRAIT, layout: LAYOUT_PORTRAIT }
    : { portrait, camera: CAMERA, layout: LAYOUT };
}
