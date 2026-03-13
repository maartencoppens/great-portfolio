import "./globals.css";
import localFont from "next/font/local";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

const supreme = localFont({
  src: [
    {
      path: "../public/font/WEB/fonts/Supreme-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/WEB/fonts/Supreme-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/WEB/fonts/Supreme-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-supreme",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${supreme.variable} bg-bg-primary text-text-primary`}>
        <SmoothScrollProvider />
        <Navbar />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main className="container mx-auto px-m pt-20 pb-24 md:px-xl md:pt-24">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
