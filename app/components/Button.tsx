import React from "react";
import Link from "next/link";
import Text from "./typography/Text";

type ButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "tertiary";
  isActive?: boolean;
};

const Button = ({
  label,
  href,
  onClick,
  type = "button",
  variant = "primary",
  isActive = false,
}: ButtonProps) => {
  const baseClassName =
    "relative inline-flex w-fit items-center justify-center overflow-hidden rounded-4xl px-l py-s text-center transition-all duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary motion-reduce:transition-none";

  const variantClassName =
    variant === "primary"
      ? "bg-accent-primary text-text-secondary shadow-[0_8px_20px_var(--pastel-purple-light)]"
      : variant === "secondary"
        ? "border-2 border-text-primary bg-transparent text-text-primary"
        : "border-2 border-accent-primary bg-bg-primary text-accent-primary";

  const hoverClassName =
    variant === "primary"
      ? "group cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_var(--pastel-purple-light)] motion-reduce:hover:translate-y-0"
      : variant === "secondary"
        ? "group cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 hover:border-accent-primary hover:text-text-secondary hover:shadow-[0_10px_24px_var(--pastel-purple-light)] motion-reduce:hover:translate-y-0"
        : "group cursor-pointer active:scale-[0.98] hover:-translate-y-0.5 hover:text-text-secondary hover:shadow-[0_10px_24px_var(--pastel-purple-light)] motion-reduce:hover:translate-y-0";

  const activeStateClassName =
    "border-2 border-accent-primary bg-accent-primary text-text-secondary shadow-[0_12px_28px_var(--pastel-purple-light)] ring-1 ring-accent-secondary/40";

  const className = `${baseClassName} ${isActive ? activeStateClassName : `${variantClassName} ${hoverClassName}`}`;

  const content = (
    <>
      {!isActive && (
        <>
          <span className="absolute inset-0 rounded-4xl bg-linear-to-r from-accent-secondary to-accent-primary opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
          <span className="absolute -left-1/3 top-0 h-full w-1/3 -translate-x-full skew-x-[-20deg] bg-white/25 blur-[1px] transition-transform duration-500 ease-out group-hover:translate-x-[350%]" />
        </>
      )}
      <Text.Button
        className={`relative z-10 ${isActive ? "text-text-secondary" : "transition-colors duration-300"}`}
      >
        {label}
      </Text.Button>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export default Button;
