import "./globals.css";
import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import Footer from "./components/Footer";
import GsapProvider from "@/app/components/GSAP/GsapProvider";
import Navbar from "./components/Navbar";
import SmoothScrollProvider from "./components/GSAP/SmoothScrollProvider";
import PreloaderWrapper from "./components/preloader/PreloaderWrapper";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PageReadyProvider } from "./lib/pageReady";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maartencoppens.be";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maarten Coppens | Interactive Designer & Developer",
    template: "%s | Maarten Coppens",
  },
  description:
    "Portfolio of Maarten Coppens, an interactive designer and developer based near Ghent, Belgium, building fast websites, 3D web experiences and interactive installations.",
  applicationName: "Maarten Coppens",
  keywords: [
    "Maarten Coppens",
    "Portfolio",
    "Ghent",
    "Belgium",
    "Three.js",
    "React Three Fiber",
    "Web Developer",
    "Interactive Designer",
    "Creative Developer",
    "Frontend Development",
    "Next.js",
  ],
  authors: [{ name: "Maarten Coppens", url: siteUrl }],
  creator: "Maarten Coppens",
  publisher: "Maarten Coppens",
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
    title: "Maarten Coppens | Interactive Designer & Developer",
    description:
      "Selected projects, 3D web experiences and interactive installations by Maarten Coppens.",
    url: "/",
    siteName: "Maarten Coppens",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maarten Coppens: interactive designer and developer, above his workbench with a laptop, Quad Cortex and turntable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maarten Coppens | Interactive Designer & Developer",
    description:
      "Selected projects, 3D web experiences and interactive installations by Maarten Coppens.",
    images: ["/og-image.jpg"],
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
  themeColor: "#131118",
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

const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  variable: "--font-anton",
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
        className={`${cabinetGrotesk.variable} ${generalSans.variable} ${anton.variable} bg-bg-primary text-text-primary`}
      >
        <PageReadyProvider>
          <PreloaderWrapper>
            {/* Voor toetsenbordgebruikers: meteen voorbij de navigatie */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent-primary focus:px-m focus:py-s focus:text-white"
            >
              Skip to content
            </a>
            <GsapProvider />
            <SmoothScrollProvider />
            <Navbar />
            <div id="smooth-wrapper">
              <div id="smooth-content">
                <main id="main" tabIndex={-1} className="min-h-svh pt-20 pb-xl outline-none md:pt-24">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </PreloaderWrapper>
        </PageReadyProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
