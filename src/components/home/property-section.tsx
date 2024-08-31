"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { IProject } from '@/interfaces/project';
import { TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Pagination, SelectChangeEvent } from '@mui/material';
import { Search, LocationOn, FilterList, Sort } from '@mui/icons-material';
import ProjectCard from '@/components/projects/ProjectCard';
import PropertyCard from '../projects/PropertyCard';

const PropertySection: React.FC = () => {
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
            <div className="container p-4 mx-auto">
                <h1 className="mt-8 text-3xl font-normal text-center uppercase font-gilroy">
                    Properties by Emlaak Developers
                </h1>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {projects.slice(0, 8).map((project) => (
                                <PropertyCard key={project._id} project={project} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default PropertySection;
