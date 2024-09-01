import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/index.css";
import localFont from 'next/font/local';
import { cn } from "@/utils/cn";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../mui.theme';
import Head from "next/head";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Emlaak Developers | Real Estate Company in Pakistan",
  description: "Emlaak Developers offers premium real estate solutions in Pakistan, specializing in commercial, residential, and agricultural property investments.",
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "Emlaak Developers - Real Estate Company in Pakistan",
    description: "Find your dream property with Emlaak Developers. We provide expert real estate services in Pakistan.",
    url: "https://www.emlaakdevelopers.com",
    siteName: "Emlaak Developers",
    images: [
      {
        url: "https://www.emlaakdevelopers.com/logo.png",
        width: 800,
        height: 600,
        alt: "Emlaak Developers Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@emlaakdevelopers",
    title: "Emlaak Developers | Real Estate in Pakistan",
    description: "Discover premium real estate solutions in Pakistan with Emlaak Developers.",
    images: ["https://www.emlaakdevelopers.com/logo.png"],
  },
  keywords: [
    "Real Estate Pakistan",
    "Property Investment",
    "Commercial Property",
    "Residential Property",
    "Agricultural Property",
    "Emlaak Developers"
  ],
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#ffffff",
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
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Emlaak Developers",
  "url": "https://www.emlaakdevelopers.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.emlaakdevelopers.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "mainEntity": [
    {
      "@type": "WebPage",
      "name": "Home",
      "url": "https://www.emlaakdevelopers.com"
    },
    {
      "@type": "WebPage",
      "name": "Services",
      "url": "https://www.emlaakdevelopers.com/services"
    },
    {
      "@type": "WebPage",
      "name": "Contact",
      "url": "https://www.emlaakdevelopers.com/contact"
    },
    {
      "@type": "WebPage",
      "name": "About",
      "url": "https://www.emlaakdevelopers.com/about"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Emlaak Developers offers premium real estate solutions in Pakistan, specializing in commercial, residential, and agricultural property investments." />
        <meta name="keywords" content="Real Estate Pakistan, Property Investment, Commercial Property, Residential Property, Agricultural Property, Emlaak Developers" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Emlaak Developers - Real Estate Company in Pakistan" />
        <meta property="og:description" content="Find your dream property with Emlaak Developers. We provide expert real estate services in Pakistan." />
        <meta property="og:url" content="https://www.emlaakdevelopers.com" />
        <meta property="og:site_name" content="Emlaak Developers" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.emlaakdevelopers.com/logo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@emlaakdevelopers" />
        <meta name="twitter:title" content="Emlaak Developers | Real Estate in Pakistan" />
        <meta name="twitter:description" content="Discover premium real estate solutions in Pakistan with Emlaak Developers." />
        <meta name="twitter:image" content="https://www.emlaakdevelopers.com/logo.png" />

        <link rel="icon" href="/logo.ico" />
        <title>Emlaak Developers | Real Estate Company in Pakistan</title>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
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
