import React from "react";
import SmallInfoCard from "./SmallInfoCard";

type ExpertiseCardProps = {
  title: string;
};

const ExpertiseCard = ({ title }: ExpertiseCardProps) => {
  return (
    <div className="bg-bg-tertiary rounded-2xl p-l flex flex-col gap-l">
      <h3 className="text-body text-accent-primary">{title}</h3>
      <div className="flex flex-row flex-wrap gap-s">
        <SmallInfoCard content="React" />
        <SmallInfoCard content="Next.js" />
        <SmallInfoCard content="Tailwind CSS" />
      </div>
    </div>
  );
};

export default ExpertiseCard;
