import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { ROUTES } from "@/routes";
import { Separator } from "@/components/ui/separator";
import {
    CONTACT_EMAIL,
    CONTACT_PHONE,
    LOCATION,
    MAP_LINK,
    SOCIAL_LINKS,
} from "@/data/social.data";
import DevnixaLogo from "@/helper/devnixa.logo";

async function getProjects() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/projects`,
            { cache: "no-store" }
        );
        return res.json();
    } catch {
        return {
            projects: [],
        };
    }
}

export default async function Footer() {
    const { projects } = await getProjects();

    const quickLinks = [
        { title: "Home", href: ROUTES.PUBLIC.HOME },
        { title: "Properties", href: ROUTES.PUBLIC.PROPERTIES.LIST },
        { title: "Projects", href: ROUTES.PUBLIC.PROJECTS.LIST },
        { title: "About Us", href: ROUTES.PUBLIC.ABOUT },
        { title: "Services", href: ROUTES.PUBLIC.SERVICES },
        { title: "Contact", href: ROUTES.PUBLIC.CONTACT },
    ];

    return (
        <footer className="bg-secondary text-white pt-14 border-t">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Left */}
                    <div className="flex flex-col gap-6">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={160}
                            height={120}
                            className="object-contain w-44 h-28"
                        />

                        <a
                            href={MAP_LINK}
                            target="_blank"
                            className="flex items-start gap-3 group"
                        >
                            <MapPin size={18} className="text-primary mt-1" />
                            <span className="text-sm text-white/70 group-hover:text-primary">
                                {LOCATION}
                            </span>
                        </a>

                        <a href={`tel:${CONTACT_PHONE}`} className="flex gap-3 group">
                            <Phone size={18} className="text-primary" />
                            <span className="text-sm text-white/70 group-hover:text-primary">
                                {CONTACT_PHONE}
                            </span>
                        </a>

                        <a href={`mailto:${CONTACT_EMAIL}`} className="flex gap-3 group">
                            <Mail size={18} className="text-primary" />
                            <span className="text-sm text-white/70 group-hover:text-primary">
                                {CONTACT_EMAIL}
                            </span>
                        </a>
                    </div>

                    {/* Middle */}
                    <div>
                        <h2 className="text-xs uppercase tracking-widest text-white/50 mb-6">
                            Quick Links
                        </h2>

                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/70 hover:text-primary"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right */}
                    <div>
                        <h2 className="text-xs uppercase tracking-widest text-white/50 mb-6">
                            Projects
                        </h2>

                        <ul className="space-y-3">
                            {projects.slice(0, 5).map((project: any) => (
                                <li key={project._id.toString()}>
                                    <Link
                                        href={ROUTES.PUBLIC.PROJECTS.VIEW(project._id.toString())}
                                        className="text-sm text-white/70 hover:text-primary"
                                    >
                                        {project.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Social */}
                        <div className="mt-10">
                            <h2 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                                Follow Us
                            </h2>

                            <div className="flex gap-3">
                                {SOCIAL_LINKS.map((link, index) => {
                                    const Icon = link.icon;

                                    if (!link.href) return null;

                                    return (
                                        <a
                                            key={index}
                                            href={link.href}
                                            target="_blank"
                                            className="p-2 rounded-full bg-white/10 hover:bg-primary group"
                                        >
                                            <Icon
                                                size={16}
                                                className="text-white group-hover:text-black"
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <Separator className="bg-white/10" />

                    <div className="py-8 flex items-center justify-center gap-1">
                        <div className="text-sm text-white/40">
                            © {new Date().getFullYear()}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">
                                Powered by
                            </span>

                            <a
                                href="https://devnixa.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-end gap-px group"
                            >
                                <DevnixaLogo className="w-10 h-8 text-white group-hover:text-primary transition duration-300" />

                                <span className="text-xl font-semibold text-white group-hover:text-primary transition">
                                    evnixa
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
}