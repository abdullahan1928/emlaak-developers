// components/WhatsAppButton.tsx
"use client";
import React from "react";
import { WhatsApp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { phoneNumber } from "@/data/social.data";

const WhatsAppButton: React.FC = () => {
    const handleClick = () => {
        window.open(`https://wa.me/${phoneNumber}`, "_blank");
    };

    return (
        <div
            className="fixed z-50 p-4 text-white bg-green-500 rounded-full shadow-lg cursor-pointer hover:bg-green-400 bottom-4 left-4"
            onClick={handleClick}
        >
            <WhatsApp sx={{ color: 'white' }} />
        </div>
    );
};

export default WhatsAppButton;
