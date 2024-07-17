import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import localFont from 'next/font/local';
import { cn } from "@/utils/cn";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../mui.theme';
import Footer from "@/components/Footer";
import ScrollButton from "@/components/ScrollButton";
import WhatsAppButton from "@/components/WhatsAppButton";

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
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, futura.variable)}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Header />
            <Navbar />
            {children}
            <Footer />
            <ScrollButton />
            <WhatsAppButton />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
