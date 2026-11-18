"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollSmoother } from "@/app/lib/gsap";

// Link naar een sectie op de homepagina (bv. /#about). Sta je al op de homepagina,
// dan scrollt hij via ScrollSmoother; anders navigeert hij gewoon.
export default function SectionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        const [path, hash] = href.split("#");
        if (pathname !== (path || "/") || !hash) return;
        const target = document.getElementById(hash);
        if (!target) return;
        event.preventDefault();
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTo(target, true, "top top");
        else target.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", href);
      }}
    >
      {children}
    </Link>
  );
}
