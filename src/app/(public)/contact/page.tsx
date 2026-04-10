import { SITE_URL } from "@/data/social.data";
import ContactPage from "./contact.client";

export const metadata = {
  metadataBase: SITE_URL,

  title: "Contact Us",
  description:
    "Get in touch with Emlaak Developers for premium real estate investment, buying, selling, and consultancy services across Pakistan.",

  keywords: [
    "contact Emlaak Developers",
    "real estate contact Pakistan",
    "property consultants Pakistan",
    "buy sell property contact",
    "real estate support",
  ],

  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function Page() {
  return <ContactPage />;
}