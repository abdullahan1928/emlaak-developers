"use client";

import { Mail } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE, SOCIAL_LINKS } from "@/data/social.data";

const Navbar1 = () => {
    return (
        <div className="hidden md:flex items-center justify-between px-6 py-2 bg-white/80 backdrop-blur-md border-b text-sm text-neutral-600">

            {/* Left: Contact */}
            <div className="flex items-center gap-6">
                <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-2 hover:text-primary transition"
                >
                    <Mail size={16} />
                    {CONTACT_EMAIL}
                </a>

                <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="hover:text-primary transition"
                >
                    {CONTACT_PHONE}
                </a>
            </div>

            {/* Right: Social */}
            <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((link, index) => {
                    const Icon = link.icon;

                    if (!link.href) return null;

                    return (
                        <a
                            key={index}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-muted transition group"
                        >
                            <Icon
                                size={16}
                                className="text-neutral-600 group-hover:text-primary transition"
                            />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default Navbar1;