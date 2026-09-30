"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import Preloader from "./Preloader";
import { ScrollSmoother, ScrollTrigger } from "@/app/lib/gsap";

export default function PreloaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

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
