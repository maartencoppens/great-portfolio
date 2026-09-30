"use client";

import { startTransition, useCallback, useState } from "react";
import Preloader from "./Preloader";
import { usePageReady } from "@/app/lib/pageReady";

export default function PreloaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { ready } = usePageReady();

  const handleComplete = useCallback(() => {
    startTransition(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      <div
        aria-hidden={loading}
        inert={loading}
        style={{ display: loading ? "none" : "block" }}
      >
        {children}
      </div>
    </>
  );
}
