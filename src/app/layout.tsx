import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar1 from "@/components/Navbar1";
import Navbar2 from "@/components/Navbar2";
import localFont from 'next/font/local'
import { cn } from "@/utils/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emlaak Developers",
  description: "Emlaak Developers - Real Estate Company in Pakistan",
};

const futura = localFont({
  src: [
    {
      path: '../../public/fonts/Futura Bk Book.ttf',
      weight: '400'
    },
    {
      path: '../../public/fonts/Futura Bk Bold.ttf',
      weight: '700'
    }
  ],
  variable: '--font-futura'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, futura.variable)}>
        <Navbar1 />
        <Navbar2 />
        {children}
      </body>
    </html>
  );
}
