"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";

import {
    MapPin,
    Calendar,
    Tag,
    Building2,
    X,
    CheckCircle2,
    Phone,
    MessageCircle,
    Download,
    PlayCircle,
    ChevronLeft,
    ChevronRight,
    Home,
    Users,
    Maximize2,
    BadgePercent,
    Clock,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { IProject } from "@/models/project.model";
import { IImage } from "@/enums/project.enum";
import { formatPrice } from "@/lib/price";
import { getMapSrc } from "@/lib/map";
import { CONTACT_PHONE, SITE_NAME } from "@/data/social.data";
import { ROUTES } from "@/routes";

const STATUS_COLORS: Record<string, string> = {
    ongoing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    upcoming: "bg-amber-100 text-amber-700",
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ProjectSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
            <Skeleton className="h-[60vh] w-full rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <Skeleton className="h-80 rounded-2xl" />
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
    const { slug } = useParams();

    const [project, setProject] = useState<IProject | undefined>();
    const [activeImage, setActiveImage] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            const res = await axios.get(`/api/projects/slug/${slug}`);
            setProject(res.data);
            setActiveImage(res.data.images?.[0]?.url || "");
        };
        fetchProject();
    }, [slug]);

    if (!project) return <ProjectSkeleton />;

    const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in the project: ${project.title} (${typeof window !== "undefined" ? window.location.href : ""})`
    );

    const goLightbox = (dir: "prev" | "next") => {
        const len = project.images.length;
        const next = dir === "next"
            ? (activeIndex + 1) % len
            : (activeIndex - 1 + len) % len;
        setActiveIndex(next);
        setActiveImage(project.images[next].url);
    };

    return (
        <div className="bg-neutral-50 min-h-screen">

            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <section className="relative h-[75vh] w-full overflow-hidden bg-black">
                {activeImage && (
                    <Image
                        src={activeImage}
                        alt={project.title}
                        fill
                        priority
                        className="object-cover opacity-85 cursor-zoom-in transition-all duration-700"
                        onClick={() => setLightboxOpen(true)}
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10 text-white">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1 rounded-full capitalize">
                            {project.category}
                        </span>
                        {project.projectStatus && (
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[project.projectStatus] || ""}`}>
                                {project.projectStatus}
                            </span>
                        )}
                        {project.developerName && (
                            <span className="text-white/60 text-sm flex items-center gap-1">
                                <Building2 size={13} /> {project.developerName}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl leading-tight">
                        {project.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 mt-4 text-white/70 text-sm">
                        {(project.city || project.location) && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-primary" />
                                {project.city}{project.location ? `, ${project.location}` : ""}
                            </span>
                        )}
                        {project.completionDate && (
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                Completion: {new Date(project.completionDate).toLocaleDateString("en-PK", { month: "long", year: "numeric" })}
                            </span>
                        )}
                        {project.totalUnits && (
                            <span className="flex items-center gap-1.5">
                                <Home size={14} />
                                {project.totalUnits} Units
                            </span>
                        )}
                    </div>

                    {/* Price */}
                    <div className="mt-5">
                        <p className="text-white/50 text-xs uppercase tracking-widest">Starting From</p>
                        <p className="text-primary text-3xl font-bold mt-1">
                            PKR {formatPrice(project.startingPrice)}
                            {project.maxPrice && (
                                <span className="text-white/40 text-xl font-normal ml-2">
                                    – PKR {formatPrice(project.maxPrice)}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── THUMBNAIL STRIP ───────────────────────────────────────────── */}
            {project.images?.length > 1 && (
                <div className="bg-black/90 py-3 px-6">
                    <div className="max-w-7xl mx-auto flex gap-3">
                        {project.images.map((img: IImage, i: number) => (
                            <div
                                key={i}
                                onClick={() => { setActiveImage(img.url); setActiveIndex(i); }}
                                className={`relative w-24 h-16 rounded-lg overflow-hidden cursor-pointer shrink-0 transition-all ${activeIndex === i ? "ring-2 ring-primary scale-105" : "opacity-50 hover:opacity-90"
                                    }`}
                            >
                                <Image src={img.url} alt="" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* ── LEFT ──────────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Quick stats strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {project.minArea && (
                            <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
                                <Maximize2 size={20} className="text-primary mx-auto mb-1" />
                                <p className="font-semibold text-sm">
                                    {project.minArea}{project.maxArea ? `–${project.maxArea}` : ""} {project.areaUnit}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">Unit Size</p>
                            </div>
                        )}
                        {project.totalUnits && (
                            <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
                                <Users size={20} className="text-primary mx-auto mb-1" />
                                <p className="font-semibold text-sm">{project.totalUnits}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Total Units</p>
                            </div>
                        )}
                        {project.completionDate && (
                            <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
                                <Calendar size={20} className="text-primary mx-auto mb-1" />
                                <p className="font-semibold text-sm">
                                    {new Date(project.completionDate).getFullYear()}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">Est. Completion</p>
                            </div>
                        )}
                        {project.paymentPlan && (
                            <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
                                <Clock size={20} className="text-primary mx-auto mb-1" />
                                <p className="font-semibold text-sm">
                                    {project.paymentPlan.installmentMonths} Months
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">Installment Plan</p>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="overview" className="flex-col">
                        <TabsList className="w-full justify-start border-b rounded-none bg-transparent gap-4 h-auto pb-0">
                            {["overview", "amenities", "payment", "location", "media"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="capitalize px-0 pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-black bg-transparent"
                                >
                                    {tab === "payment" ? "Payment Plan" : tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* OVERVIEW */}
                        <TabsContent value="overview" className="pt-8">
                            <h2 className="text-xl font-semibold mb-5">About this Project</h2>

                            <div
                                className={`text-gray-600 leading-relaxed prose prose-neutral max-w-none ${!expanded ? "max-h-[220px] overflow-hidden" : ""}`}
                                dangerouslySetInnerHTML={{ __html: project.description || "<p>No description available.</p>" }}
                            />

                            {project.description && project.description.length > 400 && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-4 text-sm text-primary underline underline-offset-2"
                                >
                                    {expanded ? "Show less" : "Read more"}
                                </button>
                            )}

                            {/* Tags */}
                            {project.tags?.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <Tag size={14} /> Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, i) => (
                                            <Badge key={i} variant="default" className="capitalize">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* AMENITIES */}
                        <TabsContent value="amenities" className="pt-8">
                            <h2 className="text-xl font-semibold mb-6">Amenities & Features</h2>

                            {project.amenities?.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {project.amenities.map((a, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border">
                                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                                            <span className="text-sm text-gray-700">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No amenities listed yet.</p>
                            )}
                        </TabsContent>

                        {/* PAYMENT PLAN */}
                        <TabsContent value="payment" className="pt-8">
                            <h2 className="text-xl font-semibold mb-6">Payment Plan</h2>

                            {project.paymentPlan ? (
                                <div className="space-y-6">
                                    {project.paymentPlan.note && (
                                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-gray-700">
                                            {project.paymentPlan.note}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                                            <BadgePercent size={22} className="text-primary mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-secondary">
                                                {project.paymentPlan.downPaymentPercent}%
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Down Payment</p>
                                        </div>

                                        <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                                            <Clock size={22} className="text-primary mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-secondary">
                                                {project.paymentPlan.installmentMonths}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Months</p>
                                        </div>

                                        {project.paymentPlan.installmentAmount && (
                                            <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                                                <p className="text-xs text-gray-400 mb-1">Monthly</p>
                                                <p className="text-lg font-bold text-secondary">
                                                    {formatPrice(project.paymentPlan.installmentAmount)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Installment</p>
                                            </div>
                                        )}

                                        {project.paymentPlan.possessionPercent && (
                                            <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                                                <p className="text-2xl font-bold text-secondary">
                                                    {project.paymentPlan.possessionPercent}%
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">On Possession</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Visual bar */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border">
                                        <p className="text-sm font-medium text-gray-600 mb-4">Payment Breakdown</p>
                                        <div className="flex rounded-full overflow-hidden h-6 text-xs font-semibold">
                                            <div
                                                className="bg-primary flex items-center justify-center text-black"
                                                style={{ width: `${project.paymentPlan.downPaymentPercent}%` }}
                                            >
                                                {project.paymentPlan.downPaymentPercent}%
                                            </div>
                                            {project.paymentPlan.possessionPercent && (
                                                <div
                                                    className="bg-secondary flex items-center justify-center text-white"
                                                    style={{ width: `${project.paymentPlan.possessionPercent}%` }}
                                                >
                                                    {project.paymentPlan.possessionPercent}%
                                                </div>
                                            )}
                                            <div className="bg-gray-200 flex-1 flex items-center justify-center text-gray-600">
                                                Installments
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mt-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary inline-block" />Down Payment</span>
                                            {project.paymentPlan.possessionPercent && (
                                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary inline-block" />On Possession</span>
                                            )}
                                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />Installments</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <BadgePercent size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No payment plan information available.</p>
                                    <p className="text-sm mt-1">Contact us for custom payment arrangements.</p>
                                </div>
                            )}
                        </TabsContent>

                        {/* LOCATION */}
                        <TabsContent value="location" className="pt-8">
                            <h2 className="text-xl font-semibold mb-5">Location</h2>

                            {(project.city || project.location) && (
                                <div className="flex items-start gap-2 text-gray-600 mb-6">
                                    <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                                    <p>{project.city}{project.location ? `, ${project.location}` : ""}</p>
                                </div>
                            )}

                            {project.mapUrl ? (
                                <div className="rounded-2xl overflow-hidden border shadow-sm">
                                    <iframe
                                        src={getMapSrc(project.mapUrl)}
                                        className="w-full h-80"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <div className="rounded-2xl border bg-gray-50 h-60 flex items-center justify-center text-gray-400 text-sm">
                                    No map available
                                </div>
                            )}
                        </TabsContent>

                        {/* MEDIA */}
                        <TabsContent value="media" className="pt-8">
                            <h2 className="text-xl font-semibold mb-6">Project Media</h2>

                            <div className="space-y-8">
                                {/* Video */}
                                {project.videoUrl ? (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                            <PlayCircle size={15} /> Project Video
                                        </h3>
                                        <div className="rounded-2xl overflow-hidden border shadow-sm aspect-video">
                                            <iframe
                                                src={project.videoUrl}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border bg-gray-50 h-48 flex items-center justify-center text-gray-400 text-sm">
                                        No video available
                                    </div>
                                )}

                                {/* Brochure */}
                                {project.brochureUrl && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                            <Download size={15} /> Brochure
                                        </h3>
                                        <a
                                            href={project.brochureUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/80 transition text-sm font-medium"
                                        >
                                            <Download size={16} />
                                            Download Brochure (PDF)
                                        </a>
                                    </div>
                                )}

                                {/* Gallery */}
                                {project.images?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                                            Gallery
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {project.images.map((img: IImage, i: number) => (
                                                <div
                                                    key={i}
                                                    onClick={() => { setActiveIndex(i); setActiveImage(img.url); setLightboxOpen(true); }}
                                                    className="relative aspect-video rounded-xl overflow-hidden cursor-zoom-in group"
                                                >
                                                    <Image
                                                        src={img.url}
                                                        alt={`Project image ${i + 1}`}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
                <div className="space-y-5">
                    <div className="sticky top-24 space-y-5">

                        {/* Contact card */}
                        <Card className="rounded-2xl shadow-lg border bg-white/90 backdrop-blur-xl">
                            <CardContent className="p-6 space-y-5">
                                <h3 className="text-base font-semibold">Enquire About this Project</h3>
                                <Separator />

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Starting Price</span>
                                        <span className="font-semibold text-secondary">
                                            PKR {formatPrice(project.startingPrice)}
                                        </span>
                                    </div>
                                    {project.maxPrice && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Up To</span>
                                            <span className="font-medium">PKR {formatPrice(project.maxPrice)}</span>
                                        </div>
                                    )}
                                    {project.projectStatus && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Status</span>
                                            <span className="capitalize font-medium">{project.projectStatus}</span>
                                        </div>
                                    )}
                                    {project.minArea && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Unit Sizes</span>
                                            <span className="font-medium">
                                                {project.minArea}{project.maxArea ? `–${project.maxArea}` : ""} {project.areaUnit}
                                            </span>
                                        </div>
                                    )}
                                    {project.totalUnits && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Units</span>
                                            <span className="font-medium">{project.totalUnits}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <a
                                    href={`tel:${CONTACT_PHONE}`}
                                    className="flex items-center justify-center gap-2 w-full bg-secondary text-white py-3 rounded-xl font-medium hover:bg-secondary/90 transition"
                                >
                                    <Phone size={17} /> Call Now
                                </a>

                                <a
                                    href={`https://wa.me/${CONTACT_PHONE}?text=${whatsappMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition"
                                >
                                    <MessageCircle size={17} /> WhatsApp
                                </a>

                                {project.brochureUrl && (
                                    <a
                                        href={project.brochureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full border border-secondary text-secondary py-3 rounded-xl font-medium hover:bg-secondary/5 transition text-sm"
                                    >
                                        <Download size={16} /> Download Brochure
                                    </a>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment plan summary card */}
                        {project.paymentPlan && (
                            <Card className="rounded-2xl shadow-sm border">
                                <CardContent className="p-5">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                                        Payment Plan Summary
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Down Payment</span>
                                            <span className="font-semibold text-primary">{project.paymentPlan.downPaymentPercent}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Duration</span>
                                            <span className="font-medium">{project.paymentPlan.installmentMonths} months</span>
                                        </div>
                                        {project.paymentPlan.installmentAmount && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Monthly</span>
                                                <span className="font-medium">PKR {formatPrice(project.paymentPlan.installmentAmount)}</span>
                                            </div>
                                        )}
                                        {project.paymentPlan.possessionPercent && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">On Possession</span>
                                                <span className="font-medium">{project.paymentPlan.possessionPercent}%</span>
                                            </div>
                                        )}
                                        {project.paymentPlan.note && (
                                            <p className="text-xs text-gray-400 pt-2 border-t mt-2">{project.paymentPlan.note}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>

            {/* ── LIGHTBOX ──────────────────────────────────────────────────── */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-5 right-6 text-white/70 hover:text-white"
                    >
                        <X size={30} />
                    </button>

                    {/* Prev */}
                    {project.images.length > 1 && (
                        <button
                            onClick={() => goLightbox("prev")}
                            className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                        >
                            <ChevronLeft size={28} />
                        </button>
                    )}

                    <div className="relative w-full max-w-5xl h-[80vh] px-16">
                        <Image
                            src={project.images[activeIndex]?.url || activeImage}
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Next */}
                    {project.images.length > 1 && (
                        <button
                            onClick={() => goLightbox("next")}
                            className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                        >
                            <ChevronRight size={28} />
                        </button>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-6 text-white/50 text-sm">
                        {activeIndex + 1} / {project.images.length}
                    </div>
                </div>
            )}
        </div>
    );
}