"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { LocationOn, Visibility, Category } from "@mui/icons-material";
import { Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { IProject } from "@/interfaces/project";

const ProjectPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState<IProject>({
        _id: 0,
        title: "",
        price: "0",
        location: "",
        views: 0,
        category: "",
        description: "",
        tags: [],
        pictures: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/api/projects/${id}`);
                setProject(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch project details.");
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="container p-4 mx-auto mt-24">
            <Typography variant="h2" className="mb-4 text-4xl font-bold">
                {project.title}
            </Typography>
            <Carousel className="mb-4">
                {project.pictures.map((image: string, index: number) => (
                    <div key={index}>
                        <Image
                            src={image}
                            alt={project.title}
                            width={800}
                            height={400}
                            className="object-contain w-full"
                        />
                    </div>
                ))}
            </Carousel>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center">
                    <LocationOn className="mr-2" />
                    <Typography variant="body1">{project.location}</Typography>
                </div>
                <div className="flex items-center">
                    <Visibility className="mr-2" />
                    <Typography variant="body1">{project.views} views</Typography>
                </div>
                <div className="flex items-center">
                    <Category className="mr-2" />
                    <Typography variant="body1">{project.category}</Typography>
                </div>
            </div>
            <Typography variant="h5" className="mb-2 text-2xl font-bold">
                Description
            </Typography>
            <Typography variant="body1" className="leading-relaxed" dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>
    );
};

export default ProjectPage;
