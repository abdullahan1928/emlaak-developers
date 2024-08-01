"use client";
import React from 'react';
import Image from 'next/image';
import { IProject } from '@/interfaces/project';
import { LocationOn } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Skeleton } from '@mui/material';

interface ProjectCardProps {
    project: IProject;
}

const formatPrice = (price: string): string => {
    const cleanPrice = price.replace(/,/g, ''); // Remove commas
    const million = 1000000;
    const formattedPrice = (parseInt(cleanPrice) / million).toFixed(1);
    return `${formattedPrice} Million`;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const router = useRouter();

    const handleCardClick = (id: string | undefined) => {
        router.push(`/projects/${id}`);
    }

    return (
        <div className="relative mt-12 overflow-hidden bg-white shadow-lg">
            <div className="relative w-full h-80">
                <Image
                    src={project?.pictures[0]}
                    alt={project?.title}
                    layout="fill"
                    objectFit="cover"
                    className="image-filter"
                />
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-xl font-semibold text-white uppercase">{project?.title}</h2>
                    <div className="flex items-center mt-2 text-gray-300">
                        <LocationOn className="mr-1" /> {project?.location}
                    </div>
                </div>
                <div className="absolute top-0 right-0 px-3 py-1 font-semibold text-white bg-primary-700 rounded-bl-md">
                    {project?.category}
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-center mb-2 text-gray-700 uppercase">
                    Starting from&nbsp;
                    <strong>
                        {formatPrice(project?.price)}
                    </strong>
                    &nbsp;Only
                </div>
            </div>
            <div className="px-4 py-2 border-t border-b border-gray-200 bg-[#FAFAFA] font-gilroy">
                <div className="flex justify-center">
                    {project?.tags.map((tag, index) => (
                        <span
                            key={index}
                            className={cn(
                                "px-3 uppercase py-1 m-1 text-[#7a7a7a] flex self-center border-[#D7D7D7]",
                                index === 1 && "border-r border-l",
                            )}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex justify-center my-8">
                <button
                    onClick={() => handleCardClick(project?._id?.toString())}
                    className="px-6 py-2 text-lg text-white bg-black hover:bg-secondary"
                >
                    View Detail
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
