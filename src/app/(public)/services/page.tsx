import { SITE_URL } from "@/data/social.data";
import ServicesPage from "./services.client";

export const metadata = {
  title: "Real Estate Services",
  description:
    "Explore premium real estate services including property investment, marketing, sales, and consultancy by Emlaak Developers.",
  keywords: [
    "real estate services Pakistan",
    "property investment",
    "buy sell property",
    "real estate marketing",
    "Emlaak Developers",
  ],
  openGraph: {
    title: "Real Estate Services",
    description:
      "Premium real estate solutions designed for growth, trust, and long-term value.",
    url: `${SITE_URL}/services`,
    siteName: "Emlaak Developers",
    images: [
      {
        url: "/images/services/service.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

const Page = () => {
  return (
    <ServicesPage />
  );
};

export default Page;