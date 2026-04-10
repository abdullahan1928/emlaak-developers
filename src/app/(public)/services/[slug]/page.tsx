import { services } from "@/data/services.data";
import ServicePage from "./service.client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find(s => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} Sector`,
    description: service.fullDescription,
    keywords: [
      "real estate services Pakistan",
      service.title.toLowerCase(),
      "property investment",
      "buy sell property",
    ],
    openGraph: {
      title: `${service.title}`,
      description: service.fullDescription,
      url: `https://www.emlaakdevelopers.com/services/${service.slug}`,
      siteName: "Emlaak Developers",
      type: "website",
    },
  };
}

const Page = () => {

  return (
    <ServicePage />
  );
};

export default Page;