import Services from '@/components/home/services'
import React from 'react'
import Image from 'next/image';

const page = () => {
    return (
        <>
        <div className="relative mb-4 w-full h-[40vh]">
          <Image
            src="/images/services/service.jpg"
            alt="Projects"
            width={1920}
            height={1080}
            className="w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <h1 className="text-5xl font-bold text-white">Emlaak Developers</h1>
            <p className="mt-2 text-lg text-white">Building Dreams, Creating Futures</p>
          </div>
        </div>

            <Services />
        </>
    )
}

export default page