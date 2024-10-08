"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IProject } from '@/interfaces/project';
import Image from 'next/image';
import ProjectForm from '@/components/projects/ProjectForm';
import ProjectCards from '@/components/projects/ProjectCards';
import Head from 'next/head';

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
            <Head>
                <title>Our Projects - Emlaak Developers</title>
                <meta name="description" content="Explore the various projects completed by Emlaak Developers, including residential, commercial, and industrial developments. Building dreams and creating futures with excellence." />
                <meta name="keywords" content="projects, Emlaak Developers, residential, commercial, industrial, developments" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://yourwebsite.com/projects" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Our Projects - Emlaak Developers",
                            "description": "Explore the various projects completed by Emlaak Developers, including residential, commercial, and industrial developments.",
                            "url": "https://yourwebsite.com/projects",
                        }),
                    }}
                />
            </Head>

            <div className="relative mb-4 w-full h-[40vh]">
                <Image
                    src="/images/project/project2.jpg"
                    alt="Projects overview showing various developments"
                    layout="fill"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                    <h1 className="text-5xl font-bold text-white text-center">Emlaak Developers</h1>
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
