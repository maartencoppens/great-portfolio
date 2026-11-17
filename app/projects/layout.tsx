import type { Metadata } from "next";

export const metadata: Metadata = {
  // Eigen template, anders krijgen projectpagina's geen "| Maarten Coppens" achter hun titel
  title: {
    absolute: "Projects | Maarten Coppens",
    template: "%s | Maarten Coppens",
  },
  description:
    "Explore selected projects in web development, creative technology, and interactive experiences.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Maarten Coppens",
    description:
      "Selected work in web development, interactive design, and creative technology.",
    url: "/projects",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Projects by Maarten Coppens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Maarten Coppens",
    description:
      "Selected work in web development, interactive design, and creative technology.",
    images: ["/og-image.jpg"],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
