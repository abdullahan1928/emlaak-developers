"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

import { ROUTES } from "@/routes";
import { slugify } from "@/lib/slugify";
import { getMapSrc } from "@/lib/map";
import {
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  AreaUnit,
  FurnishingStatus,
} from "@/enums/property.enum";

const QuillEditor = dynamic(
  () => import("@/components/quill-editor").then((m) => m.QuillEditor),
  {
    ssr: false,
    loading: () => <div className="h-[400px] border rounded-md animate-pulse" />,
  }
);

const FEATURES_SUGGESTIONS = [
  "Electricity",
  "Gas",
  "Water",
  "Sewerage",
  "Security",
  "CCTV",
  "Backup Generator",
  "Parking",
  "Garden",
  "Swimming Pool",
  "Gym",
  "Lift / Elevator",
  "Gated Community",
  "Servant Quarters",
  "Boundary Wall",
  "Corner Plot",
  "Near Main Road",
  "Near School",
  "Near Hospital",
  "Near Mosque",
];

export default function NewPropertyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [description, setDescription] = useState("");

  const [property, setProperty] = useState({
    title: "",
    slug: "",
    type: "",
    purpose: PropertyPurpose.SALE,
    status: PropertyStatus.AVAILABLE,
    location: "",
    city: "",
    area: "",
    mapUrl: "",
    price: "",
    isNegotiable: false,
    areaSize: "",
    areaUnit: AreaUnit.MARLA,
    bedrooms: "",
    bathrooms: "",
    floors: "",
    furnishing: "",
    features: [] as string[],
    isFeatured: false,
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
  });

  const set = (key: string, value: any) =>
    setProperty((prev) => ({ ...prev, [key]: value }));

  const generateSlug = () => set("slug", slugify(property.title));

  // Features
  const addFeature = (feat: string) => {
    const trimmed = feat.trim();
    if (trimmed && !property.features.includes(trimmed)) {
      set("features", [...property.features, trimmed]);
    }
    setFeatureInput("");
  };

  const removeFeature = (feat: string) =>
    set("features", property.features.filter((f) => f !== feat));

  // Files
  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
  };

  const removeImage = (index: number) =>
    setFiles(files.filter((_, i) => i !== index));

  const moveImage = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert all files to base64 — backend uploads to Cloudinary
      const base64Images = await Promise.all(files.map(toBase64));

      const payload = {
        ...property,
        description,
        price: Number(property.price),
        areaSize: Number(property.areaSize),
        bedrooms: property.bedrooms ? Number(property.bedrooms) : undefined,
        bathrooms: property.bathrooms ? Number(property.bathrooms) : undefined,
        floors: property.floors ? Number(property.floors) : undefined,
        furnishing: property.furnishing || undefined,
        images: base64Images,
      };

      await axios.post("/api/properties", payload);
      router.push(ROUTES.ADMIN.PROPERTIES.LIST);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Determine if property type needs bedroom/bathroom fields
  const needsRooms = !["plot", "commercial", "warehouse"].includes(property.type);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-32 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-gray-500 mt-1">List a property for sale or rent</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC INFO */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Property Title *"
                value={property.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Slug"
                  value={property.slug}
                  onChange={(e) => set("slug", e.target.value)}
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  <Wand2 size={15} />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Type */}
              <Select value={property.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type *" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Purpose */}
              <Select value={property.purpose} onValueChange={(v) => set("purpose", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Purpose *" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyPurpose).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status */}
              <Select value={property.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* LOCATION */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Location</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="City * (e.g. Islamabad)"
                value={property.city}
                onChange={(e) => set("city", e.target.value)}
                required
              />
              <Input
                placeholder="Area / Sector (e.g. F-7, DHA Phase 6)"
                value={property.area}
                onChange={(e) => set("area", e.target.value)}
              />
              <Input
                placeholder="Full Address *"
                value={property.location}
                onChange={(e) => set("location", e.target.value)}
                required
              />
            </div>

            <Input
              placeholder="Google Maps embed URL (optional)"
              value={property.mapUrl}
              onChange={(e) => set("mapUrl", e.target.value)}
            />

            {property.mapUrl && (
              <div className="rounded-xl overflow-hidden border">
                <iframe
                  src={getMapSrc(property.mapUrl)}
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* PRICING */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Pricing</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Price (PKR) *"
                type="number"
                value={property.price}
                onChange={(e) => set("price", e.target.value)}
                required
              />
              <div className="flex items-center gap-3 h-10">
                <Switch
                  checked={property.isNegotiable}
                  onCheckedChange={(v) => set("isNegotiable", v)}
                />
                <Label>Price is Negotiable</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PHYSICAL DETAILS */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Physical Details</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="Area Size *"
                type="number"
                value={property.areaSize}
                onChange={(e) => set("areaSize", e.target.value)}
                required
              />
              <Select value={property.areaUnit} onValueChange={(v) => set("areaUnit", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AreaUnit).map((u) => (
                    <SelectItem key={u} value={u}>
                      {u.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Floors"
                type="number"
                value={property.floors}
                onChange={(e) => set("floors", e.target.value)}
              />
            </div>

            {needsRooms && (
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  placeholder="Bedrooms"
                  type="number"
                  value={property.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                />
                <Input
                  placeholder="Bathrooms"
                  type="number"
                  value={property.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                />
                <Select
                  value={property.furnishing}
                  onValueChange={(v) => set("furnishing", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Furnishing Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(FurnishingStatus).map((f) => (
                      <SelectItem key={f} value={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FEATURES */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Features & Amenities</h2>

            <div className="flex gap-2">
              <Input
                placeholder="Add feature..."
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature(featureInput);
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addFeature(featureInput)}>
                Add
              </Button>
            </div>

            {/* Quick-add suggestions */}
            <div className="flex flex-wrap gap-2">
              {FEATURES_SUGGESTIONS.filter(
                (f) => !property.features.includes(f)
              ).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => addFeature(f)}
                  className="text-xs px-2 py-1 rounded-full border border-dashed hover:bg-muted transition"
                >
                  + {f}
                </button>
              ))}
            </div>

            {/* Selected features */}
            {property.features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {property.features.map((f) => (
                  <Badge key={f} className="flex items-center gap-1 py-1.5">
                    {f}
                    <X
                      size={12}
                      className="cursor-pointer ml-1"
                      onClick={() => removeFeature(f)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* DESCRIPTION */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Description</h2>
            <QuillEditor
              value={description}
              onChange={setDescription}
              minHeight={360}
              placeholder="Describe the property — layout, surroundings, unique selling points..."
            />
          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Images</h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-10 text-center hover:bg-gray-50 transition cursor-pointer"
            >
              <UploadCloud className="mx-auto mb-3 text-gray-400" size={28} />
              <p className="text-gray-500 text-sm">Click to upload images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition group"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    </div>

                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => moveImage(i, "up")}
                        className="bg-white/90 p-1.5 rounded-full shadow text-gray-700 hover:bg-white"
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, "down")}
                        className="bg-white/90 p-1.5 rounded-full shadow text-gray-700 hover:bg-white"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="p-2 text-xs text-gray-500 truncate">{file.name}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">SEO (optional)</h2>
            <Input
              placeholder="Meta Title"
              value={property.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
            <Input
              placeholder="Meta Description"
              value={property.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* PUBLISH */}
        <Card>
          <CardContent className="p-6 flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-3">
              <Switch
                checked={property.isFeatured}
                onCheckedChange={(v) => set("isFeatured", v)}
              />
              <Label>Mark as Featured</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={property.isPublished}
                onCheckedChange={(v) => set("isPublished", v)}
              />
              <Label>Publish (make public)</Label>
            </div>
          </CardContent>
        </Card>

      </form>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-50">
        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN.PROPERTIES.LIST)}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="px-8">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Property"}
        </Button>
      </div>
    </div>
  );
}