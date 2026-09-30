"use client";
import Image from "next/image";
import Text from "../components/typography/Text";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";
import Link from "next/link";
import Button from "../components/Button";
import PluckStrings from "../components/interaction/BassStrings";

const chapters = [
  {
    id: "maker",
    title: "Hey, I'm Maarten. I make things you can walk up to.",
    body: [
      "Most of my work lives in a browser. The work I love most doesn't. For the Floraliën in Ghent, I built a telescope that let visitors hunt for real exoplanets, ten days long. For the Huis van Kina, a museum piece where you make stones out of water, fire and pressure.",
    ],
    image: {
      src: "/about/floralien.jpg",
      alt: "The Exoplanet Explorer installation: a telescope aimed at a projected night sky",
    },
    caption: {
      label: "Exoplanet Explorer, Floraliën Ghent",
      href: "/projects/exoplanet",
    },
    link: { label: "See the Exoplanet Explorer", href: "/projects/exoplanet" },
  },
  {
    id: "musician",
    title: "Off-screen, I play bass.",
    body: [
      "In Pink Ties, a cover band, I hold down the low end. Bass is the part you feel more than you hear, and that's how I think about interaction too: when it's done right, nobody notices. People just move.",
    ],
    link: {
      label: "Pink Ties on Instagram",
      href: "https://www.instagram.com/pink.ties_coverband/",
      external: true,
    },
    image: {
      src: "/about/concert.jpg",
      alt: "Maarten playing bass on stage during a concert",
      position: "58% center",
    },
    caption: { label: "On stage with Pink Ties" },
  },
];

const toolGroups = [
  { label: "Web", tools: ["React", "Next.js", "GSAP", "Webflow", "WordPress"] },
  {
    label: "3D & real-time",
    tools: [
      "Three.js",
      "React Three Fiber",
      "Blender",
      "Unreal Engine",
      "TouchDesigner",
    ],
  },
  { label: "Physical", tools: ["Arduino", "Raspberry Pi", "Node.js"] },
  { label: "Design", tools: ["Figma"] },
];

const Tools = () => (
  <dl className="border-t border-black/10">
    {toolGroups.map((group) => (
      <div
        key={group.label}
        className="grid grid-cols-[7rem_1fr] items-baseline gap-m border-b border-black/10 py-s"
      >
        <dt>
          <Text.Small className="text-text-tertiary">{group.label}</Text.Small>
        </dt>
        <dd>
          <Text.Body>
            {group.tools.map((tool, i) => (
              <span key={tool} className="whitespace-nowrap">
                {tool}
                {i < group.tools.length - 1 ? ", " : ""}
              </span>
            ))}
          </Text.Body>
        </dd>
      </div>
    ))}
  </dl>
);

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

  const chapterDetails: Record<string, () => React.JSX.Element> = {
    maker: Tools,
    musician: PluckStrings,
  };

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
            <div className="relative w-full overflow-hidden rounded-lg bg-bg-secondary lg:h-[calc(100svh-8rem)]">
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
          {chapters.map((chapter, i) => {
            const Detail = chapterDetails[chapter.id];

            return (
              <article
                key={chapter.id}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                className="py-xl lg:flex lg:min-h-svh lg:items-center lg:py-0 lg:pt-24"
              >
                <div className="flex w-full flex-col gap-xl lg:min-h-[calc(100svh-8rem)] lg:justify-between">
                  <div className="flex flex-col gap-s">
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
                    </figure>{" "}
                    <Text.SubHeader>{chapter.title}</Text.SubHeader>
                    {chapter.body.map((paragraph) => (
                      <Text.BodyLarge
                        key={paragraph}
                        className="max-w-[50ch] text-text-primary/80"
                      >
                        {paragraph}
                      </Text.BodyLarge>
                    ))}
                    {chapter.link && (
                      <Link
                        href={chapter.link.href}
                        {...(chapter.link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="mt-xs w-fit underline decoration-accent-primary/40 underline-offset-4 transition-colors hover:text-accent-primary hover:decoration-accent-primary"
                      >
                        <Text.Body as="span">{chapter.link.label}</Text.Body>
                      </Link>
                    )}
                  </div>

                  {Detail && <Detail />}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="mt-2xl flex flex-col items-start gap-l border-t border-black/10 pt-2xl lg:flex-row lg:items-end lg:justify-between">
        <Text.Header as="p" className="max-w-[16ch] text-balance">
          Got an idea that deserves to exist outside a screen?
        </Text.Header>
        <Button label="Let's build it" href="/contact" variant="primary" />
      </div>
    </section>
  );
};

export default AboutStory;
