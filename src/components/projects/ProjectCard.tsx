"use client";
import React from 'react';
import Image from 'next/image';
import { IProject } from '@/interfaces/project';
import { LocationOn, AttachMoney, Visibility, Category } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
    project: IProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const router = useRouter();

    const handleCardClick = (id: string | undefined) => {
        router.push(`/projects/${id}`);
    }

    return (
        <div
            className="overflow-hidden bg-white rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => handleCardClick(project._id?.toString())}
        >
            <Image
                src={project.pictures[0]}
                alt={project.title}
                width={400}
                height={200}
                className="object-cover w-full h-48 hover:scale-110 transition-transform duration-300"
            />
            <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{project.title}</h2>
                <div className="flex items-center mb-2 text-gray-700">
                    <LocationOn className="mr-1" /> {project.location}
                </div>
                <div className="flex items-center mb-2 text-gray-700">
                    <AttachMoney className="mr-1" /> {project.price}
                </div>
                <div className="flex gap-2 mb-2 text-gray-700">
                    <div className="flex items-center">
                        <Category className="mr-1" /> {project.category}
                    </div>
                    <div className="flex items-center">
                        <Visibility className="mr-1" /> {project.views} views
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
