import { CSSProperties } from "react";

export const typography = {
  // Titels in dezelfde stijl als de werkbank-hero: Anton, smal, hoofdletters, strak op elkaar
  hero: {
    fontFamily: "var(--font-anton), Impact, sans-serif",
    fontSize: "clamp(3.5rem, 14vw, 12rem)",
    lineHeight: 0.85,
    letterSpacing: "-0.005em",
    fontWeight: 400,
    textTransform: "uppercase",
  },
  header: {
    fontFamily: "var(--font-anton), Impact, sans-serif",
    fontSize: "clamp(3rem, 9vw, 8rem)",
    lineHeight: 0.92, // titels over twee regels mogen niet tegen elkaar plakken
    letterSpacing: "-0.005em",
    fontWeight: 400,
    textTransform: "uppercase",
  },
  // Kleinere titels (kaarten, tussenkopjes) blijven in Cabinet Grotesk: Anton alleen voor de grote titels
  subHeader: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.2rem, 3.2vw, 2.25rem)",
    lineHeight: 1,
    letterSpacing: "-0.03em",
    fontWeight: 600,
  },
  // Kleine labels zoals onderaan de hero: hoofdletters met ruime letterafstand
  eyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "0.8rem",
    lineHeight: 1.2,
    letterSpacing: "0.12em",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    lineHeight: 1.6,
    letterSpacing: "-0.01em",
    fontWeight: 400,
  },
  bodyLarge: {
    fontFamily: "var(--font-body)",
    fontSize: "1.125rem",
    lineHeight: 1.6,
    letterSpacing: "-0.015em",
    fontWeight: 400,
  },
  small: {
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    lineHeight: 1.45,
    letterSpacing: "-0.01em",
    fontWeight: 400,
  },
  label: {
    fontFamily: "var(--font-body)",
    fontSize: "0.8rem",
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
    fontWeight: 500,
  },
  nav: {
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    lineHeight: 1,
    letterSpacing: "-0.02em",
    fontWeight: 500,
  },
  button: {
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    lineHeight: 1,
    letterSpacing: "-0.02em",
    fontWeight: 500,
  },
} satisfies Record<string, CSSProperties>;

export type TypographyKey = keyof typeof typography;
