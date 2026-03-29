"use client";

import { useCallback, useState } from "react";
import Preloader from "./Preloader";

export default function PreloaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Preloader onComplete={handleComplete} />;
  }

  return <>{children}</>;
}
