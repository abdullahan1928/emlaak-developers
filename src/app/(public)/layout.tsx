import Navbar1 from "@/components/layouts/public/Navbar1";
import Navbar2 from "@/components/layouts/public/Navbar2";
import Footer from "@/components/layouts/public/Footer";
import ScrollButton from "@/components/layouts/public/ScrollButton";
import WhatsAppButton from "@/components/layouts/public/WhatsAppButton";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <Navbar1 />
            <Navbar2 />
            {children}
            <Footer />
            <ScrollButton />
            <WhatsAppButton />
        </div>
    );
}
