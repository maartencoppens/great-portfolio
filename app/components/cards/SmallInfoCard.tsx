import React from "react";
import Text from "../typography/Text";

type SmallInfoCardProps = {
  content: string;
  className?: string;
};

// Label boven een grote titel: geen pil, maar een kort paars streepje en tekst in kapitalen,
// zoals de kleine labels onderaan de werkbank-hero
const SmallInfoCard = ({ content, className = "" }: SmallInfoCardProps) => (
  <div
    className={`inline-flex items-center gap-s text-accent-ink ${className}`.trim()}
  >
    <span aria-hidden="true" className="h-0.5 w-8 bg-current" />
    <Text.Eyebrow>{content}</Text.Eyebrow>
  </div>
);

export default SmallInfoCard;
