import Text from "@/app/components/typography/Text";

type VideoProps = {
  src: string;
  poster?: string;
  caption?: string;
  autoplay?: boolean;
  portrait?: boolean;
};

export default function Video({
  src,
  poster,
  caption,
  autoplay = false,
  portrait = false,
}: VideoProps) {
  return (
    <figure className="py-m">
      <video
        src={src}
        poster={poster}
        className={
          portrait
            ? "mx-auto h-auto max-h-[80svh] w-auto rounded-2xl"
            : "h-auto w-full rounded-2xl"
        }
        {...(autoplay
          ? { autoPlay: true, loop: true, muted: true, playsInline: true }
          : { controls: true, preload: "metadata" })}
      />
      {caption && (
        <figcaption
          className={`pt-xs opacity-70 ${portrait ? "text-center" : ""}`}
        >
          <Text.Small>{caption}</Text.Small>
        </figcaption>
      )}
    </figure>
  );
}
