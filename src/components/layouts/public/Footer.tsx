"use client";
import React, { useEffect, useState } from 'react';
import { Container, CircularProgress } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';
import { emailLink, location, phoneNumber, socialLinks, mapLocation } from '@/data/social.data';
import Image from 'next/image';
import { Email, LocationOn, Phone } from '@mui/icons-material';
import { IProject } from '@/interfaces/project';

const Footer: React.FC = () => {
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

    const quickLinks = [
        { title: 'Home', href: '/' },
        { title: 'Properties', href: '/properties' },
        { title: 'Projects', href: '/projects' },
        { title: 'About Us', href: '/about' },
        { title: 'Services', href: '/services' },
        { title: 'Contact', href: '/contact' },
    ];

    return (
        <footer className="text-white bg-gray-900 pt-10">
            <Container className="mx-auto">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div className="flex flex-col gap-6">
                        <Image
                            src="/logo.png"
                            alt="Emlaak Developers"
                            width={150}
                            height={150}
                            className="object-contain w-48 h-32"
                        />
                        <div
                            className='flex items-center gap-2 cursor-pointer'
                            onClick={() => window.open(mapLocation, '_blank')}
                        >
                            <LocationOn className="text-2xl text-secondary-500" />
                            <span className="text-lg text-gray-300 hover:text-primary">{location}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <a href={`tel:${phoneNumber}`} className="flex items-center gap-2">
                                <Phone className="text-2xl text-secondary-500" />
                                <span className="text-lg text-gray-300 hover:text-primary">{phoneNumber}</span>
                            </a>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Email className="text-2xl text-secondary-500" />
                            <a
                                href={`mailto:${emailLink}`}
                                className="text-lg text-gray-300 hover:text-primary"
                            >
                                {emailLink}
                            </a>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-6 text-xl font-bold tracking-wider uppercase text-secondary-500 border-b border-gray-600 pb-2">Quick Links</h2>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="transition-all text-gray-300 hover:text-secondary-500">
                                        - {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-6 text-xl font-bold tracking-wider uppercase text-secondary-500 border-b border-gray-600 pb-2">Projects</h2>
                        {loading ? (
                            <div className="flex items-center justify-center h-20">
                                <CircularProgress color="inherit" />
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : (
                            <ul className="space-y-3">
                                {projects.map((project) => (
                                    <li key={project._id}>
                                        <Link href={`/projects/${project._id}`} className="transition-all text-gray-300 hover:text-secondary-500">
                                            - {project.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <h2 className="mt-8 mb-4 text-xl font-bold tracking-wider uppercase text-secondary-500 border-b border-gray-600 pb-2">Follow Us</h2>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={index}
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="transition-transform duration-300 transform hover:text-secondary-500 hover:scale-105"
                                    >
                                        <Icon fontSize="large" sx={{
                                            color: 'white',
                                            '&:hover': {
                                                color: '#00A97F',
                                                transform: 'scale(1.15)',
                                            }
                                        }} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="py-6 mt-12 text-center border-t border-gray-700">
                    <p className="text-gray-500">&copy; {new Date().getFullYear()}{' '}
                        Emlaak Developers. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
