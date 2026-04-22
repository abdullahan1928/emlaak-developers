"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Phone,
  MessageCircle,
  CheckCircle2,
  Home,
  Building2,
  Star,
  X,
} from "lucide-react";

import { IProperty } from "@/models/property.model";
import { formatPrice } from "@/lib/price";
import { getMapSrc } from "@/lib/map";
import { CONTACT_PHONE } from "@/data/social.data";

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const [property, setProperty] = useState<IProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!slug) return;
    axios
      .get(`/api/properties/slug/${slug}`)
      .then((res) => {
        setProperty(res.data);
        setActiveImage(res.data.images?.[0]?.url || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <Skeleton className="h-[60vh] w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Property not found</h2>
          <p className="text-gray-500 mt-2">This property may have been removed or is no longer available.</p>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the property: ${property.title} (${window?.location?.href})`
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO IMAGE */}
      <section className="relative h-[60vh] bg-black overflow-hidden">
        {activeImage && (
          <Image
            src={activeImage}
            alt={property.title}
            fill
            className="object-cover opacity-90 cursor-zoom-in"
            onClick={() => setLightbox(true)}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full capitalize">
                For {property.purpose}
              </span>
              <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full capitalize">
                {property.type}
              </span>
              {property.isFeatured && (
                <span className="bg-primary text-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-black" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{property.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-white/80">
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* THUMBNAILS */}
      {property.images?.length > 1 && (
        <div className="bg-black/80 py-3">
          <div className="max-w-7xl mx-auto px-6 flex gap-3 overflow-x-auto">
            {property.images.map((img, i) => (
              <div
                key={i}
                onClick={() => { setActiveImage(img.url); setActiveIndex(i); }}
                className={`relative w-20 h-16 rounded-lg overflow-hidden cursor-pointer shrink-0 transition ${activeIndex === i
                    ? "ring-2 ring-primary"
                    : "opacity-50 hover:opacity-80"
                  }`}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* Price + key stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-secondary">
                  PKR {formatPrice(property.price)}
                </p>
                {property.isNegotiable && (
                  <p className="text-sm text-gray-500 mt-1">Price is negotiable</p>
                )}
              </div>
              <span className={`text-sm px-3 py-1.5 rounded-full font-medium capitalize ${property.status === "available"
                  ? "bg-green-100 text-green-700"
                  : property.status === "sold"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                {property.status}
              </span>
            </div>

            <Separator className="my-5" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl">
                <Maximize2 size={20} className="text-primary" />
                <span className="font-semibold text-sm">{property.areaSize} {property.areaUnit}</span>
                <span className="text-xs text-gray-500">Area</span>
              </div>

              {property.bedrooms != null && (
                <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl">
                  <BedDouble size={20} className="text-primary" />
                  <span className="font-semibold text-sm">{property.bedrooms}</span>
                  <span className="text-xs text-gray-500">Bedrooms</span>
                </div>
              )}

              {property.bathrooms != null && (
                <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl">
                  <Bath size={20} className="text-primary" />
                  <span className="font-semibold text-sm">{property.bathrooms}</span>
                  <span className="text-xs text-gray-500">Bathrooms</span>
                </div>
              )}

              {property.floors != null && (
                <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl">
                  <Building2 size={20} className="text-primary" />
                  <span className="font-semibold text-sm">{property.floors}</span>
                  <span className="text-xs text-gray-500">Floors</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && property.description !== "<p><br></p>" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">About this Property</h2>
              <div
                className="prose prose-neutral max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>
          )}

          {/* Features */}
          {property.features?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="flex items-start gap-2 text-gray-600 mb-4">
              <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
              <p>{property.location}</p>
            </div>
            {property.mapUrl && (
              <div className="rounded-xl overflow-hidden border">
                <iframe
                  src={getMapSrc(property.mapUrl)}
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <div className="sticky top-6 space-y-4">

            {/* Contact card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-5">
              <h3 className="text-lg font-semibold">Interested in this property?</h3>

              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center justify-center gap-2 w-full bg-secondary text-white py-3 rounded-xl font-medium hover:bg-secondary/90 transition"
              >
                <Phone size={18} />
                Call Now
              </a>

              <a
                href={`https://wa.me/${CONTACT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>

            {/* Property summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-base font-semibold mb-4">Property Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Type", value: property.type },
                  { label: "Purpose", value: `For ${property.purpose}` },
                  { label: "City", value: property.city },
                  { label: "Area", value: property.area || "—" },
                  { label: "Size", value: `${property.areaSize} ${property.areaUnit}` },
                  property.bedrooms != null && { label: "Bedrooms", value: property.bedrooms },
                  property.bathrooms != null && { label: "Bathrooms", value: property.bathrooms },
                  property.furnishing && { label: "Furnishing", value: property.furnishing },
                  property.floors != null && { label: "Floors", value: property.floors },
                ]
                  .filter(Boolean)
                  .map((item: any) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium capitalize">{item.value}</span>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-5 right-5 text-white hover:text-primary transition"
          >
            <X size={30} />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh] px-4">
            <Image
              src={property.images[activeIndex]?.url || activeImage}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}