"use client";

import { services } from "@/data/services.data";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ROUTES } from "@/routes";

const Services = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    }, []);

    return (
        <section className="py-16 px-4 md:px-16 bg-white">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <h2
                    className="relative mb-12 text-3xl md:text-4xl font-bold text-gray-900 after:absolute after:left-0 after:bottom-0 after:w-24 after:h-1 after:bg-primary"
                    data-aos="fade-up"
                >
                    Our Services
                </h2>

                <p
                    className="mb-12 text-lg text-gray-600 max-w-3xl"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    We provide a range of services to help you market your property and reach your target audience. Whether you&apos;re looking to sell, rent, or buy a property, we have the tools and expertise to help you succeed. Our experienced team will create a tailored plan to meet your goals.
                </p>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            data-aos="fade-up"
                            data-aos-delay={idx * 100}
                            className="relative bg-secondary text-white rounded-xl shadow-lg overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl"
                        >
                            {/* Image */}
                            <div className="relative w-full h-64 overflow-hidden">
                                <Image
                                    src={`/images/services/${service.image}`}
                                    alt={service.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Overlay title on hover */}
                            <div className="absolute inset-0 bg-secondary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary uppercase text-center px-4">
                                    {service.title}
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4 bg-secondary text-white transition-all duration-300 group-hover:translate-y-2">
                                <h4 className="font-bold text-lg">{service.title}</h4>
                                <p className="mt-2 text-sm text-gray-300">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div
                    className="mt-16 text-center"
                    data-aos="fade-up"
                    data-aos-delay={100}
                >
                    <h3 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900">
                        Ready to get started?
                    </h3>
                    <p className="mb-8 text-lg text-gray-600 max-w-2xl mx-auto">
                        Contact us today to find out how we can help your business thrive.
                    </p>
                    <Link href={ROUTES.PUBLIC.CONTACT}>
                        <button className="px-8 py-3 text-white bg-primary rounded-full hover:bg-secondary transition-colors duration-300">
                            Contact Us
                        </button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Services;