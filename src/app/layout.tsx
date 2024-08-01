import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/index.css";
import localFont from 'next/font/local';
import { cn } from "@/utils/cn";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../mui.theme';
import Navbar1 from "@/components/layouts/public/Navbar1";
import Navbar2 from "@/components/layouts/public/Navbar2";
import Footer from "@/components/layouts/public/Footer";
import ScrollButton from "@/components/layouts/public/ScrollButton";
import WhatsAppButton from "@/components/layouts/public/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emlaak Developers",
  description: "Emlaak Developers - Real Estate Company in Pakistan",
  icons: {
    icon: "/logo.ico",
  },
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

const gilroy = localFont({
  src: [
    {
      path: '../../public/fonts/Gilroy-Light.ttf',
      weight: '300'
    },
    {
      path: '../../public/fonts/Gilroy-Regular.ttf',
      weight: '400'
    },
    {
      path: '../../public/fonts/Gilroy-Medium.ttf',
      weight: '500'
    },
    {
      path: '../../public/fonts/Gilroy-SemiBold.ttf',
      weight: '600'
    }
  ],
  variable: '--font-gilroy'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, futura.variable, gilroy.variable)}>
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>
            {children}
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
