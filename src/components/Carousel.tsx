"use client";
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
import Image from 'next/image';
import { ArrowRightAltOutlined } from '@mui/icons-material'
import React from 'react'

const Carousels = () => {
    
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 2000,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 1024, // for large screens and down
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768, // for tablets and down
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480, // for mobile devices
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <Carousel>
            {/* <Paper> */}
            <div className="relative block h-[85vh]">
                <Image
                    src="/images/bg.webp"
                    alt="Blue World"
                    width={2000}
                    height={2000}
                    className="absolute object-fit h-[85vh] w-full z-[-1] align-middle inline-block transform-3d"
                />

                <div className="static flex items-stretch justify-between h-[85vh] text-white">
                    <div className="transform-3d bg-[#000000b3] flex justify-end w-1/2 h-full px-6 items-center">
                        <div className="flex flex-col w-full gap-4 lg:max-w-xl">
                            <h1 className="mx-0 text-[21px] [line-height:34px] uppercase [letter-spacing:.06em] font-futura">
                                <span className="text-3xl text-[#F6D957]">Emlaak Developers</span> is a multi-faceted, Pakistan-based real estate company.
                            </h1>
                            <p className="mt-5">
                                We are a third-party commercial and multi-family real estate services firm and brokerage with business lines in property management powered by Poplar Homes, investment sales, residential leasing, construction and distressed real estate services. With this collective expertise under one roof, we are unmatched in our ability to maximize the value of investment real estate.
                            </p>

                            <Button
                                variant="contained"
                                className="relative py-[0.8em] px-[1.7em] overflow-hidden transition-all duration-300 ease-in-out transform bg-transparent cursor-pointer mt-7 bg-secondary border-secondary text-secondary font-medium hover:scale-110 hero-btn active:scale-[0.98] active:brightness-[0.8] w-1/3"
                            >
                                Learn More
                                <ArrowRightAltOutlined fontSize="large" className="ml-2" />
                            </Button>

                        </div>
                    </div>
                </div>
            </div>
            {/* </Paper> */}
        </Carousel>
    );
};

export default Carousels;
