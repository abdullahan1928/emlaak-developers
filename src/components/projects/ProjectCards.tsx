"use client";

import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { ROUTES } from "@/routes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { IProject } from "@/models/project.model";
import { formatPrice } from "@/lib/price";
import { MapPin } from "lucide-react";

interface ProjectCardsProps {
  projects: IProject[];
  loading: boolean;
}

const ProjectCards = ({ projects, loading }: ProjectCardsProps) => {
  const router = useRouter();

  const handleCardClick = (slug: string | undefined) => {
    router.push(ROUTES.PUBLIC.PROJECTS.VIEW(slug!));
  };

  return (
    <div className="grid grid-cols-1 gap-10 mt-12 md:grid-cols-2 lg:grid-cols-3">
      {loading
        ? Array.from(new Array(6)).map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl overflow-hidden bg-secondary shadow-2xl"
          >
            <div className="h-64"><Skeleton /></div>
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ))
        : projects.map((project, idx) => (
          <div
            key={project._id?.toString()}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
            onClick={() => handleCardClick(project.slug)}
            className="group cursor-pointer relative rounded-3xl overflow-hidden bg-secondary transition-all duration-500"
          >
            {/* 🔥 Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-primary/20 via-transparent to-transparent" />

            {/* IMAGE */}
            <div className="relative h-96 overflow-hidden">
              {project?.images?.[0]?.url ? (
                <Image
                  src={project.images[0].url}
                  alt={project.title}
                  fill
                  className="object-cover image-filter group-hover:filter-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-4xl font-bold text-gray-600">
                    {project.title?.[0] || "?"}
                  </span>
                </div>
              )}

              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent" />

              {/* Category */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-center">

                <span className="backdrop-blur-xl bg-white/10 border border-white/10 text-white px-4 py-1 rounded-full text-[10px] tracking-wider uppercase">
                  {project.category}
                </span>

                {project.projectStatus && (
                  <span className="bg-primary text-black px-4 py-1 rounded-full text-[10px] font-semibold shadow-md">
                    {project.projectStatus}
                  </span>
                )}
              </div>

              {/* 💰 Premium Glass Price Card */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="relative rounded-2xl overflow-hidden">

                  {/* Glass Base */}
                  <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">

                    {/* ✨ Inner Light Reflection */}
                    <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/50 via-transparent to-transparent opacity-30" />

                    {/* Content */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/60">
                        Starting From
                      </p>
                      <p className="text-primary text-xl font-semibold">
                        {formatPrice(project.startingPrice)}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="bg-primary text-black hover:bg-white rounded-full px-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(project.slug);
                      }}
                    >
                      View
                    </Button>
                  </div>

                  {/* 🌫️ Outer Glow */}
                  {/* <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" /> */}
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <h3 className="text-lg font-semibold text-white group-hover:text-primary transition duration-300">
                {project.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-primary" />
                <span className="truncate">{project.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-4 pt-3 text-[10px] tracking-wider uppercase text-gray-300">
                {project.tags.slice(0, 3).map((tag, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-center cursor-default group"
                  >
                    <span className="transition-colors duration-500 group-hover:text-primary">
                      {tag}
                    </span>
                    {idx < project.tags.slice(0, 3).length - 1 && (
                      <span className="mx-2 text-gray-500 transition-colors duration-500 group-hover:text-primary">•</span>
                    )}
                    {/* Hover underline sweep */}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-1/2"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProjectCards;