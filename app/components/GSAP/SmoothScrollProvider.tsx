"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollSmoother, ScrollTrigger } from "@/app/lib/gsap";

export default function SmoothScrollProvider() {
  const pathname = usePathname();

  // Create smoother once on initial load (if a page didn't already create it)
  useEffect(() => {
    if (!ScrollSmoother.get()) {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1, // korter = minder vertraging tussen scrollwiel en beeld
        smoothTouch: false,
        effects: true,
      });
    }
  }, []);

  // Refresh ScrollTrigger after every route change so positions are recalculated
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    const hash = window.location.hash;
    const target = hash
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null;

    if (smoother) {
      smoother.scrollTo(0, false);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    ScrollTrigger.refresh();

    // Een link als /#about: pas scrollen als de pagina en de pin-secties hun hoogte hebben
    if (!target) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const current = ScrollSmoother.get();
      if (current) current.scrollTo(target, false, "top top");
      else target.scrollIntoView();
    }, 150);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
