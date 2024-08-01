import { about } from '@/data/about.data';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import React from 'react';

const Page = () => {
    return (
        <>
            <div className="relative mb-4 w-full h-[40vh]">
                <Image
                    src="/images/about/team.jpg"
                    alt="Projects"
                    width={10000}
                    height={10000}
                    className="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                    <h1 className="text-5xl font-bold text-white">Emlaak Developers</h1>
                    <p className="mt-2 text-lg text-white">Building Dreams, Creating Futures</p>
                </div>
            </div>

            <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <h3 className="mb-24 text-4xl font-bold text-center text-gray-800">
                    Our Core Team
                </h3>

                {/* <div className="mx-4 mb-16 sm:mx-8 md:mx-16 lg:mx-32">
                    <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                        Our Mission
                    </h2>
                    <p className="text-base font-semibold sm:text-lg">
                        At Emlaak Developers, our mission is to transform dreams into reality by providing top-notch real estate solutions that exceed our clients&apos; expectations. We are dedicated to delivering excellence through innovation, integrity, and a commitment to sustainable development.
                    </p>
                </div> */}

                <div className="flex flex-col gap-10 mx-4 sm:gap-16 md:gap-20 sm:mx-8 md:mx-16 lg:mx-32">
                    {about.map((item, index) => (
                        <div key={index} className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                            <div
                                className={cn(
                                    "flex flex-col sm:flex-row gap-4 sm:gap-8 border border-gray-200 shadow-md",
                                    // index % 2 === 0 ? 'flex-row' : 'flex-row-reverse',
                                    "tilt-right"
                                )}
                            >
                                <Image
                                    src={`/images/about/${item.image}`}
                                    alt={item.name}
                                    width={500}
                                    height={500}
                                    className="w-full h-auto sm:w-48"
                                />
                                <div className="flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-0">
                                    <h2 className="mt-2 text-2xl font-bold sm:mt-4 sm:text-3xl">
                                        {item.name}
                                    </h2>
                                    <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                                        {item.designation}
                                    </h3>
                                    <p className="mt-2 mb-4 text-xs text-gray-800 sm:text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
}

export default Page;
