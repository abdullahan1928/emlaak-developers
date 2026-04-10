"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ROUTES } from "@/routes";
import { IProject } from "@/models/project.model";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
    property: IProject;
}

const formatPrice = (startingPrice: string): string => {
    const cleanPrice = startingPrice.toString().replace(/,/g, "");
    const million = 1000000;
    const formattedPrice = (parseInt(cleanPrice) / million).toFixed(1);
    return `${formattedPrice}M`;
};

const PropertyCard = ({ property: project }: PropertyCardProps) => {
    const router = useRouter();

    const handleCardClick = (id: string | undefined) => {
        router.push(ROUTES.PUBLIC.PROJECTS.VIEW(id!));
    }

    return (
        <div
            data-aos="fade-up"
            className="relative overflow-hidden bg-white rounded-xl shadow-lg cursor-pointer group hover:shadow-2xl transition-all duration-500"
        >
            {/* Image */}
            <div className="relative w-full h-80 overflow-hidden rounded-t-xl">
                {project?.images?.[0]?.url ? (
                    <Image
                        src={project.images[0].url}
                        alt={project?.title || "Project image"}
                        fill
                        sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 25vw"
                        className="object-cover image-filter"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-5xl font-bold text-gray-600">
                            {project?.title
                                ? project.title
                                    .split(" ")
                                    .map(word => word[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()
                                : "?"}
                        </span>
                    </div>
                )}
                <div className="absolute bottom-0 w-full p-4 bg-linear-to-t from-black/80 to-transparent">
                    <h2 className="text-xl font-semibold text-white uppercase">
                        {project?.title}
                    </h2>
                    <div className="flex items-center mt-1 text-gray-300 text-sm">
                        <MapPin className="mr-1" fontSize="small" /> {project?.location}
                    </div>
                </div>
                <span className="absolute top-0 right-0 px-3 py-1 font-semibold text-black bg-primary rounded-bl-md text-sm uppercase">
                    {project?.category}
                </span>
            </div>

            {/* Price */}
            <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 uppercase">
                    Starting from <strong>Rs. {formatPrice(project?.startingPrice.toString())}</strong>
                </span>
            </div>

            {/* CTA */}
            <Button
                onClick={() => handleCardClick(project._id?.toString())}
                className="w-full py-2 text-white bg-secondary rounded-b-xl font-semibold hover:bg-primary transition-colors"
            >
                View Detail
            </Button>
        </div>
    );
};

export default PropertyCard;