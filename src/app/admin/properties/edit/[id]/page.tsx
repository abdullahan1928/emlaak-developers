"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

import { X, Loader2, ArrowLeft, ArrowRight, UploadCloud, Wand2 } from "lucide-react";

import { ROUTES } from "@/routes";
import { slugify } from "@/lib/slugify";
import { getMapSrc } from "@/lib/map";
import { getPublicIdFromUrl } from "@/helper/cloudinary";
import {
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  AreaUnit,
  FurnishingStatus,
} from "@/enums/property.enum";

const QuillEditor = dynamic(
  () => import("@/components/quill-editor").then((m) => m.QuillEditor),
  { ssr: false }
);

const FEATURES_SUGGESTIONS = [
  "Electricity", "Gas", "Water", "Sewerage", "Security", "CCTV",
  "Backup Generator", "Parking", "Garden", "Swimming Pool", "Gym",
  "Lift / Elevator", "Gated Community", "Servant Quarters", "Boundary Wall",
  "Corner Plot", "Near Main Road", "Near School", "Near Hospital", "Near Mosque",
];

type ImageItem = {
  url: string;
  public_id: string;
  type: "existing" | "new";
  file?: File;
};

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

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
    description: "",
    isFeatured: false,
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
  });

  const set = (key: string, value: any) =>
    setProperty((prev) => ({ ...prev, [key]: value }));

  // Fetch existing property
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const res = await axios.get(`/api/properties/${id}`);
      const d = res.data;
      setProperty({
        title: d.title || "",
        slug: d.slug || "",
        type: d.type || "",
        purpose: d.purpose || PropertyPurpose.SALE,
        status: d.status || PropertyStatus.AVAILABLE,
        location: d.location || "",
        city: d.city || "",
        area: d.area || "",
        mapUrl: d.mapUrl || "",
        price: d.price?.toString() || "",
        isNegotiable: d.isNegotiable || false,
        areaSize: d.areaSize?.toString() || "",
        areaUnit: d.areaUnit || AreaUnit.MARLA,
        bedrooms: d.bedrooms?.toString() || "",
        bathrooms: d.bathrooms?.toString() || "",
        floors: d.floors?.toString() || "",
        furnishing: d.furnishing || "",
        features: d.features || [],
        description: d.description || "",
        isFeatured: d.isFeatured || false,
        isPublished: d.isPublished || false,
        metaTitle: d.metaTitle || "",
        metaDescription: d.metaDescription || "",
      });
      setImages(
        (d.images || []).map((img: any) => ({
          url: img.url,
          public_id: img.public_id,
          type: "existing",
        }))
      );
      setFetching(false);
    };
    fetch();
  }, [id]);

  const generateSlug = () => set("slug", slugify(property.title));

  const addFeature = (feat: string) => {
    const trimmed = feat.trim();
    if (trimmed && !property.features.includes(trimmed)) {
      set("features", [...property.features, trimmed]);
    }
    setFeatureInput("");
  };

  const removeFeature = (feat: string) =>
    set("features", property.features.filter((f) => f !== feat));

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newItems: ImageItem[] = Array.from(fileList).map((file) => ({
      url: URL.createObjectURL(file),
      public_id: "",
      type: "new",
      file,
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (index: number) => {
    const img = images[index];
    const publicId = img.public_id || getPublicIdFromUrl(img.url);
    if (publicId && img.type === "existing") {
      setRemovedImages((prev) => [...prev, publicId]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, dir: "up" | "down") => {
    const arr = [...images];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setImages(arr);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert new files to base64 — backend uploads to Cloudinary
      const newBase64Images = await Promise.all(
        images
          .filter((img) => img.type === "new")
          .map((img) => toBase64(img.file!))
      );

      const existingImages = images
        .filter((img) => img.type === "existing")
        .map((img, i) => ({ public_id: img.public_id, order: i }));

      await axios.put(`/api/properties/${id}`, {
        ...property,
        price: Number(property.price),
        areaSize: Number(property.areaSize),
        bedrooms: property.bedrooms ? Number(property.bedrooms) : undefined,
        bathrooms: property.bathrooms ? Number(property.bathrooms) : undefined,
        floors: property.floors ? Number(property.floors) : undefined,
        furnishing: property.furnishing || undefined,
        existingImages,
        newImages: newBase64Images,
        removedImages,
      });

      router.push(ROUTES.ADMIN.PROPERTIES.LIST);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const needsRooms = !["plot", "commercial", "warehouse"].includes(property.type);

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-32 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
        <p className="text-gray-500 mt-1">{property.title}</p>
      </div>

      <div className="space-y-8">

        {/* BASIC */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input value={property.title} onChange={(e) => set("title", e.target.value)} placeholder="Property Title *" />
              <div className="flex gap-2">
                <Input value={property.slug} onChange={(e) => set("slug", e.target.value)} placeholder="Slug" />
                <Button type="button" variant="outline" onClick={generateSlug}><Wand2 size={15} /></Button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Select value={property.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue placeholder="Type *" /></SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyType).map((t) => (
                    <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={property.purpose} onValueChange={(v) => set("purpose", v)}>
                <SelectTrigger><SelectValue placeholder="Purpose *" /></SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyPurpose).map((p) => (
                    <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={property.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyStatus).map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
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
              <Input value={property.city} onChange={(e) => set("city", e.target.value)} placeholder="City *" />
              <Input value={property.area} onChange={(e) => set("area", e.target.value)} placeholder="Area / Sector" />
              <Input value={property.location} onChange={(e) => set("location", e.target.value)} placeholder="Full Address *" />
            </div>
            <Input value={property.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} placeholder="Google Maps URL" />
            {property.mapUrl && (
              <iframe src={getMapSrc(property.mapUrl)} className="w-full h-64 rounded-xl" />
            )}
          </CardContent>
        </Card>

        {/* PRICING */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input value={property.price} onChange={(e) => set("price", e.target.value)} placeholder="Price (PKR) *" type="number" />
              <div className="flex items-center gap-3 h-10">
                <Switch checked={property.isNegotiable} onCheckedChange={(v) => set("isNegotiable", v)} />
                <Label>Negotiable</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PHYSICAL */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Physical Details</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Input value={property.areaSize} onChange={(e) => set("areaSize", e.target.value)} placeholder="Area Size *" type="number" />
              <Select value={property.areaUnit} onValueChange={(v) => set("areaUnit", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(AreaUnit).map((u) => (
                    <SelectItem key={u} value={u}>{u.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={property.floors} onChange={(e) => set("floors", e.target.value)} placeholder="Floors" type="number" />
            </div>
            {needsRooms && (
              <div className="grid md:grid-cols-3 gap-4">
                <Input value={property.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} placeholder="Bedrooms" type="number" />
                <Input value={property.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="Bathrooms" type="number" />
                <Select value={property.furnishing} onValueChange={(v) => set("furnishing", v)}>
                  <SelectTrigger><SelectValue placeholder="Furnishing" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(FurnishingStatus).map((f) => (
                      <SelectItem key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</SelectItem>
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
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(featureInput); } }}
              />
              <Button type="button" variant="outline" onClick={() => addFeature(featureInput)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {FEATURES_SUGGESTIONS.filter((f) => !property.features.includes(f)).map((f) => (
                <button key={f} type="button" onClick={() => addFeature(f)}
                  className="text-xs px-2 py-1 rounded-full border border-dashed hover:bg-muted transition">
                  + {f}
                </button>
              ))}
            </div>
            {property.features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {property.features.map((f) => (
                  <Badge key={f} className="flex items-center gap-1 py-1.5">
                    {f} <X size={12} className="cursor-pointer ml-1" onClick={() => removeFeature(f)} />
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
            <QuillEditor value={property.description} onChange={(v) => set("description", v)} minHeight={360} />
          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Images</h2>
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer">
              <UploadCloud className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-gray-500 text-sm">Click to add more images</p>
              <input type="file" multiple accept="image/*" ref={fileInputRef}
                onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border bg-white shadow-sm group">
                    <div className="relative h-32 overflow-hidden">
                      <Image src={img.url} alt="preview" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button type="button" onClick={() => moveImage(i, "up")} className="bg-white/90 p-1.5 rounded-full shadow"><ArrowLeft size={12} /></button>
                      <button type="button" onClick={() => moveImage(i, "down")} className="bg-white/90 p-1.5 rounded-full shadow"><ArrowRight size={12} /></button>
                    </div>
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition">
                      <button type="button" onClick={() => removeImage(i)} className="bg-red-500 text-white p-1.5 rounded-full shadow"><X size={12} /></button>
                    </div>
                    {img.type === "new" && (
                      <div className="absolute bottom-2 right-2 text-[10px] bg-primary text-black px-1.5 py-0.5 rounded">new</div>
                    )}
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
            <Input value={property.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Meta Title" />
            <Input value={property.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} placeholder="Meta Description" />
          </CardContent>
        </Card>

        {/* PUBLISH */}
        <Card>
          <CardContent className="p-6 flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-3">
              <Switch checked={property.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} />
              <Label>Mark as Featured</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={property.isPublished} onCheckedChange={(v) => set("isPublished", v)} />
              <Label>Publish (make public)</Label>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-50">
        <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN.PROPERTIES.LIST)}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading} className="px-8">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}