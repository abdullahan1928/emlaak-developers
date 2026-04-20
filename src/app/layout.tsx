import type { Metadata } from "next";
import "@/index.css";
import localFont from "next/font/local";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/utils/cn";
import { SITE_NAME, SITE_URL } from "@/data/social.data";

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
    default: `${SITE_NAME} | Real Estate in Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `${SITE_NAME} offers premium real estate solutions in Pakistan, specializing in commercial, residential, and agricultural property investments.`,
  icons: {
    icon: "/logo.ico",
  },
  keywords: [
    SITE_NAME,
    "Real Estate Pakistan",
    "Property Investment Pakistan",
    "Buy Property Pakistan",
    "Commercial Property Pakistan",
    "Residential Property Pakistan",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "${SITE_NAME} - Real Estate Company in Pakistan",
    description:
      `Find your dream property with ${SITE_NAME}. Trusted real estate services in Pakistan.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE_NAME,
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