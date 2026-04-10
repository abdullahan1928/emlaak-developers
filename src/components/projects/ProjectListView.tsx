"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IProject } from "@/models/project.model";
import { Button } from "../ui/button";
import { ROUTES } from "@/routes";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/lib/price";

const ProjectListView = ({ projects, loading }: any) => {
  const router = useRouter();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-16">
      {projects.map((project: IProject, idx: number) => (
        <div
          key={project._id?.toString()}
          data-aos="fade-up"
          data-aos-delay={idx * 150}
          className="relative group flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden bg-secondary shadow-2xl hover:shadow-3xl transition-all duration-700 cursor-pointer"
          onClick={() =>
            router.push(ROUTES.PUBLIC.PROJECTS.VIEW(project?.slug!))
          }
        >
          {/* IMAGE */}
          <div className="relative w-full md:w-[55%] h-96 md:h-auto overflow-hidden">
            {project.images?.[0]?.url ? (
              <Image
                src={project.images[0].url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-5xl font-bold">
                {project.title?.[0] || "?"}
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition group-hover:from-black/70 group-hover:via-black/30"></div>

            {/* Status & Category */}
            <span className="absolute top-5 left-5 backdrop-blur-md bg-white/10 border border-white/20 text-white px-4 py-1 rounded-full text-xs font-medium tracking-wide">
              {project.category || "N/A"}
            </span>
            {project.projectStatus && (
              <span className="absolute top-5 right-5 bg-primary text-black px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                {project.projectStatus}
              </span>
            )}
          </div>

          {/* CONTENT PANEL */}
          <div className="absolute md:relative bottom-0 md:bottom-auto w-full md:w-[45%] bg-black/70 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-8 md:p-12 flex flex-col justify-between z-20 transition-all duration-700">
            <div className="space-y-4">
              {/* Title */}
              <h3 className="text-3xl font-bold text-white group-hover:text-primary transition duration-500">
                {project.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <MapPin size={16} className="text-primary" />
                <span>{project.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 pt-2 text-[10px] tracking-wider uppercase text-gray-300">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <div key={i} className="relative group">
                    <span className="transition-colors duration-500 group-hover:text-primary">
                      {tag}
                    </span>
                    {i < project.tags.slice(0, 3).length - 1 && (
                      <span className="mx-2 text-gray-500 transition-colors duration-500 group-hover:text-primary">
                        •
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-1/2"></span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <p className="text-sm uppercase text-white/60">
                  Starting From
                </p>
                <p className="text-primary text-xl font-semibold">
                  {formatPrice(project.startingPrice)}
                </p>
                <p className="text-base uppercase text-white/60">only</p>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                router.push(ROUTES.PUBLIC.PROJECTS.VIEW(project.slug!));
              }}
              className="mt-6 w-fit bg-primary text-black hover:bg-white rounded-lg shadow-lg px-6! py-5! transition-all duration-500"
            >
              View Project
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectListView;