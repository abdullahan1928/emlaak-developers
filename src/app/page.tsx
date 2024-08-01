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

export default function Home() {
  return (
    <>
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
