"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { LayoutGrid, List, Search } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

import ProjectCards from "@/components/projects/ProjectCards";
import ProjectListView from "@/components/projects/ProjectListView";
import { IProject } from "@/models/project.model";

interface ProjectsClientProps {
  // initialData: { projects: IProject[]; total: number };
  categories: { label: string; value: string }[];
}

export default function ProjectsClient({ categories }: ProjectsClientProps) {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const limit = 9;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/projects", {
        params: {
          page,
          limit,
          search,
          category,
          sortBy: sort === "price" ? "startingPrice" : "createdAt",
          order: sort === "price" ? "asc" : "desc",
        },
      });
      setProjects(res.data.projects);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search, category, sort]);

  return (
    <div className="top-16 z-50 -mt-10 px-6">
      {/* Filters Section */}
      <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white border border-white/20 shadow-xl rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder="Search luxury projects..."
            className="pl-10 h-11 bg-white/80"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          <Select
            value={category}
            onValueChange={(val) => {
              setPage(1);
              setCategory(val);
            }}
          >
            <SelectTrigger className="w-40 h-11">
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

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44 h-11">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price">Price Low → High</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg overflow-hidden">
            <Button variant={view === "grid" ? "default" : "ghost"} onClick={() => setView("grid")}>
              <LayoutGrid size={18} />
            </Button>
            <Button variant={view === "list" ? "default" : "ghost"} onClick={() => setView("list")}>
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight">{total} Exclusive Projects</h2>
        </div>

        {!loading && projects.length === 0 && (
          <div className="text-center py-20 text-gray-500">No projects found.</div>
        )}

        {view === "grid" ? <ProjectCards projects={projects} loading={loading} /> : <ProjectListView projects={projects} loading={loading} />}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-16">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button variant="outline" disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}