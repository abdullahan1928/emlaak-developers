"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { navItems } from '@/data/nav.data';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';
import { phoneNumber } from '@/data/social.data';

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

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setMenuOpen(open);
    };

    return (
        <div className={cn(
            'flex items-center justify-between md:justify-around px-4 shadow-[0px 2px 4px rgba(0,0,0,0.1)] z-50 sticky -top-[2px] w-full transition-all duration-300 ease-in-out',
            scrolled ? 'bg-white text-black h-16 shadow-md' : 'bg-black text-white h-16'
        )}>

            <div className={cn(
                'rounded-b-full items-center transition-all duration-300 ease-in-out hidden md:flex',
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

            <Link href="/" className='flex md:hidden'>
                <Image
                    src="/logo.png"
                    alt="Emlaak Logo"
                    width={1000}
                    height={1000}
                    priority
                    className={cn(
                        'object-contain w-16 h-16 transition-all duration-300 ease-in-out cursor-pointer',
                    )}
                />
            </Link>

            <ul className="items-center justify-between hidden space-x-8 text-center md:flex">
                {navItems.map((item, index) => (
                    <Link
                        href={item.href}
                        key={index} className={cn(
                            'py-[5px] px-4 hover:bg-primary hover:text-black',
                            item.href === '/' ?
                                pathname === item.href && !scrolled ? 'bg-primary text-black py-[5px] px-4' :
                                    pathname === item.href && scrolled ? 'bg-black text-white py-[5px] px-4' :
                                        '' :
                                pathname.startsWith(item.href) && !scrolled ? 'bg-primary text-black py-[5px] px-4' :
                                    pathname.startsWith(item.href) && scrolled ? 'bg-black text-white py-[5px] px-4' : ''
                        )}
                    >
                        {item.name}
                    </Link>
                ))}
                <Button
                    className={cn(
                        scrolled ? "!block" : "!hidden",
                        "hover:!text-white !border !border-white hover:!bg-black !bg-primary !text-black !rounded-none"
                    )}
                    variant="contained"
                    href={`tel:${phoneNumber}`}
                >
                    Call Now
                </Button>
            </ul>


            <div className="flex items-center space-x-4 md:hidden">
                <MenuIcon
                    fontSize="large"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="cursor-pointer"
                />
            </div>

            <Drawer
                anchor="right"
                open={menuOpen}
                onClose={toggleDrawer(false)}
            >
                <div
                    className="w-[80lvw]"
                    role="presentation"
                >
                    <div className="flex items-center justify-between px-4 py-2 bg-primary">
                        <h2 className="font-semibold text-white">Menu</h2>
                        <Close
                            onClick={toggleDrawer(false)}
                            sx={{
                                color: 'white',
                                cursor: 'pointer',
                                border: '2px solid white',
                                borderRadius: '50%',
                            }}
                            fontSize="small"
                        />
                    </div>

                    <Divider />

                    <List sx={{
                        padding: '10px',
                    }}>
                        {navItems.map((item, index) => (
                            <ListItem
                                key={index}
                                component="a"
                                href={item.href}
                                className={cn(
                                    'dotted-border !py-3',
                                    item.href === '/' ?
                                        pathname === item.href ? 'border-l-2 border-black text-black' : '' :
                                        pathname.startsWith(item.href) ? 'border-l-2 border-black text-black' : ''
                                )}
                            >
                                <p className="font-semibold text-black">
                                    {item.name}
                                </p>
                            </ListItem>
                        ))}
                        <Button
                            className="w-full !mt-8 !text-white border !border-white !bg-black hover:!bg-white hover:!text-black !rounded-none"
                            variant="contained"
                            href={`tel:${phoneNumber}`}
                        >
                            Call Now
                        </Button>
                    </List>

                </div>
            </Drawer>
        </div >
    );
};

export default Navbar2;
