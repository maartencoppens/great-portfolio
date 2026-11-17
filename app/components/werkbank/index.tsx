'use client';
// De ingang van de werkbank-hero. De homepagina importeert alleen dit bestand.
// De hero zelf draait enkel in de browser (WebGL, audio, sessionStorage); de server stuurt
// al wel de donkere achtergrond en de grote naam, zodat die er meteen staat.
import dynamic from 'next/dynamic';
import { COLORS } from './scene/config';

function HeroFallback() {
  return (
    <section aria-label="Intro" style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: '#0a0a0a' }}>
      <h1
        aria-label="Maarten Coppens"
        style={{
          position: 'absolute',
          top: '11vh',
          left: 0,
          right: 0,
          margin: 0,
          textAlign: 'center',
          color: COLORS.cream,
          font: '400 min(25.5vw, 50vh)/0.82 var(--font-anton), Impact, sans-serif',
          letterSpacing: '-0.005em',
        }}
      >
        MAARTEN
      </h1>
    </section>
  );
}

const Hero = dynamic(() => import('./Hero'), { ssr: false, loading: HeroFallback });

export default Hero;
