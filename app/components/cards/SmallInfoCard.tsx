import React from "react";
import Text from "../typography/Text";

type SmallInfoCardProps = {
  content: string;
  variant?: "primary" | "secondary";
  className?: string;
};

const SmallInfoCard = ({
  content,
  variant,
  className = "",
}: SmallInfoCardProps) => {
  const baseClassName =
    variant === "secondary"
      ? "w-fit px-m py-xs bg-bg-primary text-accent-primary rounded-3xl"
      : "w-fit px-m py-xs border border-accent-secondary text-accent-primary rounded-3xl";

  return (
    <div className={`${baseClassName} ${className}`.trim()}>
      <Text.Body>{content}</Text.Body>
    </div>
  );
};

export default SmallInfoCard;
