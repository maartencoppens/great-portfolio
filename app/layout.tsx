import "./globals.css";
import localFont from "next/font/local";
import Footer from "./components/Footer";
import GsapProvider from "@/app/components/GSAP/GsapProvider";
import Navbar from "./components/Navbar";
import SmoothScrollProvider from "./components/GSAP/SmoothScrollProvider";
import PreloaderWrapper from "./components/preloader/PreloaderWrapper";

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
