"use client";

import { ROUTES } from "@/routes";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Marketing = () => {
    const cards = [
        {
            mainHeading: "20+",
            subHeading: "Years of Trust",
            description: "Our clients trust us for over two decades of excellence in the real estate market."
        },
        {
            mainHeading: "100+",
            subHeading: "Innovative Solutions",
            description: "We bring over a hundred innovative solutions to meet the rising demands in the real estate sector."
        },
        {
            mainHeading: "50+",
            subHeading: "Diverse Portfolio",
            description: "Our diverse portfolio includes over fifty of the latest trends and initiatives in the real estate market."
        },
        {
            mainHeading: "1st",
            subHeading: "Digital Pioneers",
            description: "We were the first in Pakistan to launch digital marketing campaigns in real estate."
        }
    ];

    useEffect(() => {
        AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
    }, []);

    return (
        <section className="bg-gray-100 py-16 px-4 md:px-16 overflow-hidden">
            <div className="container mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">

                {/* Left Content */}
                <div className="flex flex-col w-full md:w-1/2 gap-4" data-aos="fade-right">
                    <h2 className="text-3xl md:text-4xl font-bold font-gilroy mb-4 text-gray-800 uppercase">
                        WHY TRUST US AS THE PRIME REAL ESTATE MARKETING COMPANY?
                    </h2>
                    <p className="text-gray-700 mb-6">
                        We have been consistently growing in the real estate market while embracing every innovation along the way. Our client base grew as we were the first in Pakistan to launch digital marketing campaigns in real estate. Diversity and innovation are at the core of our philosophy.
                    </p>
                    <Link href={ROUTES.PUBLIC.CONTACT} className="hidden md:block">
                        <button className="px-8 py-4 text-xl font-semibold text-white uppercase bg-secondary hover:bg-primary transition-colors rounded-none">
                            Consult Us Now!
                        </button>
                    </Link>
                </div>

                {/* Right Cards */}
                <div className="grid w-full md:w-1/2 grid-cols-1 sm:grid-cols-2 gap-4" data-aos="fade-left">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-3 p-6 bg-white shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <h3 className="text-5xl font-bold text-center text-primary font-gilroy">{card.mainHeading}</h3>
                            <h4 className="text-2xl font-semibold text-center text-gray-800 font-gilroy">{card.subHeading}</h4>
                            <p className="text-center text-gray-600">{card.description}</p>
                        </div>
                    ))}
                    <Link href={ROUTES.PUBLIC.CONTACT} className="block md:hidden mx-auto mt-4">
                        <button className="px-8 py-4 text-xl font-semibold text-white uppercase bg-secondary hover:bg-primary transition-colors rounded-none">
                            Consult Us Now!
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Marketing;