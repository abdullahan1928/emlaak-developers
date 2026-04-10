"use client";
import { ArrowUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const ScrollButton: React.FC = () => {
    const [showButton, setShowButton] = useState(false);

    const handleScroll = () => {
        setShowButton(window.scrollY > 200);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return showButton ? (
        <div
            onClick={scrollToTop}
            className="group fixed z-50 bottom-4 right-4 w-14 h-14 flex items-center justify-center rounded-full shadow-xl cursor-pointer overflow-hidden bg-white"
        >
            {/* Animated fill layer */}
            <span className="absolute inset-0 bg-primary scale-y-0 origin-bottom transition-transform duration-1000 group-hover:scale-y-100"></span>

            {/* Icon */}
            <ArrowUp className="relative z-10 text-black" />
        </div>
    ) : null;
};

export default ScrollButton;