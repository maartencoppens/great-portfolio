"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/types/types";

type ProjectMediaGalleryProps = {
  mediaItems: ProjectMedia[];
  projectTitle: string;
  projectSlug: string;
};

export default function ProjectMediaGallery({
  mediaItems,
  projectTitle,
  projectSlug,
}: ProjectMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeMedia = mediaItems[activeIndex] ?? null;
  const totalItems = mediaItems.length;

  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[activeIndex];
    if (!activeThumbnail) return;

    activeThumbnail.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  const selectPrevious = () => {
    if (totalItems <= 1) return;
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const selectNext = () => {
    if (totalItems <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  if (!activeMedia) {
    return null;
  }

  return (
    <div className="my-l grid grid-cols-1 gap-m lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div className="relative w-full overflow-hidden rounded-2xl bg-bg-tertiary">
        <div className="relative aspect-4/3 w-full sm:aspect-video">
          {activeMedia.type === "video" ? (
            <video
              key={`active-video-${activeIndex}`}
              src={activeMedia.src}
              poster={activeMedia.poster}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              key={`active-image-${activeIndex}`}
              src={activeMedia.src}
              alt={activeMedia.alt ?? `Preview of ${projectTitle}`}
              fill
              sizes="(min-width: 1280px) 960px, (min-width: 1024px) 70vw, 100vw"
              className="object-cover"
            />
          )}

          {totalItems > 1 && (
            <>
              <button
                type="button"
                onClick={selectPrevious}
                className="absolute left-s top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-3 text-white transition hover:bg-black/70 md:p-4"
                aria-label="Show previous media"
              >
                <span aria-hidden="true" className="text-3xl leading-none">
                  ‹
                </span>
              </button>
              <button
                type="button"
                onClick={selectNext}
                className="absolute right-s top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-3 text-white transition hover:bg-black/70 md:p-4"
                aria-label="Show next media"
              >
                <span aria-hidden="true" className="text-3xl leading-none">
                  ›
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      <aside>
        <div>
          <div className="grid grid-cols-2 gap-xs">
            {mediaItems.map((item, index) => (
              <button
                key={`${projectSlug}-media-thumb-${index}`}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative aspect-4/3 w-full overflow-hidden rounded-lg border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70 ${
                  activeIndex === index
                    ? "border-accent-primary ring-1 ring-accent-primary/70"
                    : "border-body/10 hover:border-accent-primary/60"
                }`}
                aria-label={`Show media ${index + 1}`}
                aria-current={activeIndex === index}
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.src}
                      poster={item.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    <span className="pointer-events-none absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white">
                      Video
                    </span>
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt ?? `${projectTitle} media ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                )}
                {activeIndex === index && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-accent-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
