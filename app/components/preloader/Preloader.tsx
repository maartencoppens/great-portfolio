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

  const { ready } = usePageReady();
  const [introDone, setIntroDone] = useState(false);
  const hasExited = useRef(false);

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
      const splitTitle = new SplitType(".title", { types: "chars" });
      const splitSubtitle = new SplitType(".subtitle", { types: "chars" });

      gsap.set(splitTitle.chars ?? [], { y: 24, opacity: 0 });
      gsap.set(splitSubtitle.chars ?? [], { y: 24, opacity: 0 });
      gsap.set(overlayRef.current, { autoAlpha: 1 });
      gsap.set(contentRef.current, { opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => setIntroDone(true),
      });

      tl.to(
        splitTitle.chars,

        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.02,
        },
      )
        .to({}, { duration: 0.6 })

        .to(
          splitSubtitle.chars,

          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.02,
          },
        )
        .to({}, { duration: 0.6 });

      return () => {
        tl.kill();
        splitTitle.revert();
        splitSubtitle.revert();
      };
    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete]);

  useEffect(() => {
    if (!introDone || !ready || hasExited.current) return;
    if (!overlayRef.current) return;

    hasExited.current = true;
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: skipRef.current ? 0.2 : 0.35,
      ease: "power1.out",
      onComplete,
    });
  }, [introDone, ready, onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-1000 bg-bg-secondary flex items-center justify-center"
    >
      <div
        ref={contentRef}
        className="text-center flex flex-col gap-xl opacity-0"
      >
        <Text.Hero as={"p"} className="title text-text-secondary">
          Maarten Coppens
        </Text.Hero>
        <Text.SubHeader as={"p"} className="subtitle text-text-secondary">
          Interactive Designer & Developer
        </Text.SubHeader>
      </div>
    </div>
  );
}
