"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';

const Navbar2: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = useCallback(() => {
        const offset = window.scrollY;
        setScrolled(offset > 50);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Properties', href: '/properties' },
        { name: 'Projects', href: '/projects' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <div className={cn(
            'flex items-center justify-around px-4 py-2 shadow-[0px 2px 4px rgba(0,0,0,0.1)] z-50 sticky -top-[2px] w-full transition-all duration-300 ease-in-out',
            {
                'bg-white text-black h-16 shadow-md': scrolled,
                'bg-black text-white h-16': !scrolled
            }
        )}>
            <div className={cn(
                'rounded-b-full flex items-center transition-all duration-300 ease-in-out',
                {
                    'bg-white mt-0 px-0 pb-0': scrolled,
                    'bg-black pb-8 px-12 mt-20': !scrolled
                }
            )}>
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Emlaak Logo"
                        width={1000}
                        height={1000}
                        priority
                        className={cn(
                            'object-contain transition-all duration-300 ease-in-out cursor-pointer',
                            {
                                'w-16 h-16': scrolled,
                                'w-20 h-20': !scrolled
                            }
                        )}
                    />
                </Link>
            </div>

            <ul className="flex items-center justify-between gap-4 space-x-8">
                {navItems.map((item, index) => (
                    <li key={index}>
                        <Link href={item.href} className="transition-colors duration-300 hover:text-secondary-500">
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar2;
