import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <Link href="/">
                <Image
                    src="/logo.png"
                    alt="Emlaak Logo"
                    width={1000}
                    height={1000}
                    priority
                    className='object-contain transition-all duration-300 ease-in-out cursor-pointer w-24'
                />
            </Link>
            <p className="text-lg">Sorry, the page youre looking for does not exist.</p>
            <Link
                href='/'
                className="px-6 py-2 mt-8 text-white border border-white bg-black hover:bg-white hover:text-black"
            >
                Go Back
            </Link>
        </div>
    );
};

export default NotFound;
