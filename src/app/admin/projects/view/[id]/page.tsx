"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CircularProgress, Paper, Typography } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { IProject } from '@/interfaces/project';

const Page = () => {
    const { id } = useParams();
    const [project, setProject] = useState<IProject>({
        title: '',
        location: '',
        price: '',
        category: '',
        views: 0,
        description: '',
        pictures: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchProject = async () => {
                try {
                    const response = await axios.get(`/api/projects/${id}`);
                    setProject(response.data);
                    setLoading(false);
                } catch (err: any) {
                    setError('Failed to load project data.');
                    setLoading(false);
                }
            };

            fetchProject();
        }
    }, [id]);

    if (loading) return <div className="flex justify-center items-center min-h-screen"><CircularProgress size={60} /></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-6xl p-6 md:p-12">
                <Paper elevation={3} className="p-6 md:p-12 bg-white rounded-lg shadow-lg">
                    <Typography variant="h3" className="text-4xl font-bold mb-4">{project.title}</Typography>
                    <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
                        <div className="w-full md:w-1/2 flex justify-center">
                            <Image
                                src={project.pictures[0]}
                                alt={project.title}
                                width={600}
                                height={400}
                                className="object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-start gap-4">
                            <Typography variant="h6" className="text-lg font-semibold"><strong>Location:</strong> {project.location}</Typography>
                            <Typography variant="h6" className="text-lg font-semibold"><strong>Price:</strong> {project.price}</Typography>
                            <Typography variant="h6" className="text-lg font-semibold"><strong>Category:</strong> {project.category}</Typography>
                            <Typography variant="h6" className="text-lg font-semibold"><strong>Views:</strong> {project.views}</Typography>
                        </div>
                    </div>
                    <Typography variant="h5" className="text-2xl font-semibold mb-4">Description</Typography>
                    <div
                        className="prose lg:prose-xl"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                    <div className="flex flex-wrap gap-4 mt-6">
                        {project.pictures.map((picture: string, index: number) => (
                            <div key={index} className="relative w-32 h-32">
                                <Image
                                    src={picture}
                                    alt={`Project image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </Paper>
            </div>
        </div>
    );
};

export default Page;
