"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import Text from "../typography/Text";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    const ctx = gsap.context(() => {
      const splitTitle = new SplitType(".title", { types: "chars" });
      const splitSubtitle = new SplitType(".subtitle", { types: "chars" });

      gsap.set(splitTitle.chars ?? [], { y: 24, opacity: 0 });
      gsap.set(splitSubtitle.chars ?? [], { y: 24, opacity: 0 });
      gsap.set(overlayRef.current, { autoAlpha: 1 });

      const tl = gsap.timeline({
        onComplete,
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
        .to({}, { duration: 0.6 })

        .to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.35,
          ease: "power1.out",
        });

      return () => {
        tl.kill();
        splitTitle.revert();
        splitSubtitle.revert();
      };
    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-1000 bg-bg-secondary flex items-center justify-center"
    >
      <div className="text-center flex flex-col gap-xl">
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
