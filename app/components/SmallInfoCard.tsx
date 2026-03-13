import React from "react";

type SmallInfoCardProps = {
  content: string;
  variant?: "primary" | "secondary";
};

const SmallInfoCard = ({ content, variant }: SmallInfoCardProps) => {
  const className =
    variant === "secondary"
      ? "w-fit px-m py-xs bg-bg-primary text-accent-primary rounded-3xl"
      : "w-fit px-m py-xs bg-accent-secondary text-accent-primary rounded-3xl";

  return <span className={className}>{content}</span>;
};

export default SmallInfoCard;
