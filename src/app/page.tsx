import Footer from "@/components/layouts/public/Footer";
import Navbar1 from "@/components/layouts/public/Navbar1";
import Hero from "@/components/home/hero";
import InquiryForm from "@/components/home/inquiry-form";
import Services from "@/components/home/services";
import Navbar2 from "@/components/layouts/public/Navbar2";
import ScrollButton from "@/components/layouts/public/ScrollButton";
import WhatsAppButton from "@/components/layouts/public/WhatsAppButton";

export default function Home() {
  return (
    <>

      <Navbar1 />

      <Navbar2 />

      <Hero />

      <Services />

      <InquiryForm />

      <Footer />

      <ScrollButton />

      <WhatsAppButton />

    </>
  );
}
