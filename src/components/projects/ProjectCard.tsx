"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/routes';
import { IProject } from '@/models/project.model';
import { MapPin } from 'lucide-react';

interface ProjectCardProps {
    project: IProject;
}

const formatPrice = (startingPrice: string): string => {
    const cleanPrice = startingPrice.replace(/,/g, ''); // Remove commas
    const million = 1000000;
    const formattedPrice = (parseInt(cleanPrice) / million).toFixed(1);
    return `${formattedPrice} Million`;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const router = useRouter();

    const handleCardClick = (id: string | undefined) => {
        router.push(ROUTES.PUBLIC.PROJECTS.VIEW(id!));
    }

    return (
        <div className="relative mt-12 overflow-hidden bg-white shadow-lg">
            <div className="relative w-full h-80">
                {project?.images?.[0]?.url ? (
                    <Image
                        src={project.images[0].url}
                        alt={project?.title || "Project image"}
                        fill
                        className="object-cover image-filter"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-5xl font-bold text-gray-600">
                            {project?.title
                                ? project.title
                                    .split(" ")
                                    .map(word => word[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()
                                : "?"}
                        </span>
                    </div>
                )}

                <div className="absolute bottom-0 w-full p-4 bg-linear-to-t from-black to-transparent">
                    <h2 className="text-xl font-semibold text-white uppercase">{project?.title}</h2>
                    <div className="flex items-center mt-2 text-gray-300">
                        <MapPin className="mr-1" /> {project?.location}
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
                        {formatPrice(project?.startingPrice.toString())}
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
                    onClick={() => handleCardClick(project?.id)}
                    className="px-6 py-2 text-lg text-white bg-secondary hover:bg-secondary"
                >
                    View Detail
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
