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
        smooth: 1.5,
        effects: true,
      });
    }
  }, []);

  // Refresh ScrollTrigger after every route change so positions are recalculated
  useEffect(() => {
    const smoother = ScrollSmoother.get();

    if (smoother) {
      smoother.scrollTo(0, false);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
