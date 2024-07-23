import Footer from "@/components/layouts/public/Footer";
import Header from "@/components/layouts/public/Header";
import Hero from "@/components/home/hero";
import InquiryForm from "@/components/home/inquiry-form";
import Services from "@/components/home/services";
import Navbar from "@/components/layouts/public/Navbar";

export default function Home() {
  return (
    <main>

      <Header />

      <Navbar />

      <Hero />

      <Services />

      <InquiryForm />

      <Footer />

    </main>
  );
}
