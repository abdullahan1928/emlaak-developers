import Link from 'next/link';
import React from 'react';

const Marketing = () => {
    const cards = [
        {
            mainHeading: "20+",
            subHeading: "Years of Trust",
            description: "Our clients trust us for over two decades of excellence in the real estate market."
        },
        {
            mainHeading: "100+",
            subHeading: "Innovative Solutions",
            description: "We bring over a hundred innovative solutions to meet the rising demands in the real estate sector."
        },
        {
            mainHeading: "50+",
            subHeading: "Diverse Portfolio",
            description: "Our diverse portfolio includes over fifty of the latest trends and initiatives in the real estate market."
        },
        {
            mainHeading: "1st",
            subHeading: "Digital Pioneers",
            description: "We were the first in Pakistan to launch digital marketing campaigns in real estate."
        }
    ];

    return (
        <div className="flex flex-wrap items-center justify-center p-8 my-12 bg-gray-100">
            <div className="flex flex-col w-full gap-4 p-4 md:w-1/2">
                <h2 className="mb-4 text-3xl font-normal text-gray-800 font-gilroy">
                    WHY TRUST US AS THE PRIME REAL ESTATE MARKETING COMPANY?
                </h2>
                <p className="mb-6 text-gray-700">
                    We have been consistently growing in the real estate market while embracing every innovation along the way to meet the rising demands within the sector. As a real estate platform, we are not shy of diversity and take the initiative to set the trends. Our client base only grew over time as we were the first in Pakistan to launch digital marketing campaigns in real estate.
                </p>
                <Link href="/contact" className='mx-auto my-6 hidden md:block'>
                    <button className="block px-8 py-4 text-xl font-normal text-center text-white uppercase transition-all duration-300 bg-black rounded-none hover:bg-primary hover:text-black">
                        Consult Us Now!
                    </button>
                </Link>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 md:w-1/2 md:grid-cols-2">
                {cards.map((card, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 transition-transform duration-300 transform bg-white shadow-lg hover:scale-105">
                        <h3 className="text-5xl font-normal text-center font-gilroy text-primary">{card.mainHeading}</h3>
                        <h4 className="text-2xl font-normal text-center text-gray-800 font-gilroy">{card.subHeading}</h4>
                        <p className="text-center text-gray-600">
                            {card.description}
                        </p>
                    </div>
                ))}
                <Link href="/contact" className='mx-auto my-6 block md:hidden'>
                    <button className="block px-8 py-4 text-xl font-normal text-center text-white uppercase transition-all duration-300 bg-black rounded-none hover:bg-primary hover:text-black">
                        Consult Us Now!
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Marketing;
