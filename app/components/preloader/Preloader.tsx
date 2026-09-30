"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import Text from "../typography/Text";
import { usePageReady } from "@/app/lib/pageReady";

const SEEN_KEY = "intro-seen";

function shouldSkipIntro() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  try {
    return reduceMotion || sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return reduceMotion;
  }
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false);
  const { ready, setRevealed } = usePageReady();
  const [introDone, setIntroDone] = useState(false);
  const hasExited = useRef(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setTimedOut(true), 4000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    skipRef.current = shouldSkipIntro();
    if (skipRef.current) {
      const call = gsap.delayedCall(0, () => setIntroDone(true));
      return () => {
        call.kill();
      };
    }
    const ctx = gsap.context(() => {
      const split = new SplitType(".title", { types: "chars" });
      gsap.set(contentRef.current, { opacity: 1 });

      const tl = gsap.timeline({ onComplete: () => setIntroDone(true) });
      tl.from(split.chars ?? [], {
        yPercent: 110,
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
        stagger: 0.025,
      }).to({}, { duration: 0.25 });

      return () => {
        tl.kill();
        split.revert();
      };
    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete]);

  useEffect(() => {
    // Only exit once: after the intro, when assets are loaded (or we gave up waiting)
    if (!introDone || !(ready || timedOut) || hasExited.current) return;
    if (!overlayRef.current) return;
    hasExited.current = true;

    // Returning visitors: quick fade, no wipe
    if (skipRef.current) {
      setRevealed(true);
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power1.out",
        onComplete,
      });
      return;
    }

    // First visit: name lifts away, then the overlay wipes upward
    gsap
      .timeline({ onComplete })
      .to(contentRef.current, {
        yPercent: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      })
      .call(() => setRevealed(true))
      .to(
        overlayRef.current,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" },
        "-=0.1",
      );
  }, [introDone, ready, timedOut, onComplete, setRevealed]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-1000 bg-bg-secondary flex items-center justify-center"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div
        ref={contentRef}
        className="text-center flex flex-col gap-xl opacity-0"
      >
        <Text.Hero as={"p"} className="title text-text-secondary">
          Maarten Coppens
        </Text.Hero>
      </div>
    </div>
  );
}
