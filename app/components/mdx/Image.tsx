import Image from "next/image";
import Text from "@/app/components/typography/Text";

type ImgProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

export default function Img({ src, alt, caption, className }: ImgProps) {
  return (
    <figure className="py-m">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="(max-width: 1024px) 100vw, 66vw"
        className={`w-auto max-w-full h-auto mx-auto rounded-2xl ${className ?? ""}`}
      />
      {caption && (
        <figcaption className="pt-xs opacity-70">
          <Text.Small>{caption}</Text.Small>
        </figcaption>
      )}
    </figure>
  );
}
