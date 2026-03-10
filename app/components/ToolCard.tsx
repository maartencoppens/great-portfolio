import React from "react";
import SmallInfoCard from "./SmallInfoCard";

type ToolCardProps = {
  title: string;
  tools: string[];
};

const ToolCard = ({ title, tools }: ToolCardProps) => {
  return (
    <div className="p-l flex flex-col gap-m bg-bg-tertiary rounded-xl">
      <h3>{title}</h3>
      <div className="flex flex-wrap gap-s">
        {tools.map((tool) => (
          <SmallInfoCard key={tool} content={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolCard;
