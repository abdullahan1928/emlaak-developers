import { about } from '@/data/about.data';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import React from 'react';

const Page = () => {
    return (
        <div className="py-20 mx-auto">
            <h3 className="mb-10 text-5xl font-bold text-center">
                Our Core Team
            </h3>

            <div className="mx-32 mb-16">
                <h2 className="mb-4 text-3xl font-bold">
                    Our Mission
                </h2>
                <p className="text-lg font-semibold">
                    At Emlaak Developers, our mission is to transform dreams into reality by providing top-notch real estate solutions that exceed our clients&apos; expectations. We are dedicated to delivering excellence through innovation, integrity, and a commitment to sustainable development.
                </p>
            </div>

            <div className="flex flex-col gap-20 mx-32">
                {about.map((item, index) => (
                    <div key={index} className="flex flex-col gap-0">
                        <div
                            className={cn(
                                "flex gap-8 border border-gray-200 shadow-md",
                                // index % 2 === 0 ? 'flex-row' : 'flex-row-reverse',
                                "tilt-right"
                            )}
                        >
                            <Image
                                src={`/images/about/${item.image}`}
                                alt={item.name}
                                width={1000}
                                height={1000}
                                className="w-48 h-full"
                            />
                            <div className="flex flex-col justify-center px-8">
                                <h2 className="mt-4 text-3xl font-bold">
                                    {item.name}
                                </h2>
                                <h3 className="text-base font-semibold text-gray-800">
                                    {item.designation}
                                </h3>
                                <p className="mt-2 text-sm text-gray-800">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div >
    );
}

export default Page;
