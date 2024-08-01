"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IProject } from '@/interfaces/project';
import Image from 'next/image';
import ProjectForm from '@/components/projects/ProjectForm';
import ProjectCards from '@/components/projects/ProjectCards';

const Page: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                setProjects(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch projects.');
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <>
            <div className="relative mb-4 w-full h-[40vh]">
                <Image
                    src="/images/project/project2.jpg"
                    alt="Projects"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                    <h1 className="text-5xl font-bold text-white">Emlaak Developers</h1>
                    <p className="mt-2 text-lg text-white">Building Dreams, Creating Futures</p>
                </div>
            </div>

            <div className="container p-4 mx-auto">
                <h1 className="mb-4 text-4xl font-bold text-center text-gray-800">Our Projects</h1>
                <p className="mb-8 text-center text-gray-700">
                    We have completed various projects in different categories. Check out our projects below.
                </p>
                {error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <ProjectCards projects={projects} loading={loading} />
                )}
            </div>

            <ProjectForm />
        </>
    );
};

export default Page;
