"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    X,
    Loader2,
    ArrowLeft,
    ArrowRight,
    UploadCloud,
    Wand2,
    MapPin,
    Plus,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { ROUTES } from "@/routes";
import { slugify } from "@/lib/slugify";
import { getMapSrc } from "@/lib/map";
import { enumToOptions } from "@/lib/enum";
import { Category, ProjectStatus, PublishStatus, AreaUnit } from "@/enums/project.enum";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(
    () => import("@/components/quill-editor").then((m) => m.QuillEditor),
    {
        ssr: false,
        loading: () => <div className="h-[500px] border rounded-md animate-pulse" />,
    }
);

const AMENITY_SUGGESTIONS = [
    "Swimming Pool", "Gymnasium", "Mosque", "Community Club",
    "Grand Mosque", "Commercial Area", "School", "Hospital",
    "Parks & Gardens", "Sports Complex", "Gated Community",
    "24/7 Security", "CCTV Surveillance", "Underground Utilities",
    "Wide Roads", "Sewerage System", "Water Supply", "Electricity",
    "Natural Gas", "Boundary Wall",
];

export default function NewProjectPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [amenityInput, setAmenityInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [description, setDescription] = useState("");

    const [project, setProject] = useState({
        title: "",
        slug: "",
        developerName: "",
        category: Category.RESIDENTIAL,
        projectStatus: ProjectStatus.ONGOING,
        status: PublishStatus.DRAFT,
        location: "",
        city: "",
        mapUrl: "",
        startingPrice: "",
        maxPrice: "",
        minArea: "",
        maxArea: "",
        areaUnit: AreaUnit.MARLA,
        totalUnits: "",
        completionDate: "",
        tags: [] as string[],
        amenities: [] as string[],
        videoUrl: "",
        brochureUrl: "",
        metaTitle: "",
        metaDescription: "",
        // payment plan
        hasPaymentPlan: false,
        downPaymentPercent: "",
        installmentMonths: "",
        installmentAmount: "",
        possessionPercent: "",
        paymentNote: "",
    });

    const set = (key: string, value: any) =>
        setProject((prev) => ({ ...prev, [key]: value }));

    const categories = enumToOptions(Category);
    const projectStatuses = enumToOptions(ProjectStatus);
    const areaUnits = enumToOptions(AreaUnit);

    // ── Tags ──────────────────────────────────────────────────────────────────
    const addTag = () => {
        const t = tagInput.trim();
        if (t && !project.tags.includes(t)) {
            set("tags", [...project.tags, t]);
            setTagInput("");
        }
    };
    const removeTag = (tag: string) =>
        set("tags", project.tags.filter((t) => t !== tag));

    // ── Amenities ─────────────────────────────────────────────────────────────
    const addAmenity = (a: string) => {
        const t = a.trim();
        if (t && !project.amenities.includes(t)) {
            set("amenities", [...project.amenities, t]);
            setAmenityInput("");
        }
    };
    const removeAmenity = (a: string) =>
        set("amenities", project.amenities.filter((x) => x !== a));

    // ── Images ────────────────────────────────────────────────────────────────
    const handleFiles = (selected: FileList | null) => {
        if (!selected) return;
        setFiles((prev) => [...prev, ...Array.from(selected)]);
    };

    const removeImage = (index: number) =>
        setFiles(files.filter((_, i) => i !== index));

    const moveImage = (index: number, direction: "up" | "down") => {
        const arr = [...files];
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= arr.length) return;
        [arr[index], arr[target]] = [arr[target], arr[index]];
        setFiles(arr);
    };

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const base64Images = await Promise.all(files.map(toBase64));

            const paymentPlan = project.hasPaymentPlan
                ? {
                    downPaymentPercent: Number(project.downPaymentPercent),
                    installmentMonths: Number(project.installmentMonths),
                    installmentAmount: project.installmentAmount
                        ? Number(project.installmentAmount)
                        : undefined,
                    possessionPercent: project.possessionPercent
                        ? Number(project.possessionPercent)
                        : undefined,
                    note: project.paymentNote || undefined,
                }
                : null;

            await axios.post("/api/projects", {
                title: project.title,
                slug: project.slug,
                developerName: project.developerName,
                category: project.category,
                projectStatus: project.projectStatus,
                status: project.status,
                location: project.location,
                city: project.city,
                mapUrl: project.mapUrl,
                startingPrice: project.startingPrice,
                maxPrice: project.maxPrice || undefined,
                minArea: project.minArea || undefined,
                maxArea: project.maxArea || undefined,
                areaUnit: project.areaUnit,
                totalUnits: project.totalUnits || undefined,
                completionDate: project.completionDate || undefined,
                description,
                tags: project.tags,
                amenities: project.amenities,
                paymentPlan,
                videoUrl: project.videoUrl,
                brochureUrl: project.brochureUrl,
                metaTitle: project.metaTitle,
                metaDescription: project.metaDescription,
                images: base64Images,
            });

            router.push(ROUTES.ADMIN.PROJECTS.LIST);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 pb-32 space-y-8">

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
                <p className="text-gray-500 mt-1">Add a real estate development project</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ── BASIC ─────────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <h2 className="text-lg font-semibold">Basic Information</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Project Title *</Label>
                                <Input
                                    placeholder="e.g. Blue World City Islamabad"
                                    value={project.title}
                                    onChange={(e) => set("title", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Slug</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="auto-generated"
                                        value={project.slug}
                                        onChange={(e) => set("slug", e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => set("slug", slugify(project.title))}
                                    >
                                        <Wand2 size={15} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Developer / Builder Name</Label>
                                <Input
                                    placeholder="e.g. DHA, Bahria Town, Blue Group"
                                    value={project.developerName}
                                    onChange={(e) => set("developerName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Total Units</Label>
                                <Input
                                    placeholder="e.g. 500 (plots/apartments)"
                                    type="number"
                                    value={project.totalUnits}
                                    onChange={(e) => set("totalUnits", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label>Category *</Label>
                                <Select value={project.category} onValueChange={(v) => set("category", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Project Status *</Label>
                                <Select value={project.projectStatus} onValueChange={(v) => set("projectStatus", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {projectStatuses.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Completion Date</Label>
                                <Input
                                    type="date"
                                    value={project.completionDate}
                                    onChange={(e) => set("completionDate", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── LOCATION ──────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <MapPin size={18} /> Location
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>City *</Label>
                                <Input
                                    placeholder="e.g. Islamabad"
                                    value={project.city}
                                    onChange={(e) => set("city", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Full Location / Address</Label>
                                <Input
                                    placeholder="e.g. GT Road, near Toll Plaza"
                                    value={project.location}
                                    onChange={(e) => set("location", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label>Google Maps URL</Label>
                            <Input
                                placeholder="Paste Google Maps link"
                                value={project.mapUrl}
                                onChange={(e) => set("mapUrl", e.target.value)}
                            />
                        </div>

                        {project.mapUrl && (
                            <div className="rounded-xl overflow-hidden border">
                                <iframe
                                    src={getMapSrc(project.mapUrl)}
                                    className="w-full h-64"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── PRICING ───────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Pricing & Unit Sizes</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Starting Price (PKR) *</Label>
                                <Input
                                    placeholder="e.g. 5000000"
                                    type="number"
                                    value={project.startingPrice}
                                    onChange={(e) => set("startingPrice", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Maximum Price (PKR)</Label>
                                <Input
                                    placeholder="optional upper range"
                                    type="number"
                                    value={project.maxPrice}
                                    onChange={(e) => set("maxPrice", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label>Min Unit Size</Label>
                                <Input
                                    placeholder="e.g. 5"
                                    type="number"
                                    value={project.minArea}
                                    onChange={(e) => set("minArea", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Max Unit Size</Label>
                                <Input
                                    placeholder="e.g. 1"
                                    type="number"
                                    value={project.maxArea}
                                    onChange={(e) => set("maxArea", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Area Unit</Label>
                                <Select value={project.areaUnit} onValueChange={(v) => set("areaUnit", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {areaUnits.map((u) => (
                                            <SelectItem key={u.value} value={u.value}>{u.label.toUpperCase()}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── PAYMENT PLAN ──────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Payment Plan</h2>
                            <button
                                type="button"
                                onClick={() => set("hasPaymentPlan", !project.hasPaymentPlan)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${project.hasPaymentPlan
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {project.hasPaymentPlan ? "Enabled" : "Add Payment Plan"}
                            </button>
                        </div>

                        {project.hasPaymentPlan && (
                            <div className="space-y-4 pt-2">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Down Payment (%)*</Label>
                                        <Input
                                            placeholder="e.g. 20"
                                            type="number"
                                            value={project.downPaymentPercent}
                                            onChange={(e) => set("downPaymentPercent", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Installment Duration (months) *</Label>
                                        <Input
                                            placeholder="e.g. 48"
                                            type="number"
                                            value={project.installmentMonths}
                                            onChange={(e) => set("installmentMonths", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Monthly Installment Amount (PKR)</Label>
                                        <Input
                                            placeholder="optional"
                                            type="number"
                                            value={project.installmentAmount}
                                            onChange={(e) => set("installmentAmount", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>On Possession (%)</Label>
                                        <Input
                                            placeholder="e.g. 10"
                                            type="number"
                                            value={project.possessionPercent}
                                            onChange={(e) => set("possessionPercent", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label>Payment Plan Note</Label>
                                    <Input
                                        placeholder="e.g. 4-year easy installments with no interest"
                                        value={project.paymentNote}
                                        onChange={(e) => set("paymentNote", e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── AMENITIES ─────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Amenities</h2>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add amenity..."
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); addAmenity(amenityInput); }
                                }}
                            />
                            <Button type="button" variant="outline" onClick={() => addAmenity(amenityInput)}>
                                Add
                            </Button>
                        </div>

                        {/* Quick add suggestions */}
                        <div className="flex flex-wrap gap-2">
                            {AMENITY_SUGGESTIONS.filter((a) => !project.amenities.includes(a)).map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => addAmenity(a)}
                                    className="text-xs px-2 py-1 rounded-full border border-dashed hover:bg-muted transition"
                                >
                                    + {a}
                                </button>
                            ))}
                        </div>

                        {project.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {project.amenities.map((a) => (
                                    <Badge key={a} className="flex items-center gap-1 py-1.5">
                                        {a}
                                        <X size={12} className="cursor-pointer ml-1" onClick={() => removeAmenity(a)} />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── TAGS ──────────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Tags <span className="text-sm font-normal text-gray-400">(for search & SEO)</span></h2>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); addTag(); }
                                }}
                            />
                            <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {project.tags.map((tag) => (
                                <Badge key={tag} className="flex items-center gap-1.5 py-1.5">
                                    {tag}
                                    <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* ── DESCRIPTION ───────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Description</h2>
                        <QuillEditor
                            value={description}
                            onChange={setDescription}
                            minHeight={500}
                            placeholder="Describe the project — location highlights, investment potential, features..."
                        />
                    </CardContent>
                </Card>

                {/* ── MEDIA ─────────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Media</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Video URL (YouTube embed)</Label>
                                <Input
                                    placeholder="https://www.youtube.com/embed/..."
                                    value={project.videoUrl}
                                    onChange={(e) => set("videoUrl", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Brochure URL (PDF link)</Label>
                                <Input
                                    placeholder="https://..."
                                    value={project.brochureUrl}
                                    onChange={(e) => set("brochureUrl", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Image upload */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed rounded-xl p-10 text-center hover:bg-gray-50 transition cursor-pointer"
                        >
                            <UploadCloud className="mx-auto mb-3 text-gray-400" size={28} />
                            <p className="text-gray-500 text-sm">Click to upload project images</p>
                            <p className="text-gray-400 text-xs mt-1">First image will be the cover</p>
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />
                        </div>

                        {files.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {files.map((file, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden border group">
                                        <div className="relative h-32 overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {i === 0 && (
                                                <div className="absolute bottom-1 left-1 text-[10px] bg-primary text-black px-1.5 py-0.5 rounded font-medium">
                                                    Cover
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                            <button type="button" onClick={() => moveImage(i, "up")} className="bg-white/90 p-1.5 rounded-full shadow">
                                                <ArrowLeft size={12} />
                                            </button>
                                            <button type="button" onClick={() => moveImage(i, "down")} className="bg-white/90 p-1.5 rounded-full shadow">
                                                <ArrowRight size={12} />
                                            </button>
                                        </div>
                                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition">
                                            <button type="button" onClick={() => removeImage(i)} className="bg-red-500 text-white p-1.5 rounded-full shadow">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── SEO ───────────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold">SEO <span className="text-sm font-normal text-gray-400">(optional)</span></h2>
                        <div className="space-y-1">
                            <Label>Meta Title</Label>
                            <Input
                                placeholder="Leave blank to use project title"
                                value={project.metaTitle}
                                onChange={(e) => set("metaTitle", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Meta Description</Label>
                            <Textarea
                                placeholder="Brief description for search engines (150–160 chars)"
                                rows={3}
                                value={project.metaDescription}
                                onChange={(e) => set("metaDescription", e.target.value)}
                                className="resize-none"
                            />
                            <p className="text-xs text-gray-400">{project.metaDescription.length} / 160</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ── PUBLISH ───────────────────────────────────────────────────── */}
                <Card>
                    <CardContent className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold">Publish Project</h2>
                            <p className="text-sm text-gray-500">Control visibility on the public site</p>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                set(
                                    "status",
                                    project.status === PublishStatus.PUBLISHED
                                        ? PublishStatus.DRAFT
                                        : PublishStatus.PUBLISHED
                                )
                            }
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${project.status === PublishStatus.PUBLISHED
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {project.status === PublishStatus.PUBLISHED ? "Published" : "Draft"}
                        </button>
                    </CardContent>
                </Card>

            </form>

            {/* Sticky footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-50">
                <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN.PROJECTS.LIST)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="px-8">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Project"}
                </Button>
            </div>
        </div>
    );
}