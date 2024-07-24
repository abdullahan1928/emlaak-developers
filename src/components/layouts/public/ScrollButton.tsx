"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

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

    return (
        showButton ? (
            <div
                className="fixed z-50 p-4 bg-white rounded-full shadow-xl cursor-pointer curso bottom-4 right-4 hover:bg-gray-100"
                onClick={scrollToTop}
            >
                <ArrowUpward />
            </div>
        ) : null
    );
};

export default ScrollButton;
