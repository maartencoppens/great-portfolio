import Image from "next/image";
import Text from "@/app/components/typography/Text";

type GridImage = { src: string; alt: string };

type ImageGridProps = {
  images: GridImage[];
  caption?: string;
  columns?: 2 | 3;
  crop?: boolean;
};

const columnClasses = {
  2: "grid-cols-2",
  3: "grid-cols-3",
};

export default function ImageGrid({
  images,
  caption,
  columns = 2,
  crop = false,
}: ImageGridProps) {
  return (
    <figure className="py-m">
      <div className={`grid ${columnClasses[columns]} gap-s items-start`}>
        {images.map((image) =>
          crop ? (
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
          ) : (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={0}
              height={0}
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto rounded-2xl"
            />
          ),
        )}
      </div>
      {caption && (
        <figcaption className="pt-xs opacity-70">
          <Text.Small>{caption}</Text.Small>
        </figcaption>
      )}
    </figure>
  );
}
