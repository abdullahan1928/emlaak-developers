import { Button } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const Welcome = () => {
    return (
        <div className="flex items-center justify-center gap-48 pt-12 my-16">
            <div>
                <Image
                    src="/logo.png"
                    alt="Picture of the author"
                    width={1000}
                    height={1000}
                    className="w-48 h-48"
                />
            </div>
            <div className="flex flex-col w-1/2 gap-6 space-y-4">
                <h3 className="text-3xl font-normal font-gilroy">
                    Welcome to Emlaak Developers!
                </h3>
                <p className="text-[#7A7A7A] font-medium font-gilroy">
                    Islamabad&apos;s best Real Estate Company which is also present in Faisalabad. Having more than 18 years of experience, we have achieved success beyond the limitations of our own goals and expectations.
                    <br />
                    <br />
                    Proud to have served a wide array of investors and clients in helping to achieve their investment goals and meet their desired life standards, we have built an outstanding track record of digital marketing of the most significant housing projects in the country.
                    <br />
                    <br />
                    Emlaak Developers is now expanding into the real estate development zone and spreading its projects across prime locations in Islamabad.
                </p>
                <Button
                    className="!text-white !border !border-white !bg-black hover:!bg-primary hover:!text-black w-1/3 !rounded-none"
                    variant="contained"
                >
                    Call Now
                </Button>
            </div>

        </div>
    )
}

export default Welcome