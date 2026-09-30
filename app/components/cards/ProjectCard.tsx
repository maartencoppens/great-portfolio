"use client";
import Text from "../typography/Text";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProjectCardProps = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  client?: string | undefined;
  date?: string | undefined;
  videoUrl?: string | undefined;
  priority?: boolean | undefined;
};

const ProjectCard = ({
  slug,
  title,
  description,
  imageUrl,
  technologies,
  client,
  date,
  videoUrl,
  priority = false,
}: ProjectCardProps) => {
  const year = date ? new Date(date).getFullYear() : undefined;
  const visibleTags = technologies.slice(0, 3);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const bufferedRef = useRef<HTMLSpanElement>(null);
  const playedRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  // Auto play on hover with video preview
  const startPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    const allowed = window.matchMedia(
      "(hover: hover) and (prefers-reduced-motion: no-preference)",
    ).matches;
    if (!allowed) return;
    setIsPreviewing(true);
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const stopPreview = () => {
    setIsPreviewing(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (playedRef.current) playedRef.current.style.transform = "scaleX(0)";
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const updateBuffered = () => {
    const video = videoRef.current;
    const bar = bufferedRef.current;
    if (!video || !bar || !video.duration || video.buffered.length === 0)
      return;
    const loadedUntil = video.buffered.end(video.buffered.length - 1);
    bar.style.transform = `scaleX(${loadedUntil / video.duration})`;
  };

  const tick = () => {
    const video = videoRef.current;
    const bar = playedRef.current;
    if (video && bar && video.duration) {
      bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Link
      href={`/projects/${slug}`}
      className="group block h-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-4"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
    >
      <article className="h-full flex flex-col gap-m justify-between">
        <div className="relative aspect-3/2 w-full overflow-hidden rounded-lg bg-bg-tertiary ring-1 ring-inset ring-black/5">
          <Image
            key={`image-${slug}`}
            priority={priority}
            src={imageUrl}
            alt={`${title}`}
            fill
            unoptimized={process.env.NODE_ENV === "development"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
              onPlaying={() => {
                setIsPlaying(true);
                if (!rafRef.current)
                  rafRef.current = requestAnimationFrame(tick);
              }}
              onProgress={updateBuffered}
              onLoadedMetadata={updateBuffered}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          {/* Progress bar */}
          {videoUrl && (
            <>
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 to-transparent transition-opacity duration-300 ${
                  isPreviewing ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-s bottom-s h-1 overflow-hidden rounded-full bg-white/20 transition-opacity duration-300 ${
                  isPreviewing ? "opacity-100" : "opacity-0"
                }`}
              >
                <span
                  ref={bufferedRef}
                  className="absolute inset-0 origin-left bg-white/35"
                  style={{ transform: "scaleX(0)" }}
                />
                <span
                  ref={playedRef}
                  className="absolute inset-0 origin-left bg-white"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-xs">
          <div className="flex items-baseline justify-between gap-s">
            <Text.SubHeader className="transition-colors duration-200 group-hover:text-accent-primary">
              {title}
            </Text.SubHeader>
            {year && (
              <Text.Small className="shrink-0 tabular-nums text-text-tertiary">
                {year}
              </Text.Small>
            )}
          </div>

          {client && (
            <Text.Small className="text-text-primary/70">{client}</Text.Small>
          )}

          <Text.Body className="text-text-primary/80">{description}</Text.Body>

          {visibleTags.length > 0 && (
            <Text.Small className="pt-xs text-text-tertiary">
              {visibleTags.join(", ")}
            </Text.Small>
          )}

          <span
            aria-hidden="true"
            className="mt-auto inline-flex w-fit items-center rounded-4xl border-2 border-text-primary px-l py-xs pt-xs transition-colors duration-300 group-hover:border-accent-primary group-hover:bg-accent-primary group-hover:text-text-secondary"
          >
            <Text.Button>View project</Text.Button>
          </span>
        </div>
      </article>
    </Link>
  );
};

export default ProjectCard;
