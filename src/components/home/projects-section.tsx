"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCards from "@/components/projects/ProjectCards";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button } from "../ui/button";
import { ROUTES } from "@/routes";
import { SITE_NAME } from "@/data/social.data";
import { IProject } from "@/models/project.model";

const ProjectSection = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
    }, []);

    useEffect(() => {
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
            <div className="container mx-auto px-4 md:px-8">
                <h2
                    className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8"
                    data-aos="fade-up"
                >
                    Signature Projects by {SITE_NAME}
                </h2>

                {error && <p className="text-center text-red-500">{error}</p>}

                <ProjectCards projects={projects.slice(0, 6)} loading={loading} />

                <div
                    className="mt-12 text-center"
                    data-aos="fade-up"
                    data-aos-delay={100}
                >
                    <Link href={ROUTES.PUBLIC.PROJECTS.LIST}>
                        <Button className="px-8! py-6! bg-secondary text-white hover:bg-primary rounded-full font-semibold transition-colors">
                            View All Projects
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProjectSection;