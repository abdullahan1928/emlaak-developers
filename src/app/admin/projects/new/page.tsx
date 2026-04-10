"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, ArrowLeft, ArrowRight, UploadCloud, Wand2, MapPin } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { ROUTES } from "@/routes";
import "react-quill-new/dist/quill.snow.css";
import { slugify } from "@/lib/slugify";
import { Card, CardContent } from "@/components/ui/card";
import { getMapSrc } from "@/lib/map";
import { enumToOptions } from "@/lib/enum";
import { Category, PublishStatus } from "@/enums/project.enum";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(
    () => import("@/components/quill-editor").then((m) => m.QuillEditor),
    {
        ssr: false,
        loading: () => <div className="h-[500px] border rounded-md animate-pulse" />
    }
);

const EDITOR_HEIGHT = 560;

export default function AddProjectPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const [description, setDescription] = useState("");

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

    const generateSlug = () => {
        const slug = slugify(project.title);
        setProject({ ...project, slug });
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // ================= TAGS =================
    const addTag = () => {
        if (tagInput.trim() && !project.tags.includes(tagInput)) {
            setProject({ ...project, tags: [...project.tags, tagInput] });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setProject({
            ...project,
            tags: project.tags.filter((t) => t !== tag),
        });
    };

    // ================= FILES =================
    const handleFiles = (selected: FileList | null) => {
        if (!selected) return;
        setFiles((prev) => [...prev, ...Array.from(selected)]);
    };

    const removeImage = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const moveImage = (index: number, direction: "up" | "down") => {
        const newFiles = [...files];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= files.length) return;

        [newFiles[index], newFiles[targetIndex]] = [
            newFiles[targetIndex],
            newFiles[index],
        ];

        setFiles(newFiles);
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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const base64Images = await Promise.all(files.map(toBase64));

            const payload = {
                ...project,
                images: base64Images,
            };

            await axios.post("/api/projects", payload);

            router.push(ROUTES.ADMIN.PROJECTS.LIST);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-16 px-6 pb-32">

            {/* ================= HEADER ================= */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Create New Project
                </h1>
                <p className="text-gray-500 mt-2">
                    Add details and publish your real estate project
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">

                {/* ================= BASIC ================= */}
                <Card>
                    <CardContent className="p-6 space-y-6">

                        <h2 className="text-xl font-semibold">Basic Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                placeholder="Project Title"
                                value={project.title}
                                onChange={(e) =>
                                    setProject({ ...project, title: e.target.value })
                                }
                            />

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Slug"
                                    value={project.slug}
                                    onChange={(e) =>
                                        setProject({ ...project, slug: e.target.value })
                                    }
                                />
                                <Button type="button" className="py-5 px-3" onClick={generateSlug}>
                                    <Wand2 size={16} />
                                </Button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                placeholder="Location (City, Area)"
                                value={project.location}
                                onChange={(e) =>
                                    setProject({ ...project, location: e.target.value })
                                }
                            />

                            <Input
                                placeholder="Starting Price"
                                value={project.startingPrice}
                                onChange={(e) =>
                                    setProject({ ...project, startingPrice: e.target.value })
                                }
                            />
                        </div>

                        <select
                            className="border rounded-lg px-3 py-2 w-full"
                            value={project.category}
                            onChange={(e) => {
                                setProject({ ...project, category: e.target.value })
                            }}
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>

                    </CardContent>
                </Card>

                {/* ================= TAGS ================= */}
                <Card>
                    <CardContent className="px-6 py-2">

                        <h2 className="text-xl font-semibold mb-4">Tags</h2>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                            />
                            <Button type="button" className="py-5" onClick={addTag}>
                                Add
                            </Button>
                        </div>

                        <div className="flex gap-2 mt-4 flex-wrap">
                            {project.tags.map((tag) => (
                                <Badge key={tag} className="flex items-center gap-1.5 py-3">
                                    {tag}
                                    <X size={16} className="cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="px-6 py-2 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <MapPin size={18} /> Location Preview
                        </h2>

                        <Input
                            placeholder="Paste Google Maps embed URL"
                            value={project.mapUrl}
                            onChange={(e) =>
                                setProject({ ...project, mapUrl: e.target.value })
                            }
                        />

                        {project.mapUrl && (
                            <div className="rounded-xl overflow-hidden border">
                                <iframe
                                    src={getMapSrc(project.mapUrl)}
                                    className="w-full h-75"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ================= DESCRIPTION ================= */}
                <Card>
                    <CardContent className="px-6 py-2">
                        <h2 className="text-xl font-semibold mb-4">Description</h2>

                        <QuillEditor value={description} onChange={setDescription} minHeight={EDITOR_HEIGHT - 40} />
                    </CardContent>
                </Card>

                {/* ================= IMAGES ================= */}
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
                            {files.map((file, i) => (
                                <div
                                    key={i}
                                    className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Image */}
                                    <div className="relative h-36 overflow-hidden">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Gradient overlay */}
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

            </form>

            {/* ================= STICKY CTA ================= */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end">
                <Button
                    onClick={handleSubmit}
                    className="px-8 py-6 text-lg"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Create Project"}
                </Button>
            </div>
        </div >
    );
}