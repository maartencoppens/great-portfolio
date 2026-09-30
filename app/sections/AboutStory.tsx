"use client";
import Image from "next/image";
import Text from "../components/typography/Text";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

const chapters = [
  {
    id: "maker",
    title: "Hey, I'm Maarten.",
    body: [
      "I design and build websites, and things people can touch.",
      "For the Floraliën in Ghent, I built a telescope that let visitors search for real exoplanets. For the Huis van Kina, a museum piece where you create stones with water, fire and pressure.",
    ],
    image: {
      src: "/about/floralien.jpg",
      alt: "The Exoplanet Explorer installation: a telescope aimed at a projected night sky",
    },
    caption: {
      label: "Exoplanet Explorer, Floraliën Ghent",
      href: "/projects/exoplanet",
    },
  },
  {
    id: "musician",
    title: "Off-screen, I play bass.",
    body: [
      "Placeholder: a few lines about your band, where you play and what music means to you.",
    ],
    image: {
      src: "/about/concert.jpg",
      alt: "Maarten playing bass on stage during a concert",
      position: "58% center",
    },
    caption: { label: "On stage with [band name]" },
  },
];

const AboutStory = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const frameColRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLElement | null)[]>([]);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduceMotion } = context.conditions ?? {};
        if (!desktop) return;

        const [makerLayer, musicianLayer] = layerRefs.current;
        const [makerChapter, musicianChapter] = chapterRefs.current;

        if (
          !makerLayer ||
          !musicianLayer ||
          !makerChapter ||
          !musicianChapter
        ) {
          return;
        }

        // Pin the photo frame while the text column scrolls past
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: frameColRef.current,
          pinSpacing: false,
        });

        if (reduceMotion) {
          // No effects: just swap the photos when chapter 2 arrives
          gsap.set(musicianLayer, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: musicianChapter,
            start: "top center",
            end: "max",
            onToggle: (self) =>
              gsap.set(musicianLayer, { autoAlpha: self.isActive ? 1 : 0 }),
          });
          return;
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: makerChapter,
              start: "top top",
              endTrigger: musicianChapter,
              end: "bottom bottom",
              scrub: true,
            },
          })
          .fromTo(
            makerLayer,
            { clipPath: "circle(8% at 50% 50%)" },
            {
              clipPath: "circle(75% at 50% 50%)",
              ease: "power1.out",
              duration: 0.4,
            },
          )
          .to({}, { duration: 0.15 })
          .fromTo(
            musicianLayer,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "power1.inOut",
              duration: 0.45,
            },
          );
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="about-title" className="container py-2xl">
      <Text.Header id="about-title" className="mb-xl">
        About me
      </Text.Header>

      <div ref={gridRef} className="lg:grid lg:grid-cols-2 lg:gap-2xl">
        {/* Desktop: one frame, both photos stacked */}
        <div
          ref={frameColRef}
          className="hidden lg:flex lg:h-svh lg:items-center lg:pt-24"
        >
          <figure className=" w-full">
            {/* CHANGED: max-h so the pinned frame always fits below the navbar */}
            <div className="relative aspect-4/5 max-h-[calc(100svh-8rem)] overflow-hidden rounded-lg bg-bg-secondary">
              {chapters.map((chapter, i) => (
                // NEW: each image gets a layer, the layer is what we clip
                <div
                  key={chapter.id}
                  ref={(el) => {
                    layerRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={chapter.image.src}
                    alt={chapter.image.alt}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    style={{ objectPosition: chapter.image.position }}
                  />
                </div>
              ))}
            </div>
          </figure>
        </div>

        {/* Text chapters, with a photo per chapter on mobile */}
        <div>
          {chapters.map((chapter, i) => (
            <article
              key={chapter.id}
              // CHANGED: chapterRefs, not layerRefs
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              // CHANGED: 100svh per chapter on desktop
              className="flex flex-col gap-s py-xl lg:min-h-svh lg:justify-center lg:pt-24"
            >
              <figure className="mb-s lg:hidden">
                <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-bg-secondary">
                  <Image
                    src={chapter.image.src}
                    alt={chapter.image.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: chapter.image.position }}
                  />
                </div>
              </figure>
              <Text.SubHeader>{chapter.title}</Text.SubHeader>
              {chapter.body.map((paragraph) => (
                <Text.Body
                  key={paragraph}
                  className="max-w-[55ch] text-text-primary/80"
                >
                  {paragraph}
                </Text.Body>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
