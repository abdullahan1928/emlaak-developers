"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { Search, MapPin, BedDouble, Bath, Maximize2, Star } from "lucide-react";

import { PropertyPurpose, PropertyType } from "@/enums/property.enum";
import { IProperty } from "@/models/property.model";
import { formatPrice } from "@/lib/price";
import { ROUTES } from "@/routes";
import { SITE_NAME } from "@/data/social.data";

const PURPOSE_TABS = [
  { label: "All", value: "" },
  { label: "For Sale", value: PropertyPurpose.SALE },
  { label: "For Rent", value: PropertyPurpose.RENT },
];

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
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-400">
            {property.title?.[0]}
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

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

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white text-xl font-bold">
            PKR {formatPrice(property.price)}
            {property.isNegotiable && (
              <span className="text-xs font-normal ml-1 opacity-80">· Negotiable</span>
            )}
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
          <span className="truncate">{property.city}{property.area ? `, ${property.area}` : ""}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-gray-600 pt-1 border-t">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1">
              <BedDouble size={14} />
              <span>{property.bedrooms} Bed</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1">
              <Bath size={14} />
              <span>{property.bathrooms} Bath</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Maximize2 size={14} />
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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const [sortBy, order] = sort.split("_");
      const res = await axios.get("/api/properties", {
        params: {
          page,
          limit,
          search,
          purpose,
          type: type === "all" ? "" : type,
          sortBy,
          order,
          published: "true",
        },
      });
      setProperties(res.data.properties);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchProperties, 300);
    return () => clearTimeout(t);
  }, [page, search, purpose, type, sort]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className="bg-secondary text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Find Your Perfect Property
          </h1>
          <p className="mt-4 text-white/70 text-lg">
            Browse {total > 0 ? `${total}+` : ""} properties listed by {SITE_NAME}
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">

          {/* Purpose tabs */}
          <div className="flex gap-1 mb-3">
            {PURPOSE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setPurpose(tab.value); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${purpose === tab.value
                    ? "bg-secondary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="City, area, or keyword..."
                className="pl-9 bg-gray-50"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* Type */}
            <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(PropertyType).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
                <SelectItem value="isFeatured_desc">Featured First</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm text-gray-500 ml-auto">
              {total} propert{total === 1 ? "y" : "ies"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg font-medium">No properties found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id?.toString()} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center text-sm text-gray-500 px-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}