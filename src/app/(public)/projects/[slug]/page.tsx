"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import axios from "axios"

import {
    MapPin,
    Calendar,
    Tag,
    Building2,
    X
} from "lucide-react"

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { IProject } from "@/models/project.model"
import { IImage } from "@/enums/project.enum"

export default function ProjectPage() {
    const { slug } = useParams()

    const [project, setProject] = useState<IProject>()
    const [activeImage, setActiveImage] = useState("")
    const [activeIndex, setActiveIndex] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    useEffect(() => {
        const fetchProject = async () => {
            const res = await axios.get(`/api/projects/slug/${slug}`)
            setProject(res.data)
            setActiveImage(res.data.images?.[0]?.url)
        }
        fetchProject()
    }, [slug])

    if (!project) return null

    return (
        <div className="bg-neutral-50 text-neutral-900">

            {/* HERO */}
            <section className="relative h-[80vh] w-full overflow-hidden">
                <Image
                    src={activeImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* content */}
                <div className="absolute bottom-0 left-0 w-full max-w-7xl mx-auto px-6 pb-12 text-white">
                    <p className="flex items-center gap-2 text-sm text-white/70 mb-3">
                        <MapPin size={14} /> {project.location}
                    </p>

                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
                        {project.title}
                    </h1>

                    <p className="mt-4 text-lg text-white/80">
                        Starting from
                    </p>

                    <p className="text-2xl font-medium mt-1">
                        Rs. {project.startingPrice}
                    </p>
                </div>
            </section>

            {/* MAIN */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-12 gap-12">

                {/* LEFT */}
                <div className="col-span-8 space-y-12">

                    {/* GALLERY */}
                    <div className="space-y-4">
                        <div
                            className="relative h-[500px] rounded-2xl overflow-hidden cursor-zoom-in"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <Image
                                src={activeImage}
                                alt=""
                                fill
                                className="object-cover transition duration-700 hover:scale-105"
                            />
                        </div>

                        <div className="flex gap-3">
                            {project.images?.map((img: IImage, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setActiveImage(img.url)
                                        setActiveIndex(i)
                                    }}
                                    className={`relative h-20 w-32 rounded-xl overflow-hidden cursor-pointer transition ${activeIndex === i
                                        ? "ring-1 ring-black"
                                        : "opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image src={img.url} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* META STRIP */}
                    <div className="flex gap-10 text-sm text-neutral-600 border-y py-6">
                        <div className="flex items-center gap-2">
                            <Building2 size={16} />
                            {project.category || "N/A"}
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {project.completionDate
                                ? new Date(project.completionDate).toLocaleDateString()
                                : "N/A"}
                        </div>

                        <div className="flex items-center gap-2">
                            <Tag size={16} />
                            {project.projectStatus}
                        </div>
                    </div>

                    {/* CONTENT */}
                    <Tabs defaultValue="details" className="flex-col">
                        <TabsList>
                            <TabsTrigger value="details" className="px-0 mr-8">
                                Details
                            </TabsTrigger>
                            <TabsTrigger value="financials" className="px-0 mr-8">
                                Financials
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="px-0">
                                Documents
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details">
                            <div className="pt-8 max-w-3xl">
                                <h2 className="text-2xl font-semibold mb-6">
                                    About the Project
                                </h2>

                                <div
                                    className={`text-neutral-600 leading-relaxed ${!expanded ? "max-h-[180px] overflow-hidden" : ""
                                        }`}
                                    dangerouslySetInnerHTML={{
                                        __html: project.description
                                    }}
                                />

                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-6 text-sm underline"
                                >
                                    {expanded ? "Show less" : "Read more"}
                                </button>

                                {/* TAGS */}
                                {project.tags?.length > 0 && (
                                    <div className="mt-10 flex flex-wrap gap-2">
                                        {project.tags.map((tag, i) => (
                                            <Badge key={i} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="financials">
                            <div className="pt-8 text-neutral-500">
                                Financial data coming soon.
                            </div>
                        </TabsContent>

                        <TabsContent value="documents">
                            <div className="pt-8 text-neutral-500">
                                No documents available.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="col-span-4">
                    <div className="sticky top-24 space-y-6">

                        <Card className="p-8 rounded-2xl border bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)]">

                            <h3 className="text-lg font-medium mb-6">
                                Enquire Now
                            </h3>

                            <Separator className="mb-6" />

                            <div className="space-y-4 text-sm text-neutral-600">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    {project.location}
                                </div>

                                <div>
                                    <span className="text-neutral-500">Status:</span>{" "}
                                    {project.projectStatus}
                                </div>

                                <div>
                                    <span className="text-neutral-500">Price:</span>{" "}
                                    Rs. {project.startingPrice}
                                </div>
                            </div>

                            <button className="mt-8 w-full bg-black text-white py-3 rounded-full text-sm hover:bg-neutral-800 transition">
                                Contact Sales
                            </button>
                        </Card>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">

                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white"
                    >
                        <X size={28} />
                    </button>

                    <div className="relative w-full max-w-5xl h-[80vh]">
                        <Image
                            src={project.images[activeIndex].url}
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}