"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { CONTACT_PHONE, SITE_NAME } from '@/data/social.data';
import { ROUTES } from '@/routes';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const Navbar2: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
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
        { name: "Home", href: ROUTES.PUBLIC.HOME },
        { name: "Properties", href: ROUTES.PUBLIC.PROPERTIES.LIST },
        { name: "Projects", href: ROUTES.PUBLIC.PROJECTS.LIST },
        { name: "About Us", href: ROUTES.PUBLIC.ABOUT },
        { name: "Services", href: ROUTES.PUBLIC.SERVICES },
        { name: "Contact", href: ROUTES.PUBLIC.CONTACT },
    ];

    return (
        <div className={cn(
            'flex items-center justify-between md:justify-around px-4 shadow-[0px 2px 4px rgba(0,0,0,0.1)] z-50 sticky -top-0.5 w-full transition-all duration-300 ease-in-out',
            scrolled ? 'bg-white text-black h-16 shadow-md' : 'bg-secondary text-white h-16'
        )}>

            <div className={cn(
                'rounded-b-full items-center transition-all duration-300 ease-in-out hidden md:flex',
                scrolled ? 'bg-white mt-0 px-0 pb-0' : 'bg-secondary pb-8 px-12 mt-20'
            )}>
                <Link href={ROUTES.PUBLIC.HOME}>
                    <Image
                        src="/logo.png"
                        alt={`${SITE_NAME} Logo`}
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

            {/* Mobile Logo */}
            <Link href={ROUTES.PUBLIC.HOME} className='flex md:hidden'>
                <Image
                    src="/logo.png"
                    alt={`${SITE_NAME} Logo`}
                    width={1000}
                    height={1000}
                    priority
                    className='object-contain w-16 h-16 transition-all duration-300 ease-in-out cursor-pointer'
                />
            </Link>

            {/* Desktop Nav */}
            <ul className="items-center justify-between hidden space-x-6 text-center md:flex">
                {navItems.map((item, index) => (
                    <Link
                        href={item.href}
                        key={index}
                        className={cn(
                            'relative py-1.5 px-4 text-sm font-medium transition-all duration-300 rounded-md',
                            'hover:bg-primary hover:text-black',
                            item.href === ROUTES.PUBLIC.HOME
                                ? pathname === item.href && !scrolled
                                    ? 'bg-primary text-black'
                                    : pathname === item.href && scrolled
                                        ? 'bg-secondary text-white'
                                        : ''
                                : pathname.startsWith(item.href) && !scrolled
                                    ? 'bg-primary text-black'
                                    : pathname.startsWith(item.href) && scrolled
                                        ? 'bg-secondary text-white'
                                        : ''
                        )}
                    >
                        {item.name}
                    </Link>
                ))}

                <Button
                    className={cn(
                        scrolled ? "inline-flex" : "hidden",
                        "py-5! px-6! rounded-md border text-black hover:bg-secondary! hover:text-white transition-all duration-300 ml-6 uppercase font-medium!"
                    )}
                    asChild
                >
                    <a href={`tel:${CONTACT_PHONE}`}>Call Now</a>
                </Button>
            </ul>


            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 md:hidden">
                <Menu
                    size={28}
                    onClick={() => setMenuOpen(true)}
                    className="cursor-pointer"
                />
            </div>

            {/* Mobile Sheet (Drawer replacement) */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="right" className="w-[80lvw] p-0">

                    <SheetHeader className="flex flex-row items-center justify-between px-4 py-3 bg-primary">
                        <SheetTitle className="text-white text-base font-semibold">
                            Menu
                        </SheetTitle>
                        <SheetClose asChild>
                            <X className="text-white cursor-pointer border border-white rounded-full p-1" />
                        </SheetClose>
                    </SheetHeader>

                    <Separator />

                    <div className="p-4 space-y-2">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    'block py-3 px-2 text-sm font-semibold transition-all border-l-2',
                                    'hover:bg-muted',
                                    item.href === ROUTES.PUBLIC.HOME
                                        ? pathname === item.href
                                            ? 'border-black text-black'
                                            : 'border-transparent'
                                        : pathname.startsWith(item.href)
                                            ? 'border-black text-black'
                                            : 'border-transparent'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <Button
                            className="w-full mt-6 rounded-md bg-secondary text-white hover:bg-white hover:text-black border border-black transition-all"
                            asChild
                        >
                            <a href={`tel:${CONTACT_PHONE}`}>Call Now</a>
                        </Button>
                    </div>

                </SheetContent>
            </Sheet>

        </div>
    );
};

export default Navbar2;