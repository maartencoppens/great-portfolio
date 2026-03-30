import "./globals.css";
import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import Footer from "./components/Footer";
import GsapProvider from "@/app/components/GSAP/GsapProvider";
import Navbar from "./components/Navbar";
import SmoothScrollProvider from "./components/GSAP/SmoothScrollProvider";
import PreloaderWrapper from "./components/preloader/PreloaderWrapper";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maarten | Interactive Designer & Developer",
    template: "%s | Maarten",
  },
  description:
    "Portfolio of Maarten, an interactive designer and developer building high-performance websites and creative digital experiences.",
  applicationName: "Maarten Portfolio",
  keywords: [
    "Maarten",
    "Portfolio",
    "Web Developer",
    "Interactive Designer",
    "Creative Developer",
    "Frontend Development",
    "Next.js",
  ],
  authors: [{ name: "Maarten" }],
  creator: "Maarten",
  publisher: "Maarten",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Maarten | Interactive Designer & Developer",
    description:
      "Discover selected projects, creative technology work, and web experiences by Maarten.",
    url: "/",
    siteName: "Maarten Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/image.jpg",
        width: 1200,
        height: 630,
        alt: "Preview of Maarten's portfolio website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maarten | Interactive Designer & Developer",
    description:
      "Portfolio showcasing interactive design and modern web development projects.",
    images: ["/image.jpg"],
  },
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    icon: [
      {
        url: "/favicon/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#faf9f6",
};

const cabinetGrotesk = localFont({
  src: "../public/font/Heading/TTF/CabinetGrotesk-Variable.ttf",
  variable: "--font-display",
  display: "swap",
});

const generalSans = localFont({
  src: "../public/font/Body/TTF/GeneralSans-Variable.ttf",
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cabinetGrotesk.variable} ${generalSans.variable} bg-bg-primary text-text-primary`}
      >
        <PreloaderWrapper>
          <GsapProvider />
          <SmoothScrollProvider />
          <Navbar />
          <div id="smooth-wrapper">
            <div id="smooth-content">
              <main className="pt-20 pb-xl md:pt-24">{children}</main>
              <Footer />
            </div>
          </div>
        </PreloaderWrapper>
      </body>
    </html>
  );
}
