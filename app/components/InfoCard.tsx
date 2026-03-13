import React from "react";

type InfoCardProps = {
  title: string;
  description: string | React.ReactNode;
};

const InfoCard = ({ title, description }: InfoCardProps) => {
  return (
    <div className="stack-card bg-bg-tertiary rounded-2xl p-m h-fit max-w-100 lg:max-w-none">
      <h3 className="text-body-lg text-accent-primary font-semibold">
        {title}
      </h3>
      <div className="text-body pt-s">{description}</div>
    </div>
  );
};

export default InfoCard;
