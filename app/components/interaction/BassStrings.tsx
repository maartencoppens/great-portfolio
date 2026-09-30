import { useCallback, useEffect, useRef, useState } from "react";
import Text from "../typography/Text";

const PLUCK_SPACING = 44;
const PLUCK_HEIGHT = PLUCK_SPACING * 3 + 16;
const stringY = (i: number) => 8 + i * PLUCK_SPACING;

const PluckStrings = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [hasPlayed, setHasPlayed] = useState(false);
  const sim = useRef({
    width: 0,
    amps: [0, 0, 0, 0],
    phase: 0,
    frame: null as number | null,
    lastY: null as number | null,
  });

  const draw = useCallback(() => {
    const { width, amps, phase } = sim.current;
    pathRefs.current.forEach((path, i) => {
      if (!path) return;
      const steps = 60;
      let d = "";
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        const y =
          stringY(i) +
          Math.sin(phase * (1 + i * 0.2) + t * 18) *
            (amps[i] ?? 0) *
            Math.sin(Math.PI * t);
        d += `${k ? "L" : "M"}${(t * width).toFixed(1)} ${y.toFixed(1)}`;
      }
      path.setAttribute("d", d);
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      sim.current.width = entry.contentRect.width;
      draw();
    });
    observer.observe(svg);
    const s = sim.current;
    return () => {
      observer.disconnect();
      if (s.frame !== null) cancelAnimationFrame(s.frame);
    };
  }, [draw]);

  const loop = useCallback(() => {
    const s = sim.current;
    s.phase += 0.6;
    s.amps = s.amps.map((a) => a * 0.94);
    draw();
    if (s.amps.some((a) => a > 0.05)) {
      s.frame = requestAnimationFrame(loop);
    } else {
      s.amps = [0, 0, 0, 0];
      draw();
      s.frame = null;
    }
  }, [draw]);

  const pluck = (i: number, strength: number, haptic = false) => {
    if (haptic) navigator.vibrate?.(12);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = sim.current;
    s.amps[i] = Math.min(Math.max(s.amps[i] ?? 0, strength), 10);
    if (!hasPlayed) setHasPlayed(true);
    if (s.frame === null) s.frame = requestAnimationFrame(loop);
  };

  const localY = (e: React.PointerEvent) =>
    e.clientY - (svgRef.current?.getBoundingClientRect().top ?? 0);

  const handleMove = (e: React.PointerEvent) => {
    const y = localY(e);
    const { lastY } = sim.current;
    if (lastY !== null) {
      for (let i = 0; i < 4; i++) {
        const sy = stringY(i);
        if ((lastY - sy) * (y - sy) < 0)
          pluck(i, 3 + Math.abs(y - lastY) * 0.6);
      }
    }
    sim.current.lastY = y;
  };

  const handleDown = (e: React.PointerEvent) => {
    const nearest = Math.round((localY(e) - 8) / PLUCK_SPACING);
    if (nearest >= 0 && nearest < 4) pluck(nearest, 6, true);
  };

  return (
    <div aria-hidden="true" className="flex flex-1 flex-col justify-end gap-s">
      <svg
        ref={svgRef}
        height={PLUCK_HEIGHT}
        className="w-full touch-pan-y overflow-visible text-accent-primary/60"
        onPointerMove={handleMove}
        onPointerLeave={() => (sim.current.lastY = null)}
        onPointerDown={handleDown}
      >
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2 - i * 0.4}
          />
        ))}
      </svg>
      <Text.Small
        className={`text-text-tertiary transition-opacity duration-700 ${
          hasPlayed ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="[@media(hover:none)]:hidden">
          Go ahead, play a string.
        </span>
        <span className="hidden [@media(hover:none)]:inline">
          Tap a string to play it.
        </span>
      </Text.Small>
    </div>
  );
};

export default PluckStrings;
