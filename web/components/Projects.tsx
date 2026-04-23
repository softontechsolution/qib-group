"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProjects } from "@/services/strapi";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <section className="p-20 bg-gray-950 text-white">
      <h2 className="text-4xl text-center font-bold">
        Featured Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.02 }}
            className="p-8 border border-gray-700 rounded-2xl"
          >
            <h3 className="text-2xl font-bold">
              {project.title || project.attributes?.title}
            </h3>

            <p className="mt-4 text-gray-400">
              {project.description || project.attributes?.description}
            </p>

            <p className="mt-2 text-[#0096c7]">
              {project.location || project.attributes?.location}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}