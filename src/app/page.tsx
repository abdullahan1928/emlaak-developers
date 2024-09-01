import Hero from "@/components/home/hero";
import InquiryForm from "@/components/home/inquiry-form";
import Marketing from "@/components/home/market-section";
import ProjectSection from "@/components/home/projects-section";
import PropertySection from "@/components/home/property-section";
import Services from "@/components/home/services";
import Welcome from "@/components/home/welcome";
import Navbar1 from "@/components/layouts/public/Navbar1";
import Navbar2 from "@/components/layouts/public/Navbar2";
import Footer from "@/components/layouts/public/Footer";
import ScrollButton from "@/components/layouts/public/ScrollButton";
import WhatsAppButton from "@/components/layouts/public/WhatsAppButton";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Emlaak Developers | Home</title>
        <meta name="description" content="Explore Emlaak Developers' real estate services in Pakistan. Find your dream property with us today!" />
        <meta name="keywords" content="real estate, property, Pakistan, Emlaak Developers" />
        <meta property="og:title" content="Emlaak Developers | Home" />
        <meta property="og:description" content="Explore Emlaak Developers' real estate services in Pakistan. Find your dream property with us today!" />
        <meta property="og:image" content="/images/home-banner.jpg" />
        <meta property="og:url" content="https://www.emlaakdevelopers.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Emlaak Developers | Home" />
        <meta name="twitter:description" content="Explore Emlaak Developers' real estate services in Pakistan. Find your dream property with us today!" />
        <meta name="twitter:image" content="/images/home-banner.jpg" />
      </Head>
      <Navbar1 />
      <Navbar2 />
      <Hero />
      <Welcome />
      <Services />
      <ProjectSection />
      <PropertySection />
      <Marketing />
      <InquiryForm />
      <Footer />
      <ScrollButton />
      <WhatsAppButton />
    </>
  );
}
