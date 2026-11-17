"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";
import { ScrollSmoother, ScrollTrigger } from "@/app/lib/gsap";

export default function PreloaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  // Op de homepagina is de werkbank-hero zelf de loader (de naam staat er meteen)
  const pathname = usePathname();
  const [loading, setLoading] = useState(pathname !== "/");

  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}

    startTransition(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) return;
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    return () => {
      smoother?.paused(false);
      ScrollTrigger.refresh();
    };
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      <div aria-hidden={loading} inert={loading}>
        {children}
      </div>
    </>
  );
}
