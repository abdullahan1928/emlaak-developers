"use client";

import { CONTACT_PHONE, SITE_NAME } from "@/data/social.data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Welcome = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
    }, []);

    return (
        <section className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-32 py-16 md:py-24 px-4 md:px-16">

            {/* Logo / Hero Image */}
            <div
                data-aos="zoom-in"
                data-aos-delay="100"
                className="shrink-0 rounded-xl overflow-hidden"
            >
                <Image
                    src="/logo.png"
                    alt={`${SITE_NAME} Logo`}
                    width={5000}
                    height={5000}
                    className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48"
                    priority
                />
            </div>

            {/* Content */}
            <div
                data-aos="fade-left"
                data-aos-delay="200"
                className="flex flex-col w-full md:w-1/2 gap-4 md:gap-6 space-y-4 text-center md:text-left"
            >
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-gilroy text-gray-900">
                    Welcome to {SITE_NAME}!
                </h3>

                <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                    With over 20 years of expertise, {SITE_NAME} stands as Islamabad’s premier real estate company, now proudly extending its services to Faisalabad. Our dedication to excellence has propelled us beyond our own goals and expectations.
                    <br />
                    <br />
                    We take pride in having assisted a diverse range of investors and clients in achieving their investment aspirations and enhancing their lifestyle standards. Our impressive track record includes the successful digital marketing of some of the country’s most significant housing projects.
                    <br />
                    <br />
                    {SITE_NAME} is now poised for expansion, venturing into real estate development and establishing projects in the most sought-after locations across Islamabad.
                </p>

                <a href={`tel:${CONTACT_PHONE}`}>
                    <Button className="w-full sm:w-1/2 md:w-1/3 py-6! rounded-lg bg-secondary hover:bg-primary text-white transition-all duration-300">
                        Call Now
                    </Button>
                </a>
            </div>
        </section>
    );
};

export default Welcome;