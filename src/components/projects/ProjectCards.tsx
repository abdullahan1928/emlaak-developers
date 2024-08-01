import React from 'react';
import ProjectCard from './ProjectCard';
import { IProject } from '@/interfaces/project';
import { Skeleton } from '@mui/material';
import { cn } from '@/utils/cn';

interface ProjectCardsProps {
    projects: IProject[];
    loading: boolean;
}

const ProjectCards: React.FC<ProjectCardsProps> = ({ projects, loading }) => {
    return (
        <div className="grid grid-cols-1 gap-4 mt-6 mb-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
                Array.from(new Array(6)).map((_, index) => (
                    <div key={index} className="relative mt-12 overflow-hidden bg-white shadow-lg">
                        <Skeleton variant="rectangular" width="100%" height={320} />
                        <div className="px-4 py-2 border-t border-b border-gray-200 bg-[#FAFAFA] font-gilroy">
                            <Skeleton width="100%" height={40} />
                        </div>
                        <div className="px-4 border-t border-b border-gray-200 bg-[#FAFAFA] font-gilroy">
                            <div className="flex justify-center">
                                {Array.from(new Array(3)).map((_, index) => (
                                    <Skeleton key={index} width="100%" height={60} className={cn(
                                        "px-3 uppercase py-1 m-1 text-[#7a7a7a] flex self-center border-[#D7D7D7]",
                                        index === 1 && "border-r border-l",
                                    )} />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center my-8">
                            <button className="px-6 py-2 text-lg text-white bg-black hover:bg-secondary">
                                View Detail
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))
            )}
        </div>
    );
};

export default ProjectCards;
