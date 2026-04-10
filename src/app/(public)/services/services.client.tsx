"use client";

import { services, Service } from "@/data/services.data";
import { ROUTES } from "@/routes";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { stats } from "@/data/about.data";

const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}+</span>;
};

const StatsSection = () => (
  <section className="py-20 px-6 md:px-16 bg-secondary text-white">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
      {stats.map((stat, i) => (
        <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
          <h3 className="text-4xl md:text-5xl font-bold text-primary">
            <Counter target={stat.value} />
          </h3>
          <p className="mt-3 text-gray-400 text-sm uppercase tracking-wide">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const ServicesPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div className="bg-white overflow-hidden">

      <section className="relative pt-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-transparent blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold leading-tight">
            Premium Real Estate <span className="text-primary">Solutions</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg">
            A full-service real estate experience designed for modern investors and visionary clients.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white text-center">
        <div className="max-w-6xl mx-auto text-gray-500 text-sm tracking-wide">
          Trusted by investors across Pakistan • Delivering excellence for 20+ years • Premium real estate solutions
        </div>
      </section>

      <StatsSection />

      <section className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-3xl text-center" data-aos="fade-up">
            <h2 className="text-5xl font-bold">What We Offer</h2>
            <p className="mt-4 text-gray-600 text-lg">
              Comprehensive services designed to elevate your real estate journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service: Service, idx: number) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <div
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-black/5 shadow-lg hover:shadow-2xl transition duration-500 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={`/images/services/${service.image}`}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                  </div>

                  {/* Highlight Tag */}
                  {service.highlight && (
                    <div className="absolute top-4 left-4 bg-primary text-black text-xs px-3 py-1 rounded-full">
                      {service.highlight}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    {service.stat && <div className="text-xs text-gray-400">{service.stat}</div>}
                    <div className="pt-3 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition">
                      Learn More <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/40 rounded-2xl transition pointer-events-none" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold">How We Work</h2>
          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {[
              "Consultation & Strategy",
              "Property Matching",
              "Execution & Closing",
            ].map((step, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-8 bg-white rounded-xl shadow hover:shadow-xl transition"
              >
                <div className="text-primary text-4xl font-bold mb-4">
                  0{i + 1}
                </div>
                <h3 className="font-semibold text-lg">{step}</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Tailored approach ensuring maximum efficiency and results.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 bg-secondary text-white">
        <div className="max-w-full mx-auto gap-12 items-center flex flex-col md:flex-row">
          <div className="flex-1">
            <h2 className="text-4xl font-bold leading-tight">
              Investment-Focused Strategy
            </h2>
            <p className="mt-6 text-gray-300">
              We don’t just deal in properties. We build investment portfolios that generate long-term returns.
            </p>
            <Link href={ROUTES.PUBLIC.CONTACT}>
              <button className="mt-8 px-8 py-4 bg-primary text-black rounded-full flex items-center gap-2">
                Start Investing <ArrowRight size={18} />
              </button>
            </Link>
          </div>

          <div className="relative h-80 w-full rounded-2xl overflow-hidden flex-1">
            <Image
              src="/images/services/investment.png"
              alt="Investment"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <h3 className="text-4xl font-bold">Let’s Build Your Portfolio</h3>
        <p className="text-gray-600 mt-4">
          Partner with experts who understand real estate beyond transactions.
        </p>
        <Link href={ROUTES.PUBLIC.CONTACT}>
          <button className="mt-8 px-10 py-4 bg-secondary text-white hover:bg-primary hover:text-black rounded-full text-lg">
            Get Started
          </button>
        </Link>
      </section>
    </div>
  );
};

export default ServicesPage;