import React from "react";
import Link from "next/link";

type ButtonProps = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

const Button = ({ label, href, variant }: ButtonProps) => {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? "px-l py-s bg-accent-primary text-text-secondary rounded-4xl"
          : "px-l py-s bg-none border-2 text-text-primary rounded-4xl"
      }
    >
      {label}
    </Link>
  );
};

export default Button;
