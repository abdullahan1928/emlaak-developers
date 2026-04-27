"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";

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
import { X, Loader2, UploadCloud, Wand2, ImageIcon } from "lucide-react";

import { ROUTES } from "@/routes";
import { slugify } from "@/lib/slugify";
import { BlogCategory, BlogStatus } from "@/enums/blog.enum";
import { enumToOptions } from "@/lib/enum";

const QuillEditor = dynamic(
  () => import("@/components/quill-editor").then((m) => m.QuillEditor),
  {
    ssr: false,
    loading: () => <div className="h-[500px] border rounded-md animate-pulse bg-muted" />,
  }
);

export default function NewBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");

  const [blog, setBlog] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: BlogCategory.NEWS,
    author: "Admin",
    tags: [] as string[],
    status: BlogStatus.DRAFT,
    metaTitle: "",
    metaDescription: "",
  });

  const set = (key: string, value: any) =>
    setBlog((prev) => ({ ...prev, [key]: value }));

  const categories = enumToOptions(BlogCategory);

  // Tags
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !blog.tags.includes(t)) {
      set("tags", [...blog.tags, t]);
      setTagInput("");
    }
  };
  const removeTag = (tag: string) =>
    set("tags", blog.tags.filter((t) => t !== tag));

  // Cover image
  const handleCover = (files: FileList | null) => {
    if (!files?.[0]) return;
    setCoverFile(files[0]);
    setCoverPreview(URL.createObjectURL(files[0]));
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
      const coverImageBase64 = coverFile ? await toBase64(coverFile) : undefined;

      await axios.post("/api/blogs", {
        ...blog,
        content,
        coverImageBase64,
      });

      router.push(ROUTES.ADMIN.BLOGS.LIST);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-32 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
        <p className="text-gray-500 mt-1">Write and publish a blog article</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC */}
        <Card>
          <CardContent className="p-6 space-y-5">
            <h2 className="text-lg font-semibold">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input
                  placeholder="e.g. Top 5 Investment Opportunities in 2025"
                  value={blog.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Slug</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="auto-generated from title"
                    value={blog.slug}
                    onChange={(e) => set("slug", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => set("slug", slugify(blog.title))}
                  >
                    <Wand2 size={15} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Excerpt *</Label>
              <Textarea
                placeholder="A short summary shown on listing cards (1–2 sentences)"
                rows={2}
                value={blog.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                className="resize-none"
                required
              />
              <p className="text-xs text-gray-400">{blog.excerpt.length} / 200 chars</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Category *</Label>
                <Select value={blog.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label.replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Author</Label>
                <Input
                  placeholder="Author name"
                  value={blog.author}
                  onChange={(e) => set("author", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={blog.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BlogStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={BlogStatus.PUBLISHED}>Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COVER IMAGE */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Cover Image</h2>

            {coverPreview ? (
              <div className="relative w-full h-64 rounded-xl overflow-hidden group">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(""); }}
                    className="opacity-0 group-hover:opacity-100 transition bg-red-500 text-white p-2 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-gray-50 transition cursor-pointer"
              >
                <ImageIcon className="mx-auto mb-3 text-gray-300" size={36} />
                <p className="text-gray-500 text-sm">Click to upload cover image</p>
                <p className="text-gray-400 text-xs mt-1">Recommended: 1200×630px (16:9)</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => handleCover(e.target.files)}
              className="hidden"
            />

            {!coverPreview && (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <UploadCloud size={16} className="mr-2" /> Upload Cover Image
              </Button>
            )}
          </CardContent>
        </Card>

        {/* TAGS */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Tags</h2>

            <div className="flex gap-2">
              <Input
                placeholder="Add tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTag(); }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>

            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1 py-1.5">
                    {tag}
                    <X size={12} className="cursor-pointer ml-1" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CONTENT */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Content *</h2>
            <QuillEditor
              value={content}
              onChange={setContent}
              minHeight={540}
              placeholder="Write your blog article here..."
            />
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              SEO <span className="text-sm font-normal text-gray-400">(optional)</span>
            </h2>
            <div className="space-y-1">
              <Label>Meta Title</Label>
              <Input
                placeholder="Defaults to post title"
                value={blog.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Meta Description</Label>
              <Textarea
                placeholder="150–160 characters for search engines"
                rows={3}
                value={blog.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                className="resize-none"
              />
              <p className="text-xs text-gray-400">{blog.metaDescription.length} / 160</p>
            </div>
          </CardContent>
        </Card>

      </form>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-50">
        <Button variant="outline" onClick={() => router.push(ROUTES.ADMIN.BLOGS.LIST)}>
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={() => { set("status", BlogStatus.DRAFT); handleSubmit({ preventDefault: () => { } } as any); }}
          disabled={loading}
        >
          Save Draft
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="px-8">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Publish Post"}
        </Button>
      </div>
    </div>
  );
}