import Text from "@/app/components/typography/Text";

type VideoProps = {
  src: string;
  poster?: string;
  caption?: string;
  autoplay?: boolean;
};

export default function Video({
  src,
  poster,
  caption,
  autoplay = false,
}: VideoProps) {
  return (
    <figure className="py-m">
      <video
        src={src}
        poster={poster}
        className="w-full h-auto rounded-2xl"
        {...(autoplay
          ? { autoPlay: true, loop: true, muted: true, playsInline: true }
          : { controls: true, preload: "metadata" })}
      />
      {caption && (
        <figcaption className="pt-xs opacity-70">
          <Text.Small>{caption}</Text.Small>
        </figcaption>
      )}
    </figure>
  );
}
