import React from "react";

type SmallInfoCardProps = {
  content: string;
};

const SmallInfoCard = ({ content }: SmallInfoCardProps) => {
  return (
    <span className="w-fit px-s py-xs bg-accent-secondary text-accent-primary rounded-3xl">
      {content}
    </span>
  );
};

export default SmallInfoCard;
