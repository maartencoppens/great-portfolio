"use client";
import { projects } from "@/data/projects";
import { JSX, Suspense, useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";
import Text from "./components/typography/Text";
import SplitType from "split-type";
import ProjectCardAnimation from "./sections/ProjectCardAnimation";
import BentoGrid from "./sections/BentoGrid";
import { Canvas } from "@react-three/fiber";
import Model from "./components/3D/Model";
import SmallInfoCard from "./components/cards/SmallInfoCard";

export default function Home(): JSX.Element {
  const mainRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx: gsap.Context = gsap.context(() => {
      const split = new SplitType(".hero-line", { types: "chars" });
      gsap.set(split.chars ?? [], { y: 50, opacity: 0 });

      gsap.to(split.chars ?? [], {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "expo.out",
        stagger: 0.03,
        delay: 0.3,
      });

      return () => split.revert();
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="bg-bg-tertiary relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-accent-secondary/30 blur-3xl" />
          <div className="absolute -right-12 bottom-16 h-64 w-64 rounded-full bg-accent-primary/20 blur-3xl" />
        </div>
        <section
          ref={mainRef}
          className="container relative min-h-[calc(100dvh-96px)] flex flex-col justify-center gap-8 py-8 sm:gap-10 md:py-12 lg:flex-row lg:items-center lg:gap-12 lg:py-16"
        >
          <div
            ref={textRef}
            className="relative flex w-full flex-1 flex-col items-center gap-5 text-center lg:items-start lg:text-left"
          >
            <SmallInfoCard
              content="Interactive Designer & Developer"
              className="order-1 mx-auto lg:absolute lg:left-0 lg:-top-14 lg:mx-0"
            />
            <Text.Hero className="order-2 max-w-[11ch] text-balance">
              <span className="hero-line block">
                <span className="text-accent-primary font-bold">B</span>uilt
              </span>
              <span className="hero-line block">
                <span className="text-accent-primary font-bold">D</span>
                ifferent
              </span>
            </Text.Hero>
          </div>
          <div className="relative w-full flex-1">
            <div className="relative mx-auto h-[36vh] min-h-70 w-full max-w-140 sm:h-[42vh] lg:h-[56vh] xl:max-w-none">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} />
                <Suspense fallback={null}>
                  <Model />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </section>
      </div>
      <ProjectCardAnimation projects={projects} />
      <BentoGrid />
    </>
  );
}
