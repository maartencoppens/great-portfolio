import { ReactNode } from "react";
import Text from "../typography/Text";
import Image from "next/image";

type BentoTone = "default" | "soft" | "accent" | "inverted";

type BentoCardProps = {
  title: string;
  eyebrow?: string;
  tone?: BentoTone;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
  image?:
    | {
        src: string;
        alt: string;
      }
    | undefined;
};

const toneClassMap: Record<BentoTone, string> = {
  default: "border-black/10 bg-bg-primary",
  soft: "border-black/5 bg-bg-tertiary",
  accent:
    "border-accent-primary/20 bg-[linear-gradient(145deg,rgba(152,16,250,0.08),rgba(200,160,234,0.08)_55%,rgba(255,255,255,0)_100%)]",
  inverted: "border-black/20 bg-bg-secondary text-text-secondary",
};

const BentoCard = ({
  title,
  eyebrow,
  tone = "default",
  className,
  bodyClassName,
  children,
  image,
}: BentoCardProps) => {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm ${toneClassMap[tone]} ${className ?? ""}`}
    >
      {image && (
        <div className="relative aspect-4/3 w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-m md:p-l">
        <header className="mb-s flex flex-col gap-xs">
          {eyebrow ? (
            <Text.Label className="uppercase tracking-wide text-text-tertiary">
              {eyebrow}
            </Text.Label>
          ) : null}
          <Text.SubHeader>{title}</Text.SubHeader>
        </header>
        <div className={bodyClassName}>{children}</div>
      </div>
    </article>
  );
};

export default BentoCard;
