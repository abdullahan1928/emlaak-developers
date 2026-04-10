"use client";

import { services, Service } from "@/data/services.data";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ROUTES } from "@/routes";

const ServicePage = () => {
  const params = useParams();

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  const service: Service | undefined = services.find(s => s.slug === params.slug);

  if (!service) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-4xl font-bold">Service Not Found</h1>
        <p className="mt-4 text-gray-500">The service you are looking for does not exist.</p>
        <Link href={ROUTES.PUBLIC.SERVICES}>
          <button className="mt-6 px-6 py-3 bg-primary text-black rounded-full hover:bg-secondary hover:text-white transition">
            Back to Services
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden py-20 space-y-20">

      {/* Hero */}
      <section className="relative px-6 text-center">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-transparent blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold leading-tight">{service.title}</h1>
          <p className="mt-6 text-gray-600 text-lg">{service.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Image / Gallery */}
          <div className="space-y-6">
            <Image
              src={`/images/services/${service.image}`}
              alt={service.title}
              width={800}
              height={500}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>

          {/* Text */}
          <div>
            {service.highlight && (
              <div className="inline-block bg-primary text-black text-xs px-3 py-1 rounded-full mb-4">
                {service.highlight}
              </div>
            )}
            <p className="text-gray-700 text-lg mb-6">{service.fullDescription}</p>

            {service.features && (
              <ul className="mb-8 space-y-3">
                {service.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <span className="text-primary font-bold">✓</span> {feat}
                  </li>
                ))}
              </ul>
            )}

            {service.ctaText && service.ctaLink && (
              <Link href={service.ctaLink}>
                <button className="px-8 py-4 bg-primary text-black rounded-full flex items-center gap-2 hover:bg-secondary hover:text-white transition">
                  {service.ctaText} <ArrowRight size={18} />
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServicePage;