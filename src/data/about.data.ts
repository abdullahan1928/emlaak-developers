import { SITE_NAME } from "./social.data";

interface IAbout {
  name: string;
  designation: string;
  description: string;
  image: string;
}

export const about: IAbout[] = [
  {
    name: "Anwar ul Haq",
    designation: "Chairman",
    description: `Anwar ul Haq is the Chairman of ${SITE_NAME} and Al-Haq Developers. He is a visionary entrepreneur with a passion for real estate and a commitment to excellence. Anwar has over 20 years of experience in the real estate industry and has successfully completed numerous projects in Pakistan and abroad. He is known for his innovative approach to real estate development and his dedication to delivering high-quality projects that exceed customer expectations.`,
    image: "anwar.jpg",
  },
  {
    name: "Inam ul Haq",
    designation: "Founder & CEO",
    description: "Inam ul Haq is a dynamic leader with a strong background in real estate development and a proven track record of success. Inam is responsible for overseeing the company's operations and ensuring that all projects are completed on time and within budget.",
    image: "inam.jpg",
  },
  {
    name: "Muhammad Abdullah",
    designation: "Technical Manager",
    description: "Muhammad Abdullah is a skilled professional responsible for managing the company's technical operations, including website development and maintenance. He ensures that all digital platforms run smoothly and efficiently, supporting the company's online presence and technical infrastructure.",
    image: "abd.jpg",
  },
  {
    name: "Jawad Afzal",
    designation: "Digtial Marketer",
    description: "Jawad Afzal is a creative thinker with a passion for digital marketing and a talent for creating engaging content. Jawad is responsible for managing the company's online presence and developing innovative marketing campaigns to promote the company's projects.",
    image: "jawad.jpg",
  },
  {
    name: "Haseeb Mouaz",
    designation: "Graphic Designer",
    description: "Haseeb Mouaz is a talented artist with a passion for design and a talent for creating visually stunning graphics. Haseeb is responsible for developing the company's brand identity and creating eye-catching marketing materials to promote the company's projects.",
    image: "haseeb.jpg",
  },
];

export const INDEX_TO_HIGHLIGHT = 0

export const stats = [
  { label: "Years Experience", value: 20 },
  { label: "Projects Delivered", value: 5 },
  { label: "Happy Clients", value: 50 },
  { label: "Cities Served", value: 2 },
];