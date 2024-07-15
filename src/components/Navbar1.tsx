import { Facebook, Instagram, LinkedIn, Pinterest, Twitter, YouTube, Email } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/emlaakdevelopers',
        icon: Facebook
    },
    {
        name: 'Twitter',
        href: 'https://www.twitter.com',
        icon: Twitter
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com',
        icon: Instagram
    },
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com',
        icon: LinkedIn
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com',
        icon: YouTube
    },
    {
        name: 'Pintrest',
        href: 'https://www.pintrest.com',
        icon: Pinterest
    }
]

const Navbar1 = () => {

    return (
        <div className="flex items-center justify-between px-4 py-2 text-black bg-white shadow-lg">
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
                    <a href="mailto:abdullahan1928@gmail.com" className="font-semibold transition-colors duration-300 hover:text-secondary">
                        info@emlaakdevelopers.com
                    </a>
                </div>
            </div>


            <Button
                className="text-white bg-secondary-700 hover:bg-secondary-800"
                variant="contained"
                href="tel:+923111111111"
            >
                Call Now
            </Button>
        </div>
    )
}

export default Navbar1
