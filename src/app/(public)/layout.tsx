import type { Metadata } from "next";
import Navbar1 from "@/components/layouts/public/Navbar1";
import Navbar2 from "@/components/layouts/public/Navbar2";
import Footer from "@/components/layouts/public/Footer";
import ScrollButton from "@/components/layouts/public/ScrollButton";
import WhatsAppButton from "@/components/layouts/public/WhatsAppButton";

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
      <>
        <Navbar1 />
        <Navbar2 />
        {children}
        <Footer />
        <ScrollButton />
        <WhatsAppButton />
      </>
    </html>
  );
}
