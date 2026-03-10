import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary">
        <Navbar />
        <main className="container mx-auto px-xl py-24 ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
