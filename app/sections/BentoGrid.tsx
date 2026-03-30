"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";
import BentoCard from "../components/cards/BentoCard";
import SmallInfoCard from "../components/cards/SmallInfoCard";
import Text from "../components/typography/Text";

const skills = [
  "Webflow",
  "React",
  "JavaScript",
  "Three.js",
  "TouchDesigner",
  "Unreal Engine",
  "Arduino",
  "Figma",
  "WordPress",
];

const BentoGrid = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headerRef.current || !gridRef.current) return;
      gsap.set(headerRef.current.children, { y: 20, opacity: 0 });
      gsap.set(gridRef.current.children, { y: 50, opacity: 0, scale: 0.97 });
      gsap.set("[data-skill-tag]", { opacity: 0, scale: 0.8, y: 8 });

      gsap.to(headerRef.current!.children, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        },
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.15,
      });

      const cards = gridRef.current!.children as HTMLCollectionOf<HTMLElement>;
      gsap.to(cards, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.08,
      });

      const skillTags =
        gridRef.current!.querySelectorAll<HTMLElement>("[data-skill-tag]");
      gsap.to(skillTags, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "back.out(1.7)",
        stagger: 0.04,
        delay: 0.35,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container py-2xl">
      <div ref={headerRef} className="mb-xl flex flex-col items-start gap-s">
        <SmallInfoCard content="About" />
        <Text.Header>About Me</Text.Header>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-m md:grid-cols-6 md:auto-rows-[minmax(180px,auto)] lg:grid-cols-12 lg:auto-rows-[minmax(180px,auto)] lg:gap-l"
      >
        <BentoCard
          title="Hey, I'm Maarten"
          eyebrow="Intro"
          tone="accent"
          className="md:col-span-6 lg:col-span-8"
        >
          <Text.BodyLarge className="text-text-primary">
            I design and build digital experiences — from websites to
            interactive installations. Clean, thoughtful, and built to feel
            right.
          </Text.BodyLarge>
        </BentoCard>

        <BentoCard
          title="Tools I use"
          eyebrow="Stack"
          tone="default"
          className="md:col-span-6 lg:col-span-4"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-2 sm:gap-xs">
            {skills.map((skill, index) => (
              <div
                key={skill}
                data-skill-tag
                className={`rounded-xl border px-xs py-[0.45rem] sm:p-xs transition-all duration-300 group-hover:-translate-y-0.5 ${index % 2 === 0 ? "border-black/10 bg-bg-tertiary" : "border-accent-primary/20 bg-accent-secondary/20"}`}
              >
                <Text.Small className="block wrap-break-word text-text-primary sm:text-[0.95rem]">
                  {skill}
                </Text.Small>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard
          title="What I do"
          eyebrow="Focus"
          tone="soft"
          className="md:col-span-3 lg:col-span-4"
        >
          <Text.Body>
            Web design, development, and creative technology. From business
            websites to interactive concepts, installations, and real-time
            visuals.
          </Text.Body>
        </BentoCard>

        <BentoCard
          title="Off-Screen Rhythm"
          eyebrow="Beyond Work"
          tone="accent"
          className="md:col-span-4 lg:col-span-5"
        >
          <Text.Body>
            Drums and bass guitar are my way of switching off. I listen to a lot
            too — it&apos;s always on in the background when I&apos;m building.
          </Text.Body>
        </BentoCard>
        <BentoCard
          title="My Setup"
          eyebrow="Workflow"
          tone="inverted"
          className="md:col-span-2 lg:col-span-3"
        >
          <Text.Body className="text-text-secondary">
            3 monitors. 2 instruments. 1 cup of coffee to start the day.
          </Text.Body>
        </BentoCard>
      </div>
    </section>
  );
};

export default BentoGrid;
