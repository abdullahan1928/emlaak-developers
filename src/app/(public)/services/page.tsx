import { SITE_NAME, SITE_URL } from "@/data/social.data";
import ServicesPage from "./services.client";

export const metadata = {
  title: "Real Estate Services",
  description:
    `Explore premium real estate services including property investment, marketing, sales, and consultancy by ${SITE_NAME}.`,
  keywords: [
    SITE_NAME,
    "real estate services Pakistan",
    "property investment",
    "buy sell property",
    "real estate marketing",
  ],
  openGraph: {
    title: "Real Estate Services",
    description:
      "Premium real estate solutions designed for growth, trust, and long-term value.",
    url: `${SITE_URL}/services`,
    siteName: SITE_NAME,
    type: "website",
  },
};

const Page = () => {
  return (
    <ServicesPage />
  );
};

export default Page;