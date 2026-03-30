import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore selected projects in web development, creative technology, and interactive experiences.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Maarten",
    description:
      "Selected work in web development, interactive design, and creative technology.",
    url: "/projects",
    images: [
      {
        url: "/image.jpg",
        width: 1200,
        height: 630,
        alt: "Projects by Maarten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Maarten",
    description:
      "Selected work in web development, interactive design, and creative technology.",
    images: ["/image.jpg"],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
