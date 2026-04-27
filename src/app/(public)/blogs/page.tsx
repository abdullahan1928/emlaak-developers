"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  Search,
  CalendarDays,
  Clock3,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  createdAt: string;
}

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const totalPages = Math.ceil(total / limit);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/blogs", {
        params: {
          page,
          limit,
          search,
          published: true,
          sortBy: "createdAt",
          order: "desc",
        },
      });

      setBlogs(res.data.blogs || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, search]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-muted/40 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <Badge variant="outline" className="mb-4">
            Our Blog
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            Insights, Trends & Valuable Articles
          </h1>

          <p className="text-muted-foreground text-lg mt-5 max-w-2xl mx-auto">
            Explore expert content, updates, strategies, and guides designed to
            help modern readers stay informed.
          </p>

          <div className="max-w-xl mx-auto flex gap-3 mt-8">
            <Input
              placeholder="Search articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 rounded-xl"
            />

            <Button onClick={handleSearch} className="h-12 px-5 rounded-xl">
              <Search size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={28} />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold">No blogs found</h3>
            <p className="text-muted-foreground mt-2">
              Try changing your search keywords.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="overflow-hidden rounded-2xl border group hover:shadow-xl transition"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={blog.coverImage || "/placeholder.jpg"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="capitalize">
                        {blog.category.replace("-", " ")}
                      </Badge>

                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock3 size={14} />
                        {blog.readTime} min
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold line-clamp-2 leading-snug">
                      {blog.title}
                    </h2>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{blog.author}</span>

                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link href={`/blogs/${blog.slug}`}>
                      <Button className="w-full rounded-xl">
                        Read Article
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}