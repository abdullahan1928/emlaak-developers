"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { MapPin, BedDouble, Bath, Maximize2, Star } from "lucide-react";

import { IProperty } from "@/models/property.model";
import { formatPrice } from "@/lib/price";
import { ROUTES } from "@/routes";
import { SITE_NAME } from "@/data/social.data";
import Link from "next/link";

function PropertyCard({ property }: { property: IProperty }) {
    const router = useRouter();

    return (
        <div
            data-aos="fade-up"
            onClick={() => router.push(ROUTES.PUBLIC.PROPERTIES.VIEW(property.slug))}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                {property.images?.[0]?.url ? (
                    <Image
                        src={property.images[0].url}
                        alt={property.title}
                        fill
                        className="object-cover image-filter group-hover:filter-none transition-all duration-500"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                        {property.title?.[0]}
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full capitalize">
                        For {property.purpose}
                    </span>
                    {property.isFeatured && (
                        <span className="bg-primary text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Star size={10} className="fill-black" /> Featured
                        </span>
                    )}
                </div>

                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full capitalize">
                        {property.type}
                    </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 left-3">
                    <p className="text-white text-lg font-bold">
                        PKR {formatPrice(property.price)}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition">
                    {property.title}
                </h3>

                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin size={14} className="text-primary shrink-0" />
                    <span className="truncate">
                        {property.city}{property.area ? `, ${property.area}` : ""}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
                    {property.bedrooms != null && (
                        <div className="flex items-center gap-1">
                            <BedDouble size={13} />
                            <span>{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms != null && (
                        <div className="flex items-center gap-1">
                            <Bath size={13} />
                            <span>{property.bathrooms}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                        <Maximize2 size={13} />
                        <span>{property.areaSize} {property.areaUnit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
            <Skeleton className="h-56 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}

const PropertySection = () => {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        AOS.init({ duration: 1000, easing: "ease-in-out", once: true });

        const fetch = async () => {
            try {
                const res = await axios.get("/api/properties", {
                    params: { limit: 8, published: "true", sortBy: "isFeatured", order: "desc" },
                });
                setProperties(res.data.properties);
            } catch {
                setError("Failed to fetch properties.");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return (
        <section className="bg-gray-100 py-16">
            <div className="container mx-auto px-4 md:px-16">

                <h2
                    className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4"
                    data-aos="fade-up"
                >
                    Properties by {SITE_NAME}
                </h2>

                <p
                    className="text-center text-gray-500 mb-10 max-w-xl mx-auto"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    Browse our latest residential and commercial listings available for sale and rent.
                </p>

                {error && <p className="text-center text-red-500 mb-6">{error}</p>}

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <PropertyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No properties listed yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {properties.map((property) => (
                            <PropertyCard key={property._id?.toString()} property={property} />
                        ))}
                    </div>
                )}

                <div
                    className="mt-12 text-center"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <Link href={ROUTES.PUBLIC.PROPERTIES.LIST}>
                        <Button className="px-8! py-6! bg-secondary text-white hover:bg-primary rounded-full font-semibold transition-colors">
                            View All Properties
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default PropertySection;