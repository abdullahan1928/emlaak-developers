"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

import { ROUTES } from "@/routes";
import { Category } from "@/enums/project.enum";
import { enumToOptions } from "@/lib/enum";
import Image from "next/image";

export default function ProjectsPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const categories = enumToOptions(Category);

  // 🔥 debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(t);
  }, [search]);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const res = await axios.get("/api/projects", {
        params: {
          page,
          limit,
          search: debouncedSearch,
          category,
          sortBy,
          order,
        },
      });

      setData(res.data.projects);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, debouncedSearch, category, sortBy, order, limit]);

  const totalPages = Math.ceil(total / limit);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Projects
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Premium real estate portfolio management
          </p>
        </div>

        <Button onClick={() => router.push(ROUTES.ADMIN.PROJECTS.NEW)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* FILTERS */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-5 flex flex-wrap gap-4 items-center">

          {/* SEARCH */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          {/* CATEGORY */}
          <Select
            value={category}
            onValueChange={(val) => {
              setPage(1);
              setCategory(val);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* SORT */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="startingPrice">Price</SelectItem>
            </SelectContent>
          </Select>

          {/* ORDER */}
          <Button
            variant="outline"
            onClick={() =>
              setOrder(order === "asc" ? "desc" : "asc")
            }
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {order}
          </Button>

          {/* PAGE SIZE */}
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setPage(1);
              setLimit(Number(val));
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading project data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              data.map((project) => (
                <TableRow key={project._id.toString()}>
                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={project.images[0]?.url}
                      alt={project.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      width={1000}
                      height={1000}
                    />
                    <div>
                      <p className="font-medium">
                        {project.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.location}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{project.category}</TableCell>

                  <TableCell className="font-semibold">
                    {formatPrice(project.startingPrice)}
                  </TableCell>

                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-black text-white">
                      {project.status}
                    </span>
                  </TableCell>

                  <TableCell className="space-x-2">
                    {project.tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        router.push(
                          ROUTES.ADMIN.PROJECTS.EDIT(project._id.toString())
                        )
                      }
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={async () => {
                        if (!confirm("Delete this project?")) return;

                        await axios.delete(
                          `/api/projects/${project._id.toString()}`
                        );
                        fetchProjects();
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* PAGINATION */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="px-4 text-sm">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}