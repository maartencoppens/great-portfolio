"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import Text from "./typography/Text";
import { gsap } from "@/app/lib/gsap";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const brandRef = React.useRef<HTMLSpanElement>(null);
  const brandName = "Maarten Coppens";

  useEffect(() => {
    if (!brandRef.current) return;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>(".brand-char-cell");
      const currentChars = gsap.utils.toArray<HTMLElement>(
        ".brand-char-current",
      );
      const nextChars = gsap.utils.toArray<HTMLElement>(".brand-char-next");

      gsap.set(cells, { overflow: "hidden" });
      gsap.set(currentChars, { yPercent: 0 });
      gsap.set(nextChars, { yPercent: 105 });

      const hoverTl = gsap.timeline({ paused: true });

      hoverTl
        .to(
          currentChars,
          {
            yPercent: -105,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.02,
          },
          0,
        )
        .to(
          nextChars,
          {
            yPercent: 0,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.02,
          },
          0,
        );

      const onEnter = () => hoverTl.play(0);
      const onLeave = () => hoverTl.reverse();

      brandRef.current?.addEventListener("mouseenter", onEnter);
      brandRef.current?.addEventListener("mouseleave", onLeave);

      return () => {
        brandRef.current?.removeEventListener("mouseenter", onEnter);
        brandRef.current?.removeEventListener("mouseleave", onLeave);
      };
    }, brandRef);

    return () => ctx.revert();
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-bg-primary/95 backdrop-blur-m">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-m md:h-24 md:px-xl">
        <Link href="/">
          <span
            ref={brandRef}
            className="inline-flex cursor-pointer items-center text-heading-xs"
            aria-label={brandName}
          >
            {Array.from(brandName).map((char, index) => {
              const displayChar = char === " " ? "\u00A0" : char;

              return (
                <span
                  key={`${char}-${index}`}
                  className="brand-char-cell relative inline-block h-[1em] leading-none"
                  aria-hidden="true"
                >
                  <span className="brand-char-current block">
                    {displayChar}
                  </span>
                  <span className="brand-char-next absolute left-0 top-0 block">
                    {displayChar}
                  </span>
                </span>
              );
            })}
          </span>
        </Link>

        <ul className="hidden items-center gap-xl text-body md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActiveRoute(link.href) ? "page" : undefined}
                className={`relative pb-1 transition-colors duration-200 ${
                  isActiveRoute(link.href)
                    ? "text-text-primary"
                    : "text-text-primary/65 hover:text-text-primary"
                }`}
              >
                <Text.Nav>{link.label}</Text.Nav>
                <span
                  className={`absolute bottom-0 left-0 h-px bg-text-primary transition-[width] duration-200 ${
                    isActiveRoute(link.href) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button label="Contact" href="/contact" variant="primary" />
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-black transition-transform duration-200 ${
                isOpen ? "translate-y-1.75 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.75 h-0.5 w-5 bg-black transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-3.5 h-0.5 w-5 bg-black transition-transform duration-200 ${
                isOpen ? "-translate-y-1.75 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-black/5 bg-bg-primary transition-[max-height,opacity] duration-300 md:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-m px-m py-m">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActiveRoute(link.href) ? "page" : undefined}
              className={`px-s py-xs text-body transition-colors rounded-l duration-200 ${
                isActiveRoute(link.href)
                  ? "bg-black text-white"
                  : "text-text-primary/80 hover:bg-black/5"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Text.Nav>{link.label}</Text.Nav>
            </Link>
          ))}
          <Button label="Contact" href="/contact" variant="primary" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
