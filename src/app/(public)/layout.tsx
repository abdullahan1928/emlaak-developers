import type { Metadata } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollButton from "@/components/ScrollButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Emlaak Developers",
  description: "Emlaak Developers - Real Estate Company in Pakistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Navbar />
        {children}
        <Footer />
        <ScrollButton />
        <WhatsAppButton />
      </body>
    </html>
  );
}
