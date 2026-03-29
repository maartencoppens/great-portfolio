import { CSSProperties } from "react";

export const typography = {
  hero: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(4rem, 8vw, 7.5rem)",
    lineHeight: 0.9,
    letterSpacing: "-0.05em",
    fontWeight: 800,
  },
  header: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(2.5rem, 4vw, 4.5rem)",
    lineHeight: 0.95,
    letterSpacing: "-0.04em",
    fontWeight: 700,
  },
  subHeader: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.5rem, 2vw, 2.25rem)",
    lineHeight: 1,
    letterSpacing: "-0.03em",
    fontWeight: 600,
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
