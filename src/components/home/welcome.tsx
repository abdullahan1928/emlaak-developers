import { phoneNumber } from '@/data/social.data';
import { Button } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const Welcome = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-48 md:pt-12 my-16">
            <div>
                <Image
                    src="/logo.png"
                    alt="Picture of the author"
                    width={1000}
                    height={1000}
                    className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48"
                />
            </div>
            <div className="flex flex-col w-full md:w-1/2 gap-4 md:gap-6 space-y-4 text-center md:text-left px-4 md:px-0">
                <h3 className="text-2xl sm:text-3xl font-normal font-gilroy">
                    Welcome to Emlaak Developers!
                </h3>
                <p className="text-sm sm:text-base text-[#7A7A7A] font-medium font-gilroy">
                    With over 20 years of expertise, Emlaak Developers stands as Islamabad&apos;s premier real estate company, now proudly extending its services to Faisalabad. Our dedication to excellence has propelled us beyond our own goals and expectations.
                    <br />
                    <br />
                    We take pride in having assisted a diverse range of investors and clients in achieving their investment aspirations and enhancing their lifestyle standards. Our impressive track record includes the successful digital marketing of some of the country&apos;s most significant housing projects.
                    <br />
                    <br />
                    Emlaak Developers is now poised for expansion, venturing into real estate development and establishing projects in the most sought-after locations across Islamabad.
                </p>
                <Button
                    className="!text-white !border !border-white !bg-black hover:!bg-primary hover:!text-black w-full sm:w-1/2 md:w-1/3 !rounded-none !py-3"
                    variant="contained"
                    href={`tel:${phoneNumber}`}
                >
                    Call Now
                </Button>
            </div>
        </div>
    );
}

export default Welcome;
