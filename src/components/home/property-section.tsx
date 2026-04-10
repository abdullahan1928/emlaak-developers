"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "@/components/projects/PropertyCard";
import AOS from "aos";
import "aos/dist/aos.css";
import { SITE_NAME } from "@/data/social.data";
import { IProject } from "@/models/project.model";

const PropertySection = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        AOS.init({ duration: 1000, easing: "ease-in-out", once: true });

        const fetchProjects = async () => {
            try {
                const response = await axios.get("/api/projects");
                setProjects(response.data.projects);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch projects.");
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <section className="bg-gray-100 py-16">
            <div className="container mx-auto px-4 md:px-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="fade-up">
                    Properties by {SITE_NAME}
                </h2>

                {error && <p className="text-center text-red-500">{error}</p>}

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="w-full h-96 rounded-xl bg-gray-200 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.slice(0, 8).map((project) => (
                            <PropertyCard key={project._id?.toString()} property={project} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PropertySection;