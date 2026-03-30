import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Maarten for web development, creative technology, and interactive design collaborations.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Maarten",
    description:
      "Reach out to discuss your next digital product, website, or interactive experience.",
    url: "/contact",
    images: [
      {
        url: "/image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Maarten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Maarten",
    description:
      "Reach out to discuss your next digital product, website, or interactive experience.",
    images: ["/image.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
