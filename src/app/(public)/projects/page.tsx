import Image from "next/image";

import { Category } from "@/enums/project.enum";
import { enumToOptions } from "@/lib/enum";
import ProjectsPage from "./projects.client";
import { getProjects } from "@/lib/projects";
import { SITE_URL } from "@/data/social.data";

const TEMPLATE_CONFIG = {
    brand: "Emlaak Developers",
    heroTitle: "Signature Living Spaces",
    heroSubtitle: "A curated collection of luxury developments crafted for timeless living.",
    heroImage: "/images/project/project2.jpg",
};

export const metadata = {
    title: "Real Estate Projects",
    description:
        "Discover premium real estate projects by Emlaak Developers. Explore luxury residential and commercial developments, curated for timeless living and smart investment opportunities.",
    keywords: [
        "luxury real estate Pakistan",
        "real estate projects",
        "property investment",
        "residential developments",
        "commercial projects",
        "Emlaak Developers",
        "premium properties"
    ],
    openGraph: {
        title: "Real Estate Projects",
        description:
            "Explore our curated collection of luxury residential and commercial projects designed for sophisticated living and profitable investment.",
        url: `${SITE_URL}/projects`,
        siteName: "Emlaak Developers",
        type: "website",
    },
};

export default async function Page() {
    // const data = await getProjects({});
    const categories = enumToOptions(Category);

    return (
        <div className="bg-[#f8fafc]">
            {/* Hero Section */}
            <section className="relative h-[70vh] overflow-hidden">
                <Image
                    src={TEMPLATE_CONFIG.heroImage}
                    alt="Luxury projects"
                    fill
                    priority
                    className="object-cover scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/70" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        {TEMPLATE_CONFIG.heroTitle}
                    </h1>
                    <p className="text-white/80 mt-4 max-w-2xl text-lg">
                        {TEMPLATE_CONFIG.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Client Component */}
            <ProjectsPage categories={categories} />
        </div>
    );
}