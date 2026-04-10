"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
    X,
    Loader2,
    ArrowLeft,
    ArrowRight,
    UploadCloud,
    Wand2,
    MapPin,
} from "lucide-react";

import dynamic from "next/dynamic";
import { ROUTES } from "@/routes";
import { slugify } from "@/lib/slugify";
import { getMapSrc } from "@/lib/map";
import { Category, PublishStatus } from "@/enums/project.enum";
import { enumToOptions } from "@/lib/enum";
import { getPublicIdFromUrl } from "@/helper/cloudinary";

const QuillEditor = dynamic(
    () => import("@/components/quill-editor").then((m) => m.QuillEditor),
    { ssr: false }
);

export default function EditProjectPage() {
    const router = useRouter();
    const { id } = useParams();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [images, setImages] = useState<
        { url: string; public_id: string; type: "existing" | "new"; file?: File }[]
    >([]);


    const [project, setProject] = useState({
        title: "",
        slug: "",
        location: "",
        mapUrl: "",
        startingPrice: "",
        category: "",
        description: "",
        tags: [] as string[],
        status: PublishStatus.DRAFT,
    });

    const categories = enumToOptions(Category);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // ================= FETCH =================
    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            const res = await axios.get(`/api/projects/${id}`);
            const data = res.data;

            setProject({
                title: data.title || "",
                slug: data.slug || "",
                location: data.location || "",
                mapUrl: data.mapUrl || "",
                startingPrice: data.startingPrice?.toString() || "",
                category: data.category || "",
                description: data.description || "",
                tags: data.tags || [],
                status: data.status || PublishStatus.DRAFT,
            });

            setImages(
                data.images?.map((img: any) => ({
                    url: img.url,
                    public_id: img.public_id,
                    type: "existing",
                }))
            );
        };

        fetchProject();
    }, [id]);

    // ================= SLUG =================
    const generateSlug = () => {
        setProject((prev) => ({
            ...prev,
            slug: slugify(prev.title),
        }));
    };

    // ================= TAGS =================
    const addTag = () => {
        if (tagInput.trim() && !project.tags.includes(tagInput)) {
            setProject((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput],
            }));
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setProject((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    // ================= FILES =================
    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;

        const newItems = Array.from(fileList).map((file) => ({
            url: URL.createObjectURL(file),
            public_id: "",
            type: "new" as const,
            file,
        }));

        setImages((prev) => [...prev, ...newItems]);
    };

    // ================= REMOVE =================
    const removeImage = (index: number) => {
        const img = images[index];

        const publicId = img.public_id || getPublicIdFromUrl(img.url);

        if (publicId) {
            setRemovedImages((prev) => [...prev, publicId]);
        }

        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // ================= ORDER =================
    const moveImage = (index: number, dir: "up" | "down") => {
        const newArr = [...images];
        const target = dir === "up" ? index - 1 : index + 1;

        if (target < 0 || target >= images.length) return;

        [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
        setImages(newArr);
    };

    // ================= BASE64 =================
    const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        setLoading(true);

        try {
            const newImages = await Promise.all(
                images
                    .filter((img) => img.type === "new")
                    .map((img) => toBase64(img.file!))
            );

            const existingImages = images
                .filter((img) => img.type === "existing")
                .map((img, index) => ({
                    public_id: img.public_id,
                    order: index,
                }));

            await axios.put(`/api/projects/${id}`, {
                ...project,
                startingPrice: Number(project.startingPrice),
                existingImages,
                newImages,
                removedImages,
            });

            router.push(ROUTES.ADMIN.PROJECTS.LIST);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-16 px-6 space-y-10">

            {/* HEADER */}
            <div>
                <h1 className="text-4xl font-bold">Edit Project</h1>
                <p className="text-gray-500 mt-2">
                    Update your project professionally
                </p>
            </div>

            {/* BASIC */}
            <Card>
                <CardContent className="p-6 space-y-6">

                    <h2 className="text-xl font-semibold">Basic Information</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            value={project.title}
                            onChange={(e) =>
                                setProject({ ...project, title: e.target.value })
                            }
                            placeholder="Project Title"
                        />

                        <div className="flex gap-2">
                            <Input
                                value={project.slug}
                                onChange={(e) =>
                                    setProject({ ...project, slug: e.target.value })
                                }
                                placeholder="Slug"
                            />
                            <Button type="button" className="py-5 px-3" onClick={generateSlug}>
                                <Wand2 size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            value={project.location}
                            onChange={(e) =>
                                setProject({ ...project, location: e.target.value })
                            }
                            placeholder="Location"
                        />

                        <Input
                            value={project.startingPrice}
                            onChange={(e) =>
                                setProject({ ...project, startingPrice: e.target.value })
                            }
                            placeholder="Starting Price"
                        />
                    </div>

                    {/* CATEGORY */}
                    <select
                        className="border rounded-lg px-3 py-2 w-full"
                        value={project.category}
                        onChange={(e) =>
                            setProject({ ...project, category: e.target.value })
                        }
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>

                </CardContent>
            </Card>

            {/* TAGS */}
            <Card>
                <CardContent className="px-6 py-2">

                    <h2 className="text-xl font-semibold mb-4">Tags</h2>

                    <div className="flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                        />
                        <Button onClick={addTag} className="py-5">Add</Button>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                        {project.tags.map((tag) => (
                            <Badge key={tag}>
                                {tag}
                                <X onClick={() => removeTag(tag)} />
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* MAP */}
            <Card>
                <CardContent className="px-6 py-2 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin size={18} /> Location Preview
                    </h2>

                    <Input
                        value={project.mapUrl}
                        onChange={(e) =>
                            setProject({ ...project, mapUrl: e.target.value })
                        }
                        placeholder="Google Maps URL"
                    />

                    {project.mapUrl && (
                        <iframe
                            src={getMapSrc(project.mapUrl)}
                            className="w-full h-72 rounded-xl"
                        />
                    )}
                </CardContent>
            </Card>

            {/* DESCRIPTION */}
            <Card>
                <CardContent className="px-6 py-2">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>

                    <QuillEditor
                        value={project.description}
                        onChange={(val) =>
                            setProject({ ...project, description: val })
                        }
                    />
                </CardContent>
            </Card>

            {/* IMAGES */}
            <Card>
                <CardContent className="px-6 py-2 space-y-4">
                    <h2 className="text-gray-800 font-medium">Images</h2>

                    <div onClick={handleClick} className="border-2 border-dashed rounded-xl p-10 text-center hover:bg-gray-50 transition cursor-pointer">
                        <UploadCloud className="mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-500">
                            Upload high-quality images
                        </p>

                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {images?.map((img, i) => (
                            <div
                                key={i}
                                className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="relative h-36 overflow-hidden">
                                    <Image
                                        src={img.url}
                                        alt="preview"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                                </div>


                                {/* Top Right Controls */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <button
                                        onClick={() => moveImage(i, "up")}
                                        className="bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 p-1.5 rounded-full shadow-md transition"
                                    >
                                        <ArrowLeft size={14} />
                                    </button>
                                    <button
                                        onClick={() => moveImage(i, "down")}
                                        className="bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 p-1.5 rounded-full shadow-md transition"
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                </div>

                                {/* Delete Button */}
                                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* Bottom label (optional premium touch) */}
                                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <div className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md inline-block">
                                        Image {i + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </CardContent>
            </Card>

            <Card>
                <CardContent className="px-6 py-2 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold">Publish Project</h2>
                        <p className="text-sm text-gray-500">
                            Control visibility of this project
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setProject({
                                ...project,
                                status:
                                    project.status === PublishStatus.PUBLISHED
                                        ? PublishStatus.DRAFT
                                        : PublishStatus.PUBLISHED,
                            })
                        }
                        className={`px-5 py-2 rounded-full text-sm transition ${project.status === PublishStatus.PUBLISHED
                            ? "bg-green-500 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        {project.status === PublishStatus.PUBLISHED ? PublishStatus.PUBLISHED : PublishStatus.DRAFT}
                    </button>
                </CardContent>
            </Card>

            {/* SUBMIT */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end">
                <Button
                    onClick={handleSubmit}
                    className="px-8 py-6 text-lg"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Update Project"}
                </Button>
            </div>

        </div>
    );
}