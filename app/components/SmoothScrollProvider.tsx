"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function SmoothScrollProvider() {
  const pathname = usePathname();

  // Create smoother once on initial load (if a page didn't already create it)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    if (!ScrollSmoother.get()) {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
      });
    }

    // Layout never unmounts during normal navigation, so no cleanup needed
  }, []);

  // Refresh ScrollTrigger after every route change so positions are recalculated
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
