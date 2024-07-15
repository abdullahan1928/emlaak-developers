"use client";
import { ArrowRightAltOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { heroItems } from '@/data/hero-data';
import { setupEventListeners } from '@/helper/hero';

interface CarouselItemProps {
    image: string;
    name: string;
    desc1: string;
    desc2: string;
    buttonText: string;
}

const CarouselItem = (props: CarouselItemProps) => (
    <div className="relative block h-[85vh]">
        <Image
            src={props.image}
            alt="Carousel Image"
            width={2000}
            height={2000}
            className="absolute object-fit h-[85vh] w-full z-[-1] align-middle inline-block"
        />

        <div className="static flex items-stretch justify-between h-[85vh] text-white content">
            <div className="bg-[#000000b3] flex justify-end h-full px-6 items-center">
                <div className="flex flex-col w-full gap-4 lg:max-w-xl">
                    <h1 className="font-futura mx-0 text-[21px] [line-height:34px] uppercase [letter-spacing:.06em] main-content">
                        <span className="text-3xl text-primary title">{props.name}</span>  {props.desc1}
                    </h1>
                    <p className="mt-5 desc">
                        {props.desc2}
                    </p>

                    <Button
                        variant="contained"
                        className="relative py-[0.8em] px-[1.7em] overflow-hidden transition-all duration-1000 ease-in-out transform bg-transparent cursor-pointer mt-7 bg-secondary border-secondary text-secondary font-medium hover:scale-110 hero-btn active:scale-[0.98] active:brightness-[0.8] w-1/3 btn"
                    >
                        {props.buttonText}
                        <ArrowRightAltOutlined fontSize="large" className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

const Hero: React.FC = () => {
    const nextDom = useRef<HTMLButtonElement | null>(null);
    const prevDom = useRef<HTMLButtonElement | null>(null);
    const carouselDom = useRef<HTMLDivElement | null>(null);
    const runNextAuto = useRef<NodeJS.Timeout | null>(null);
    const runTimeOut = useRef<NodeJS.Timeout | null>(null);
    const timeRunning = 3000;
    const timeAutoNext = 100000;

    useEffect(() => {
        const currentNextDom = nextDom.current;
        const currentPrevDom = prevDom.current;
        const currentCarouselDom = carouselDom.current;

        if (currentNextDom && currentPrevDom && currentCarouselDom) {
            setupEventListeners(currentCarouselDom, currentNextDom, currentPrevDom, timeAutoNext, runNextAuto, runTimeOut);
        }

        return () => {
            if (currentCarouselDom && currentNextDom && currentPrevDom) {
                setupEventListeners(currentCarouselDom, currentNextDom, currentPrevDom, timeAutoNext, runNextAuto, runTimeOut)();
            }
        };
    }, [timeAutoNext]);

    return (
        <div className='carousel' ref={carouselDom}>
            <div className="time"></div>

            <div className="list">
                {heroItems.map((item, index) => (
                    <div key={index} className="item">
                        <CarouselItem
                            image={item.image}
                            name={item.name}
                            desc1={item.desc1}
                            desc2={item.desc2}
                            buttonText={item.buttonText}
                        />
                    </div>
                ))}
            </div>
            <div className="thumbnail">
                {heroItems.map((item, index) => (
                    <div key={index} className="item">
                        <Image alt="" className='w-full h-full' width={1000} height={1000} src={item.image} />
                        <div className="content">
                            <div>{item.name}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="arrows">
                <button id="prev" ref={prevDom}>&lt;</button>
                <button id="next" ref={nextDom}>&gt;</button>
            </div>
        </div>
    );
};

export default Hero;