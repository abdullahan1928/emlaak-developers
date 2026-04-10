import type { Metadata } from "next";
import "@/index.css";
import localFont from "next/font/local";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/utils/cn";
import { SITE_URL } from "@/data/social.data";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const futura = localFont({
  src: [
    { path: '../../public/fonts/Futura Bk Book.ttf', weight: '400' },
    { path: '../../public/fonts/Futura Bk Bold.ttf', weight: '700' }
  ],
  variable: '--font-futura'
});

const gilroy = localFont({
  src: [
    { path: "../../public/fonts/Gilroy-Light.ttf", weight: "300" },
    { path: "../../public/fonts/Gilroy-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Gilroy-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Gilroy-SemiBold.ttf", weight: "600" },
  ],
  variable: "--font-gilroy",
});

export const metadata: Metadata = {
  title: {
    default: "Emlaak Developers | Real Estate in Pakistan",
    template: "%s | Emlaak Developers",
  },
  description:
    "Emlaak Developers offers premium real estate solutions in Pakistan, specializing in commercial, residential, and agricultural property investments.",
  icons: {
    icon: "/logo.ico",
  },
  keywords: [
    "Real Estate Pakistan",
    "Property Investment Pakistan",
    "Buy Property Pakistan",
    "Commercial Property Pakistan",
    "Residential Property Pakistan",
    "Emlaak Developers",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Emlaak Developers - Real Estate Company in Pakistan",
    description:
      "Find your dream property with Emlaak Developers. Trusted real estate services in Pakistan.",
    url: SITE_URL,
    siteName: "Emlaak Developers",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 800,
        height: 600,
        alt: "Emlaak Developers Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emlaak Developers | Real Estate Pakistan",
    description:
      "Discover premium real estate investment opportunities in Pakistan.",
    images: [`${SITE_URL}/logo.png`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Emlaak Developers",
  url: SITE_URL,
  areaServed: "Pakistan",
  description:
    "Premium real estate company in Pakistan offering residential, commercial, and agricultural properties.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={cn(inter.className, futura.variable, gilroy.variable, "bg-white text-neutral-900")}>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}