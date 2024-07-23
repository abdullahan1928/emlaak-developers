"use client";
import React from 'react';
import { Container } from '@mui/material';
import Link from 'next/link';
import { emailLink, location, phoneNumber, socialLinks } from '@/data/social.data';
import Image from 'next/image';
import { Email, LocationOn, Phone } from '@mui/icons-material';

const Footer: React.FC = () => {
    return (
        <footer className="text-white bg-gray-900">
            <Container className="pt-12 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="flex flex-col gap-8">
                        <Image
                            src="/logo.png"
                            alt="Emlaak Developers"
                            width={1000}
                            height={1000}
                            className="object-contain w-56 h-40"
                        />
                        <div className='flex items-center gap-2'>
                            <LocationOn className="text-xl" />
                            <span>{location}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Phone className="text-xl" />
                            <span>{phoneNumber}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Email className="text-xl" />
                            <span>{emailLink}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-4 text-xl font-bold">Quick Links</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="transition-colors duration-300 hover:text-secondary-500">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties" className="transition-colors duration-300 hover:text-secondary-500">
                                    Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="transition-colors duration-300 hover:text-secondary-500">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="transition-colors duration-300 hover:text-secondary-500">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="transition-colors duration-300 hover:text-secondary-500">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="transition-colors duration-300 hover:text-secondary-500">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-4 text-xl font-bold">Follow Us</h2>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => {
                                const Icon = link.icon
                                return (
                                    <a
                                        key={index}
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="transition-colors duration-300 transform hover:text-black hover:scale-110"
                                    >
                                        <Icon fontSize="medium" sx={{
                                            color: 'white',
                                            '&:hover': {
                                                color: '#00A97F',
                                                scale: 1.1
                                            }
                                        }} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="py-4 mt-8 text-center border-t border-gray-700">
                    <p className="text-gray-400">&copy; {new Date().getFullYear()} Emlaak Developers. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
