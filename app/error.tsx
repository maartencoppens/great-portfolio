"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container py-2xl text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-s text-text-secondary">Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-m rounded-md bg-accent-primary px-m py-s text-white"
      >
        Try again
      </button>
    </main>
  );
}
