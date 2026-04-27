"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Plus, Pencil, Trash2, Search, Eye, Clock } from "lucide-react";

import { ROUTES } from "@/routes";
import { BlogCategory, BlogStatus } from "@/enums/blog.enum";
import { IBlog } from "@/models/blog.model";
import { enumToOptions } from "@/lib/enum";

export default function AdminBlogsPage() {
  const router = useRouter();

  const [data, setData] = useState<IBlog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const categories = enumToOptions(BlogCategory);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/blogs", {
        params: {
          page,
          limit,
          search: debouncedSearch,
          category: category === "all" ? "" : category,
          published: status === "all" ? "all" : status === "published" ? "true" : "false",
          sortBy: "createdAt",
          order: "desc",
        },
      });
      setData(res.data.blogs);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, debouncedSearch, category, status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    await axios.delete(`/api/blogs/${id}`);
    fetchBlogs();
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} posts total</p>
        </div>
        <Button onClick={() => router.push(ROUTES.ADMIN.BLOGS.NEW)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-9"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            />
          </div>

          <Select value={category} onValueChange={(v) => { setPage(1); setCategory(v); }}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => { setPage(1); setStatus(v); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Read Time</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No blog posts found
                </TableCell>
              </TableRow>
            ) : (
              data.map((blog) => (
                <TableRow key={blog._id?.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {blog.coverImage ? (
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          width={56}
                          height={40}
                          className="w-14 h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                          {blog.title?.[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs capitalize px-2 py-1 bg-muted rounded-full">
                      {blog.category?.replace("-", " ")}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm">{blog.author}</TableCell>

                  <TableCell>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} /> {blog.readTime} min
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye size={12} /> {blog.views}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${blog.status === BlogStatus.PUBLISHED
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                      }`}>
                      {blog.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(blog.createdAt?.toString())}
                  </TableCell>

                  <TableCell className="text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => router.push(ROUTES.ADMIN.BLOGS.EDIT(blog._id!.toString()))}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(blog._id!.toString())}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  );
}