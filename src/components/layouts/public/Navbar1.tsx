import { emailLink, phoneNumber, socialLinks } from '@/data/social.data'
import { Email } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

const Navbar1 = () => {

    return (
        <div className="items-center justify-between hidden px-4 py-2 text-black bg-white shadow-lg md:flex">
            <div className="flex items-center space-x-4 text-lg font-extr font-futura-[800]">
                Emlaak Developers
            </div>

            <div className="flex items-center justify-center space-x-4">
                {socialLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                        <a
                            key={index}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors duration-300 transform hover:text-black hover:scale-110"
                        >
                            <Icon fontSize="medium" sx={{
                                color: 'black',
                                '&:hover': {
                                    color: '#00A97F',
                                    scale: 1.1
                                }
                            }} />
                        </a>
                    )
                })}
                <div>
                    |
                </div>

                <div className="flex items-center space-x-2">
                    <Email fontSize="medium" sx={{ "&:hover": "text-secondary" }} />
                    <a
                        href={`mailto:${emailLink}`}
                        className="font-semibold transition-colors duration-300 hover:text-secondary"
                    >
                        {emailLink}
                    </a>
                </div>
            </div>


            <Button
                className="!text-white !border !border-white !bg-black hover:!bg-primary hover:!text-black"
                variant="contained"
                href={`tel:${phoneNumber}`}
            >
                Call Now
            </Button>
        </div>
    )
}

export default Navbar1
