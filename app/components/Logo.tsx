import React from "react";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={`w-fit p-xl bg-bg-tertiary rounded-full ${className}`}>
      <span className="text-section-title text-text-tertiary">MC</span>
    </div>
  );
};

export default Logo;
