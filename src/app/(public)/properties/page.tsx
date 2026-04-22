"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Star,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

import {
  PropertyPurpose,
  PropertyType,
} from "@/enums/property.enum";
import { IProperty } from "@/models/property.model";
import { formatPrice } from "@/lib/price";
import { ROUTES } from "@/routes";
import { SITE_NAME } from "@/data/social.data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Filters {
  search: string;
  purpose: string;
  type: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  sort: string;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  purpose: "",
  type: "all",
  city: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "any",
  sort: "createdAt_desc",
};

const PURPOSE_TABS = [
  { label: "All", value: "" },
  { label: "For Sale", value: PropertyPurpose.SALE },
  { label: "For Rent", value: PropertyPurpose.RENT },
];

const CITIES = [
  "Islamabad", "Rawalpindi", "Lahore", "Karachi",
  "Faisalabad", "Multan", "Peshawar", "Quetta",
];

// ─── Property Card ────────────────────────────────────────────────────────────

function PropertyCard({ property, index }: { property: IProperty; index: number }) {
  const router = useRouter();

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={Math.min(index * 60, 300)}
      onClick={() => router.push(ROUTES.PUBLIC.PROPERTIES.VIEW(property.slug))}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-gray-100"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {property.images?.[0]?.url ? (
          <Image
            src={property.images[0].url}
            alt={property.title}
            fill
            className="object-cover image-filter group-hover:filter-none group-hover:scale-105 transition-all duration-500"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-300">
            {property.title?.[0]}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="bg-secondary text-white text-[11px] px-2.5 py-1 rounded-full capitalize font-medium">
            For {property.purpose}
          </span>
          {property.isFeatured && (
            <span className="bg-primary text-black text-[11px] px-2 py-1 rounded-full flex items-center gap-1 font-medium">
              <Star size={9} className="fill-black" /> Featured
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur text-gray-700 text-[11px] px-2.5 py-1 rounded-full capitalize">
            {property.type}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-lg font-bold leading-tight">
            PKR {formatPrice(property.price)}
            {property.isNegotiable && (
              <span className="text-[11px] font-normal ml-1.5 text-white/70">Negotiable</span>
            )}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <MapPin size={12} className="text-primary shrink-0" />
          <span className="truncate">
            {property.city}{property.area ? `, ${property.area}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={12} /> {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={12} /> {property.bathrooms} Bath
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Maximize2 size={12} /> {property.areaSize} {property.areaUnit}
          </span>
        </div>
      </div>
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <Skeleton className="h-52 w-full" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full mt-2" />
      </div>
    </div>
  );
}

// ─── Active filter pills ──────────────────────────────────────────────────────

function ActiveFilters({
  filters,
  onClear,
}: {
  filters: Filters;
  onClear: (key: keyof Filters) => void;
}) {
  const pills: { key: keyof Filters; label: string }[] = [];

  if (filters.purpose) pills.push({ key: "purpose", label: `For ${filters.purpose}` });
  if (filters.type !== "all") pills.push({ key: "type", label: filters.type });
  if (filters.city) pills.push({ key: "city", label: filters.city });
  if (filters.bedrooms !== "any") pills.push({ key: "bedrooms", label: `${filters.bedrooms}+ beds` });
  if (filters.minPrice) pills.push({ key: "minPrice", label: `Min PKR ${formatPrice(Number(filters.minPrice))}` });
  if (filters.maxPrice) pills.push({ key: "maxPrice", label: `Max PKR ${formatPrice(Number(filters.maxPrice))}` });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-6 pb-3 max-w-7xl mx-auto">
      {pills.map(({ key, label }) => (
        <Badge
          key={key}
          variant="outline"
          className="flex items-center gap-1.5 text-xs py-1 px-3 cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition"
          onClick={() => onClear(key)}
        >
          {label} <X size={11} />
        </Badge>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PropertiesPage() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 9;

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilter = (key: keyof Filters) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_FILTERS[key] }));
    setPage(1);
  };

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const hasActiveFilters =
    filters.purpose !== DEFAULT_FILTERS.purpose ||
    filters.type !== DEFAULT_FILTERS.type ||
    filters.city !== DEFAULT_FILTERS.city ||
    filters.bedrooms !== DEFAULT_FILTERS.bedrooms ||
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice ||
    filters.search !== DEFAULT_FILTERS.search;

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, order] = filters.sort.split("_");
      const res = await axios.get("/api/properties", {
        params: {
          page,
          limit,
          search: filters.search,
          purpose: filters.purpose,
          type: filters.type === "all" ? "" : filters.type,
          city: filters.city,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.bedrooms === "any" ? "" : filters.bedrooms,
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
  }, [page, filters]);

  useEffect(() => {
    const t = setTimeout(fetchProperties, 250);
    return () => clearTimeout(t);
  }, [fetchProperties]);

  const totalPages = Math.ceil(total / limit);

  // Build smart page numbers: always show 1, last, and ±1 around current
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ── Hero ── */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/images/properties/property.jpg"
          alt="Properties"
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1
            data-aos="fade-up"
            className="text-4xl md:text-6xl font-bold text-white tracking-tight"
          >
            Find Your Property
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="text-white/70 mt-3 max-w-xl text-base md:text-lg"
          >
            {total > 0
              ? `${total} properties listed by ${SITE_NAME}`
              : `Premium listings by ${SITE_NAME}`}
          </p>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 pt-3">

          {/* Row 1 */}
          <div className="flex flex-wrap gap-3 items-center mb-3">

            {/* Purpose tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-full">
              {PURPOSE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter("purpose", tab.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filters.purpose === tab.value
                      ? "bg-secondary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, city, or area..."
                className="pl-9 bg-gray-50 border-gray-200"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
              {filters.search && (
                <button
                  onClick={() => setFilter("search", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <Select value={filters.sort} onValueChange={(v) => setFilter("sort", v)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="isFeatured_desc">Featured First</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced toggle */}
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
                showAdvanced || hasActiveFilters
                  ? "border-secondary bg-secondary/5 text-secondary"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              />
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-red-500 transition underline underline-offset-2"
              >
                Clear all
              </button>
            )}

            <span className="text-sm text-gray-400 ml-auto hidden md:block">
              {total} result{total !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Row 2: Advanced filters */}
          {showAdvanced && (
            <div className="pb-3 pt-1 flex flex-wrap gap-3 border-t border-gray-100">

              <Select value={filters.type} onValueChange={(v) => setFilter("type", v)}>
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

              <Select value={filters.city} onValueChange={(v) => setFilter("city", v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Any City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any City</SelectItem>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.bedrooms} onValueChange={(v) => setFilter("bedrooms", v)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Beds</SelectItem>
                  {["1", "2", "3", "4", "5", "6"].map((n) => (
                    <SelectItem key={n} value={n}>{n}+ Beds</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Min Price (PKR)"
                type="number"
                className="w-44"
                value={filters.minPrice}
                onChange={(e) => setFilter("minPrice", e.target.value)}
              />

              <Input
                placeholder="Max Price (PKR)"
                type="number"
                className="w-44"
                value={filters.maxPrice}
                onChange={(e) => setFilter("maxPrice", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Active filter pills */}
        <ActiveFilters filters={filters} onClear={clearFilter} />
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <p className="text-sm text-gray-500 mb-6 md:hidden">
          {total} result{total !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏘️</div>
            <p className="text-lg font-semibold text-gray-700">No properties found</p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters or{" "}
              <button
                onClick={clearAll}
                className="text-primary underline underline-offset-2"
              >
                clear all
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, i) => (
              <PropertyCard
                key={property._id?.toString()}
                property={property}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-14">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      page === p
                        ? "bg-secondary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}