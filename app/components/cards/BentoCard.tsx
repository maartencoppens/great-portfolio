import { ReactNode } from "react";
import Text from "../typography/Text";

type BentoTone = "default" | "soft" | "accent" | "inverted";

type BentoCardProps = {
  title: string;
  eyebrow?: string;
  tone?: BentoTone;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
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
}: BentoCardProps) => {
  return (
    <article
      className={`group h-full rounded-2xl border p-m md:p-l shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-black/20 ${toneClassMap[tone]} ${className ?? ""}`}
    >
      <header className="mb-s flex flex-col gap-xs">
        {eyebrow ? (
          <Text.Label className="uppercase tracking-wide text-text-tertiary">
            {eyebrow}
          </Text.Label>
        ) : null}
        <Text.SubHeader>{title}</Text.SubHeader>
      </header>
      <div className={bodyClassName}>{children}</div>
    </article>
  );
};

export default BentoCard;
