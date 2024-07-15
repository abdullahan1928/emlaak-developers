import Image from 'next/image';
import React from 'react'

const services = [
    {
        title: 'Commercial',
        description: 'Offering a wide range of commercial properties for rent and sale, catering to businesses of all sizes and industries.',
        image: 'service1.gif'
    },
    {
        title: 'Industrial',
        description: 'Providing industrial spaces for manufacturing, warehousing, and distribution to meet your operational needs.',
        image: 'service2.gif'
    },
    {
        title: 'Agricultural',
        description: 'Specializing in agricultural land and properties to support farming and agribusiness ventures.',
        image: 'service3.gif'
    },
    {
        title: 'Rent & Sale',
        description: 'Assisting clients with renting or buying properties that meet their specific requirements and budget.',
        image: 'service4.gif'
    },
    {
        title: 'Purchase',
        description: 'Guiding clients through the process of purchasing properties, ensuring a smooth and informed transaction.',
        image: 'service5.gif'
    },
    {
        title: 'Residential',
        description: 'Offering a diverse selection of residential properties, including apartments, houses, and villas.',
        image: 'service6.gif'
    },
    {
        title: 'Investment',
        description: 'Providing investment opportunities in real estate to help clients grow their wealth and secure their future.',
        image: 'service7.gif'
    },
    {
        title: 'Design Studio',
        description: 'Offering professional design services to help clients create aesthetically pleasing and functional spaces.',
        image: 'service8.gif'
    },
];


const Services = () => {
    return (
        <div className="py-12">
            <div className="container px-20 mx-auto">

                <h2 className="relative mb-12 text-3xl font-bold text-left text-gray-800 special-underline">
                    Our Services
                </h2>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
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