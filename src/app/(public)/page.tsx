import type { Metadata } from "next";

import Hero from "@/components/home/hero";
import InquiryForm from "@/components/home/inquiry-form";
import Marketing from "@/components/home/market-section";
import ProjectSection from "@/components/home/projects-section";
import PropertySection from "@/components/home/property-section";
import Services from "@/components/home/services";
import Welcome from "@/components/home/welcome";
import CTASection from "@/components/home/cta-section";
import { SITE_NAME } from "@/data/social.data";

// ✅ Page-level SEO (correct way in App Router)
export const metadata: Metadata = {
  title: "Home",
  description:
    `Explore ${SITE_NAME}' premium real estate services in Pakistan. Discover residential, commercial, and investment opportunities.`,
  openGraph: {
    title: `${SITE_NAME} | Home`,
    description:
      `Find your dream property in Pakistan with ${SITE_NAME}.`,
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <Services />
      <ProjectSection />
      <PropertySection />
      <Marketing />
      <InquiryForm />
      <CTASection />
    </>
  );
}