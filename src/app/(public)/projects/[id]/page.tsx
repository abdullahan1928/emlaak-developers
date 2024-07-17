"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { LocationOn, Visibility, CalendarToday, Category, Description, CheckCircle } from "@mui/icons-material";
import { Typography, Chip } from "@mui/material";

const projects = [
    {
        id: 1,
        title: "Beautiful House",
        images: ["/images/home/form-bg.jpg", "/images/home/form-bg.jpg", "/images/home/form-bg.jpg"],
        location: "123 Main St, City, Country",
        views: 1500,
        dateUploaded: "2023-07-15",
        status: "Available",
        category: "Residential",
        description: "A long description about the beautiful house with all the details and features...",
    },
    // Add more projects as needed
];

const ProjectPage = () => {
    const { id } = useParams();
    const project = projects.find((proj) => proj.id === parseInt(id?.toString() || "0"));

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="container p-4 mx-auto mt-24">
            <Typography variant="h2" className="mb-4 text-4xl font-bold">
                {project.title}
            </Typography>
            <Carousel className="mb-4">
                {project.images.map((image, index) => (
                    <div key={index}>
                        <Image src={image} alt={project.title} width={800} height={400} className="object-cover w-full h-96" />
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
                    <CalendarToday className="mr-2" />
                    <Typography variant="body1">Uploaded on {project.dateUploaded}</Typography>
                </div>
                <div className="flex items-center">
                    <CheckCircle className="mr-2" />
                    <Typography variant="body1">{project.status}</Typography>
                </div>
                <div className="flex items-center">
                    <Category className="mr-2" />
                    <Typography variant="body1">{project.category}</Typography>
                </div>
            </div>
            <Typography variant="h5" className="mb-2 text-2xl font-bold">
                Description
            </Typography>
            <Typography variant="body1" className="leading-relaxed">
                {project.description}
            </Typography>
        </div>
    );
};

export default ProjectPage;
