"use client";
import Button from "./components/Button";
import Logo from "./components/Logo";
import ProjectCard from "./components/ProjectCard";
import SmallInfoCard from "./components/SmallInfoCard";
import ToolList from "./components/ToolList";
import { projects } from "@/data/projects";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Image from "next/image";
import InfoCard from "./components/InfoCard";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Create smoother FIRST so all ScrollTrigger instances below use its scroller.
    // Use get() to avoid double-creating if the layout provider already ran first.
    if (!ScrollSmoother.get()) {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
      });
    }

    // Read navbar height from the CSS variable defined in globals.css
    const navH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
      ) || 96;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

      gsap.set(cards, { yPercent: 500, opacity: 0 });

      // Pin the panel in place of the removed CSS sticky
      ScrollTrigger.create({
        trigger: ".cards-section",
        start: `top ${navH}px`,
        end: "bottom bottom",
        pin: ".cards-sticky-panel",
        pinSpacing: false,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cards-section",
          start: `top ${navH}px`,
          end: "bottom bottom",
          scrub: 1,
        },
      });

      cards.forEach((card) => {
        tl.to(
          card,
          {
            yPercent: 0,
            ease: "none",
            duration: 0.5,
            onStart: () => {
              gsap.set(card, { opacity: 1 });
            },
          },
          ">",
        );
      });
    }, mainRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={mainRef}>
      <div className="bg-[radial-gradient(600px,var(--pastel-purple-light)_0%,transparent_40%)] min-h-[calc(100dvh-96px)] flex flex-col items-center justify-center lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-l lg:w-1/2">
          <SmallInfoCard content="Maarten Coppens" />
          <h2 className="text-hero font-bold">
            <span className="text-accent-primary font-bold">I</span>nteractive
            <br />
            <span className="text-accent-primary font-bold">M</span>edia <br />
            <span className="text-accent-primary font-bold">
              D
            </span>eveloper <br />
          </h2>
          <p className="text-body">
            Exploring the intersection of development, design, and interactive
            digital experiences.
          </p>
          <div className="flex flex-row gap-m flex-wrap">
            <Button label="View Projects" href="/projects" variant="primary" />
            <Button label="Contact Me" href="/contact" variant="secondary" />
          </div>
        </div>
        <Logo className="lg:block hidden" />
      </div>

      <div className="py-2xl min-h-screen">
        <SmallInfoCard content="Projects" />
        <h2 className="pt-s text-section-title font-bold">My Recent Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-m py-xl">
          {projects.slice(-3).map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.shortDescription}
              imageUrl={project.image}
              technologies={project.tags}
              slug={project.slug}
            />
          ))}
        </div>
        <div className="w-full flex justify-center pt-xs">
          <Button
            label="View All Projects"
            href="/projects"
            variant="secondary"
          />
        </div>
      </div>
      {/* ── What I Do – stacking card section ── */}
      <div className="cards-section h-[420svh]">
        <div className="cards-sticky-panel h-[calc(100svh-96px)] md:h-[calc(100svh-112px)] flex flex-col gap-m overflow-hidden">
          <div className="pt-xs">
            <SmallInfoCard content="About Me" />
            <h2 className="pt-xs text-card-title md:text-section-title font-bold">
              What I Do
            </h2>
          </div>

          <div className="flex gap-l items-stretch">
            {/* left: image */}
            <div className="relative hidden lg:block w-1/2 self-stretch rounded-2xl overflow-hidden">
              <Image
                src="/image.jpg"
                alt="About section visual"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>

            {/* right: cards stack under each other */}
            <div className="flex-1 overflow-hidden">
              <div className="stack-cards-wrap flex flex-col gap-s overflow-hidden">
                <InfoCard
                  title="Web Development"
                  description="I build modern, responsive websites using technologies like React and Next.js, focusing on performance, scalability, and clean code."
                />
                <InfoCard
                  title="UI/UX Design"
                  description="I create intuitive and visually engaging interfaces, translating ideas into thoughtful user experiences and clean digital products."
                />
                <InfoCard
                  title="Creative Development"
                  description="I explore interactive and experimental digital experiences using creative technologies like Three.js and TouchDesigner."
                />
                <InfoCard title="Technologies" description={<ToolList />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
