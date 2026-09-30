import Text from "@/app/components/typography/Text";

type GridVideo = { src: string; poster?: string };

type VideoGridProps = {
  videos: GridVideo[];
  caption?: string;
  autoplay?: boolean;
  portrait?: boolean;
};

export default function VideoGrid({
  videos,
  caption,
  autoplay = false,
  portrait = false,
}: VideoGridProps) {
  return (
    <figure className="py-m">
      <div
        className={`grid items-start gap-s ${
          portrait ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {videos.map((video) => (
          <video
            key={video.src}
            src={video.src}
            poster={video.poster}
            className="h-auto w-full rounded-2xl"
            {...(autoplay
              ? { autoPlay: true, loop: true, muted: true, playsInline: true }
              : { controls: true, preload: "metadata" })}
          />
        ))}
      </div>
      {caption && (
        <figcaption className="pt-xs opacity-70">
          <Text.Small>{caption}</Text.Small>
        </figcaption>
      )}
    </figure>
  );
}
