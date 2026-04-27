"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  CalendarDays,
  Clock3,
  ArrowLeft,
  User2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  createdAt: string;
}

export default function SingleBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/api/blogs/slug/${slug}`);
      setBlog(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-bold">Blog not found</h2>
        <p className="text-muted-foreground mt-2">
          This article may have been removed.
        </p>

        <Link href="/blogs" className="mt-6">
          <Button>
            <ArrowLeft size={16} className="mr-2" />
            Back to Blogs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link href="/blogs">
            <Button variant="ghost" className="mb-6 px-0">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blogs
            </Button>
          </Link>

          <div className="space-y-5">
            <Badge className="capitalize">{blog.category}</Badge>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              {blog.title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {blog.excerpt}
            </p>

            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-2">
                <User2 size={15} />
                {blog.author}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                {blog.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover */}
      {blog.coverImage && (
        <section className="max-w-6xl mx-auto px-6 pt-10">
          <div className="relative w-full h-[280px] md:h-[520px] rounded-3xl overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-5xl mx-auto py-14 ql-snow!">
        <div
          className="ql-editor!
      prose prose-lg max-w-none
    "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t">
            {blog.tags.map((tag) => (
              <Badge key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}