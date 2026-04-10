import type { Metadata } from "next";

import Hero from "@/components/home/hero";
import InquiryForm from "@/components/home/inquiry-form";
import Marketing from "@/components/home/market-section";
import ProjectSection from "@/components/home/projects-section";
import PropertySection from "@/components/home/property-section";
import Services from "@/components/home/services";
import Welcome from "@/components/home/welcome";
import CTASection from "@/components/home/cta-section";

// ✅ Page-level SEO (correct way in App Router)
export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore Emlaak Developers' premium real estate services in Pakistan. Discover residential, commercial, and investment opportunities.",
  openGraph: {
    title: "Emlaak Developers | Home",
    description:
      "Find your dream property in Pakistan with Emlaak Developers.",
    images: ["/images/home-banner.jpg"],
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