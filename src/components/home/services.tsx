import { services } from '@/data/services.data';
import Image from 'next/image';
import React from 'react'

const Services = () => {
    return (
        <div className="py-12">
            <div className="container px-8 mx-auto md:px-20">

                <h2 className="relative mb-12 text-3xl font-bold text-gray-800 md:text-left special-underline">
                    Our Services
                </h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="relative duration-500 bg-white border-t-8 rounded-lg shadow-lg cursor-pointer hover:shadow-xl border-t-secondary hover:border-t-[32px] transition-all hover:bg-secondary py-1 service-card"
                        >

                            <div className="absolute inset-x-0 items-center justify-center hidden font-bold text-white uppercase transition-all duration-500 -top-7 upper-service-title">
                                {service.title}
                            </div>

                            <div className='flex justify-center w-full bg-white service-image'>
                                <Image
                                    src={`/images/services/${service.image}`}
                                    alt={service.title}
                                    width={1000}
                                    height={1000}
                                    className="w-1/2 h-auto rounded-t-lg"
                                    unoptimized={true}
                                />
                            </div>

                            <div className="flex flex-col items-center px-6 py-2 mt-4 text-center text-black rounded-b-lg">
                                <h3 className="w-full font-semibold text-white uppercase service-title bg-secondary">
                                    {service.title}
                                </h3>
                                <p className="mt-2 text-sm service-description">
                                    {service.description}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default Services