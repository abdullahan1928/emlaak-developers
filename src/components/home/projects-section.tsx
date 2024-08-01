"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IProject } from '@/interfaces/project';
import ProjectCards from '@/components/projects/ProjectCards';
import { Button } from '@mui/material';
import Link from 'next/link';

const ProjectSection: React.FC = () => {
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
        <div className='bg-gray-100'>
            <div className="container flex flex-col p-4 mx-auto">
                <h1 className="mt-8 text-3xl font-normal text-center uppercase font-gilroy">
                    Signature Projects by Emlaak Developers
                </h1>
                {error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <ProjectCards projects={projects.slice(0, 3)} loading={loading} />
                )}

                <Link href="/projects" className='mx-auto my-6'>
                    <Button
                        className="!text-white !border !border-white uppercase !bg-black hover:!bg-primary hover:!text-black !font-normal !font-gilroy !text-xl !p-4 !rounded-none"
                        variant="contained"
                    >
                        View All Projects
                    </Button>
                </Link>

            </div>

        </div>
    );
};

export default ProjectSection;
