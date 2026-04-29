"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProjects } from "@/services/strapi";
import Link from "next/link";

interface ProjectItem {
  id: number;
  title?: string;
  description?: string;
  location?: string;
  attributes?: {
    title?: string;
    description?: string;
    location?: string;
  };
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <section className="py-32 px-10 w-full mx-auto bg-gray-100 text-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold">Featured Projects</h2>
        <div className="h-1.5 w-24 bg-[#0096c7] mx-auto mt-4 rounded-full"></div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="p-10 border border-white/5 rounded-[2rem] bg-[#0096c7]/15 backdrop-blur-md hover:border-[#0096c7]/40 transition-all duration-300"
          >
            <h3 className="text-3xl font-bold text-[#0096c7] mb-6">
              {project.title || project.attributes?.title}
            </h3>

            <p className="text-gray-800 text-lg leading-relaxed mb-8">
              {project.description || project.attributes?.description}
            </p>

            <div className="flex items-center gap-2 text-[#0096c7] font-medium bg-[#0096c7]/10 px-4 py-2 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-[#0096c7] rounded-full animate-pulse"></span>
              {project.location || project.attributes?.location}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-14"
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-8 py-4 border border-[#0096c7]/30 text-[#0096c7] rounded-2xl font-medium hover:bg-[#0096c7] hover:text-white hover:scale-105 transition-all duration-300 group"
        >
          See All Projects
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}