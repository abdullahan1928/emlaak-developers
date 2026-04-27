import Image from "next/image";
import { Category, ProjectStatus } from "@/enums/project.enum";
import { enumToOptions } from "@/lib/enum";
import { SITE_NAME, SITE_URL } from "@/data/social.data";
import ProjectsClient from "./projects.client";

export const metadata = {
    title: "Real Estate Projects",
    description: `Discover premium real estate projects by ${SITE_NAME}. Explore luxury residential, commercial and township developments across Pakistan.`,
    keywords: [
        SITE_NAME,
        "real estate projects Pakistan",
        "housing society Pakistan",
        "property investment",
        "residential developments",
        "commercial projects",
    ],
    openGraph: {
        title: "Real Estate Projects",
        description: "Explore our curated collection of luxury residential and commercial projects.",
        url: `${SITE_URL}/projects`,
        siteName: SITE_NAME,
        type: "website",
    },
};

const HERO_IMAGE = "/images/project/project2.jpg";

export default function ProjectsPage() {
    const categories = enumToOptions(Category);
    const statuses = enumToOptions(ProjectStatus);

    return (
        <div className="bg-[#f8fafc] min-h-screen">

            {/* Hero */}
            <section className="relative h-[55vh] overflow-hidden">
                <Image
                    src={HERO_IMAGE}
                    alt="Real Estate Projects"
                    fill
                    priority
                    className="object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                        {SITE_NAME}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        Signature Projects
                    </h1>
                    <p className="text-white/70 mt-4 max-w-2xl text-lg">
                        A curated collection of premium real estate developments across Pakistan
                    </p>
                </div>
            </section>

            {/* Client: filters + grid */}
            <ProjectsClient categories={categories} statuses={statuses} />
        </div>
    );
}