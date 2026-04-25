"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

const teamMembers = [
  {
    name: "Amen Musa",
    role: "Director of ICT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    skills: ["Strategy", "Cloud Architecture", "Leadership"]
  },
  {
    name: "Caleb Destiny",
    role: "Lead Software Engineer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    skills: ["React", "Node.js", "AI Integration"]
  },
  {
    name: "Joseph Ibrahim",
    role: "Cybersecurity Specialist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    skills: ["Network Security", "Ethical Hacking", "Compliance"]
  },
  {
    name: "Sarah Chen",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    skills: ["Product Design", "Prototyping", "Figma"]
  },
  {
    name: "David Smith",
    role: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
    skills: ["CI/CD", "Kubernetes", "AWS"]
  },
  {
    name: "Lydia Nkosi",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    skills: ["Machine Learning", "Python", "Data Viz"]
  }
];

export default function TeamSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedMembers = showAll ? teamMembers : teamMembers.slice(0, 3);

  return (
    <div className="mt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Our ICT Team</h2>
        <div className="h-1 w-20 bg-[#0096c7] mx-auto rounded-full"></div>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Meet the experts driving our technological innovation and delivering world-class solutions.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {displayedMembers.map((member, index) => (
            <motion.div
              key={member.name}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.5,
                delay: showAll && index >= 3 ? (index - 3) * 0.1 : 0 
              }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative h-[450px] rounded-3xl overflow-hidden border border-white/10 bg-gray-900/40 backdrop-blur-sm shadow-2xl">
                {/* Member Image */}
                <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{member.name}</h3>
                  <p className="text-[#0096c7] font-medium mb-4">{member.role}</p>
                  
                  <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">
                    {member.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Decorative Accent */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                  <div className="w-2 h-2 bg-[#0096c7] rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        layout
        className="mt-16 flex justify-center"
      >
        <button
          onClick={() => setShowAll(!showAll)}
          className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-[#0096c7] border border-white/10 hover:border-[#0096c7] rounded-2xl text-white font-bold transition-all duration-300"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </>
          ) : (
            <>
              See All Team <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
