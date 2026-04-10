import {
  Facebook,
  Instagram,
  LinkedIn,
  Pinterest,
  Twitter,
  YouTube,
} from "@mui/icons-material"

export type SocialLink = {
  name: string
  href: string | undefined
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://abc.com"

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Real Estate"

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@emlaak.com"

export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+923001234567"

export const LOCATION = process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "Office # 10, Default Address"

export const MAP_LINK = process.env.NEXT_PUBLIC_MAP_LINK || "https://maps.google.com"

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    icon: Facebook,
  },
  {
    name: "Twitter",
    href: process.env.NEXT_PUBLIC_TWITTER_URL,
    icon: Twitter,
  },
  {
    name: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    icon: Instagram,
  },
  {
    name: "LinkedIn",
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    icon: LinkedIn,
  },
  {
    name: "YouTube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL,
    icon: YouTube,
  },
  {
    name: "Pinterest",
    href: process.env.NEXT_PUBLIC_PINTREST_URL,
    icon: Pinterest,
  },
].filter(link => !!link.href)

export const contact = [
  {
    name: "Head Office",
    location:
      "Office # 10, 1st Floor, Farhan Plaza, G-11 Markaz, Islamabad, 44000",
    phone: ["0333 5079002", "(051) 8744406"],
  },
  {
    name: "Regional Office",
    location:
      "Office # 1, Street # 18, Islam Nagar, Jail Road, Faisalabad, 38000",
    phone: ["0300 7560302"],
  },
];
