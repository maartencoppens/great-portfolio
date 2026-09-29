import Image from "next/image";
import Text from "@/app/components/typography/Text";

type GridImage = { src: string; alt: string };

type ImageGridProps = {
  images: GridImage[];
  caption?: string;
};

export default function ImageGrid({ images, caption }: ImageGridProps) {
  return (
    <figure className="py-m">
      <div className="grid grid-cols-2 gap-s">
        {images.map((image) => (
          <div
            key={image.src}
            className="relative aspect-4/3 overflow-hidden rounded-2xl"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
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
