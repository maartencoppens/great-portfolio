import React from "react";
import Link from "next/link";

type ButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant: "primary" | "secondary" | "tertiary";
};

const Button = ({ label, href, onClick, variant }: ButtonProps) => {
  const className =
    variant === "primary"
      ? "inline-flex w-fit items-center justify-center text-center px-l py-s bg-accent-primary text-text-secondary rounded-4xl"
      : variant === "secondary"
        ? "inline-flex w-fit items-center justify-center text-center hover:cursor-pointer px-l py-s bg-none border-2 text-text-primary rounded-4xl"
        : "inline-flex w-fit items-center justify-center text-center hover:cursor-pointer px-l py-s bg-bg-primary border-2 text-accent-primary rounded-4xl";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={className}>
      {label}
    </Link>
  );
};

export default Button;
