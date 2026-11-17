import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF is ~20% kleiner dan WebP; browsers zonder AVIF krijgen WebP
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
