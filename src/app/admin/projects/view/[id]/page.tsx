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
        description: '',
        tags: [],
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

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <CircularProgress size={60} thickness={4} color="primary" />
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <Paper elevation={3} className="p-8 bg-white rounded-lg shadow-lg">
                <Typography variant="h6" className="text-red-500 flex items-center gap-2">
                    <span>⚠️</span> {error}
                </Typography>
            </Paper>
        </div>
    );

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="w-full max-w-6xl p-6 md:p-12">
                <Paper elevation={3} className="p-8 md:p-12 bg-white rounded-xl shadow-xl">
                    <Typography 
                        variant="h3" 
                        className="text-4xl font-bold mb-8 text-gray-800 border-b pb-4"
                    >
                        {project.title}
                    </Typography>

                    <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
                        <div className="w-full md:w-1/2">
                            <div className="relative rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src={project.pictures[0]}
                                    alt={project.title}
                                    width={600}
                                    height={400}
                                    className="object-cover w-full hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-start gap-6 bg-gray-50 p-6 rounded-xl">
                            <DetailItem label="Location" value={project.location} />
                            <DetailItem label="Price" value={project.price} />
                            <DetailItem label="Category" value={project.category} />
                        </div>
                    </div>

                    <div className="mb-8">
                        <Typography 
                            variant="h5" 
                            className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2"
                        >
                            Description
                        </Typography>
                        <div
                            className="prose lg:prose-xl max-w-none"
                            dangerouslySetInnerHTML={{ __html: project.description }}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {project.pictures.map((picture: string, index: number) => (
                            <div 
                                key={index} 
                                className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                <Image
                                    src={picture}
                                    alt={`Project image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </Paper>
            </div>
        </div>
    );
};

// New helper component for detail items
const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <Typography className="text-gray-600 font-medium">{label}</Typography>
        <Typography className="text-xl font-semibold text-gray-800">{value}</Typography>
    </div>
);

export default Page;
