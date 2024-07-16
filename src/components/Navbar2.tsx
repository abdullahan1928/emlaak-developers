"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

const Navbar2: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

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
            'flex items-center justify-around px-4 shadow-[0px 2px 4px rgba(0,0,0,0.1)] z-50 sticky -top-[2px] w-full transition-all duration-300 ease-in-out',
            scrolled ? 'bg-white text-black h-16 shadow-md' : 'bg-black text-white h-16'
        )}>
            <div className={cn(
                'rounded-b-full flex items-center transition-all duration-300 ease-in-out',
                scrolled ? 'bg-white mt-0 px-0 pb-0' : 'bg-black pb-8 px-12 mt-20'
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
                            scrolled ? 'w-16 h-16' : 'w-20 h-20',
                        )}
                    />
                </Link>
            </div>

            <ul className="flex items-center justify-between space-x-8 text-center">
                {navItems.map((item, index) => (
                    <Link
                        href={item.href}
                        key={index} className={cn(
                            // 'h-full flex items-center justify-center',
                            'py-[5px] px-4 hover:bg-primary hover:text-black ',
                            pathname === item.href && !scrolled ? 'bg-primary text-black py-[5px] px-4' : '',
                            pathname === item.href && scrolled ? 'bg-black text-white py-[5px] px-4' : '',
                        )}
                    >
                        {item.name}
                    </Link>
                ))}
            </ul>
        </div >
    );
};

export default Navbar2;
