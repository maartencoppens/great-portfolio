"use client";
import { useEffect, useRef } from "react";
import ProjectCard from "../components/cards/ProjectCard";
import SmallInfoCard from "../components/cards/SmallInfoCard";
import Text from "../components/typography/Text";
import Button from "../components/Button";
import { gsap } from "@/app/lib/gsap";

type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  videoUrl?: string;
  tags: string[];
};

export default function ProjectCardAnimation({
  projects,
}: {
  projects: Project[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const recentWordRef = useRef<HTMLSpanElement>(null);

  const visible = projects.slice(-3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const offsets = [80, -30, 120];

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const initialOffset = offsets[i] ?? 0;

        gsap.set(card, { y: initialOffset });

        gsap.to(card, {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 1.5,
          },
        });
      });

      if (recentWordRef.current) {
        gsap.fromTo(
          recentWordRef.current,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: recentWordRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
              scrub: 0.5,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container min-h-screen flex flex-col items-center pt-2xl justify-start overflow-hidden"
    >
      <SmallInfoCard content="Projects" />
      <Text.Header className="pt-s text-section-title font-bold">
        My{" "}
        <span ref={recentWordRef} className="text-accent-primary inline-block">
          Recent
        </span>{" "}
        Work
      </Text.Header>

      <div className="cards relative w-full m-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-m lg:gap-l">
        {visible.map((project, i) => (
          <div
            key={project.slug}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
          >
            <ProjectCard
              slug={project.slug}
              title={project.title}
              description={project.shortDescription}
              imageUrl={project.image}
              {...(project.videoUrl ? { videoUrl: project.videoUrl } : {})}
              technologies={project.tags}
            />
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center pt-xs">
        <Button
          label="View All Projects"
          href="/projects"
          variant="secondary"
        />
      </div>
    </section>
  );
}
