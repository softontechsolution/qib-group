"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { getProjects } from "@/services/strapi";
import Link from "next/link";
import Image from "next/image";

/* ─── Fallback projects with images ─── */
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "Abuja Smart City Infrastructure",
    description:
      "A comprehensive urban development initiative transforming Abuja into a smart city with state-of-the-art digital infrastructure, IoT-enabled public services, and sustainable energy systems spanning over 50 km².",
    location: "Abuja, Nigeria",
    category: "Infrastructure",
    status: "In Progress",
    year: "2024",
    image: "/images/project-infrastructure.png",
    progress: 65,
    budget: "₦85B",
    impact: "2.5M+ residents",
  },
  {
    id: 2,
    title: "National Fiber Optic Network",
    description:
      "Deploying over 12,000 km of fiber optic cables across Nigeria, connecting underserved communities to high-speed internet and enabling digital inclusion for millions of citizens.",
    location: "Nationwide, Nigeria",
    category: "ICT",
    status: "In Progress",
    year: "2023",
    image: "/images/project-fiber.png",
    progress: 48,
    budget: "₦120B",
    impact: "10M+ citizens",
  },
  {
    id: 3,
    title: "Lagos Commercial Complex",
    description:
      "A landmark 45-storey mixed-use commercial tower in Victoria Island, featuring premium office spaces, retail outlets, and a rooftop observatory. Designed with LEED Gold sustainability standards.",
    location: "Lagos, Nigeria",
    category: "Construction",
    status: "Completed",
    year: "2023",
    image: "/images/project-commercial.png",
    progress: 100,
    budget: "₦45B",
    impact: "15,000 jobs",
  },
  {
    id: 4,
    title: "Agricultural Insurance Programme",
    description:
      "A pioneering insurance initiative providing coverage to over 500,000 smallholder farmers across Northern Nigeria, protecting livelihoods against climate risks and crop failure.",
    location: "Northern Nigeria",
    category: "Insurance",
    status: "Active",
    year: "2024",
    image: "/images/project-agriculture.png",
    progress: 80,
    budget: "₦15B",
    impact: "500K+ farmers",
  },
  {
    id: 5,
    title: "Port Harcourt Logistics Hub",
    description:
      "Establishing a world-class logistics and distribution center with integrated rail and road connectivity, cold storage facilities, and AI-powered inventory management systems.",
    location: "Port Harcourt, Nigeria",
    category: "Logistics",
    status: "In Progress",
    year: "2024",
    image: "/images/project-logistics.png",
    progress: 35,
    budget: "₦62B",
    impact: "8,000 jobs",
  },
  {
    id: 6,
    title: "Solar Power Plant Initiative",
    description:
      "A 200MW solar power installation across three Northern states, providing clean, renewable energy to over 1 million households and reducing carbon emissions by 300,000 tonnes annually.",
    location: "Kano, Kaduna & Katsina",
    category: "Infrastructure",
    status: "Planning",
    year: "2025",
    image: "/images/project-solar.png",
    progress: 12,
    budget: "₦95B",
    impact: "1M+ households",
  },
];

const CATEGORIES = [
  "All",
  "Infrastructure",
  "ICT",
  "Construction",
  "Insurance",
  "Logistics",
];

const STATS = [
  { label: "Active Projects", value: "120", suffix: "+" },
  { label: "Cities Covered", value: "35", suffix: "+" },
  { label: "People Impacted", value: "5M", suffix: "+" },
  { label: "Years Experience", value: "20", suffix: "+" },
];

const TIMELINE = [
  { year: "2005", event: "QIB Group founded in Abuja" },
  { year: "2010", event: "First major infrastructure contract" },
  { year: "2015", event: "ICT division launched" },
  { year: "2018", event: "100th project milestone" },
  { year: "2022", event: "Expanded to 35+ cities" },
  { year: "2025", event: "Pioneering smart city tech" },
];

/* ─── Sub-components ─── */

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    "In Progress": "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Active: "bg-[#0096c7]/15 text-[#0096c7] border-[#0096c7]/20",
    Planning: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  };

  const dotColorMap: Record<string, string> = {
    "In Progress": "bg-amber-400",
    Completed: "bg-emerald-400",
    Active: "bg-[#0096c7]",
    Planning: "bg-purple-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
        colorMap[status] || "bg-gray-500/15 text-gray-400 border-gray-500/20"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          dotColorMap[status] || "bg-gray-400"
        }`}
      />
      {status}
    </span>
  );
}

function CounterAnimation({ value, suffix }: { value: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const textSuffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / numericPart), 16);
    const timer = setInterval(() => {
      start += Math.ceil(numericPart / (duration / stepTime));
      if (start >= numericPart) {
        start = numericPart;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [numericPart]);

  return (
    <span>
      {count}
      {textSuffix}
      {suffix}
    </span>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="h-full rounded-full bg-gradient-to-r from-[#0096c7] to-[#48cae4]"
      />
    </div>
  );
}

/* ─── Main Page ─── */

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    getProjects()
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(FALLBACK_PROJECTS);
        }
      })
      .catch(() => {
        setProjects(FALLBACK_PROJECTS);
      });
  }, []);

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (p) =>
            (p.category || p.attributes?.category) === activeCategory
        );

  const featuredProject = projects[0]; // Spotlight the first project

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        ref={heroRef}
        className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        {/* Parallax background image */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="/images/projects-hero.png"
            alt="QIB Group Projects"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </motion.div>

        {/* Animated radial glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0096c7]/8 blur-[160px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#48cae4]/6 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#48cae4] text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#0096c7] rounded-full animate-pulse" />
              Our Portfolio
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-tight"
          >
            Building&nbsp;
            <span className="bg-gradient-to-r from-[#0096c7] via-[#48cae4] to-[#90e0ef] bg-clip-text text-transparent">
              Tomorrow
            </span>
            <br />
            <span className="text-white/90">Today</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Transformative initiatives across infrastructure, technology, and
            finance — shaping Nigeria&apos;s future through bold innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#projects-grid"
              className="px-8 py-4 bg-[#0096c7] text-white rounded-2xl font-medium hover:bg-[#0077b6] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0096c7]/25"
            >
              Explore Projects
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/10 text-gray-300 rounded-2xl font-medium hover:border-[#0096c7]/40 hover:text-white backdrop-blur-sm transition-all duration-300"
            >
              Partner With Us
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-3 bg-[#0096c7] rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto px-6 -mt-16 mb-20 relative z-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 md:p-8 rounded-2xl bg-gray-900/60 border border-white/5 backdrop-blur-xl text-center group hover:border-[#0096c7]/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#0096c7]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <p className="text-3xl md:text-4xl font-bold text-white relative z-10">
                <CounterAnimation value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-gray-500 mt-2 relative z-10 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ FEATURED PROJECT SPOTLIGHT ═══════════════ */}
      {featuredProject && (
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <span className="text-[#0096c7] font-semibold text-sm uppercase tracking-widest">
              Featured Project
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
              Project Spotlight
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden border border-white/5 group"
          >
            {/* Background image */}
            <div className="relative h-[500px] md:h-[550px] overflow-hidden">
              <Image
                src={featuredProject.image || "/images/project-infrastructure.png"}
                alt={featuredProject.title || featuredProject.attributes?.title || "Featured Project"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <StatusBadge
                    status={
                      featuredProject.status ||
                      featuredProject.attributes?.status ||
                      "Active"
                    }
                  />
                  <span className="text-xs uppercase tracking-widest text-[#0096c7]/80 font-semibold">
                    {featuredProject.category ||
                      featuredProject.attributes?.category}
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {featuredProject.title ||
                    featuredProject.attributes?.title}
                </h3>

                <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                  {featuredProject.description ||
                    featuredProject.attributes?.description}
                </p>

                {/* Project metrics */}
                <div className="flex flex-wrap gap-6 mb-8">
                  {featuredProject.budget && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Budget</p>
                      <p className="text-lg font-bold text-white">{featuredProject.budget}</p>
                    </div>
                  )}
                  {featuredProject.impact && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Impact</p>
                      <p className="text-lg font-bold text-white">{featuredProject.impact}</p>
                    </div>
                  )}
                  {featuredProject.location && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-lg font-bold text-white">
                        {featuredProject.location ||
                          featuredProject.attributes?.location}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress */}
                {featuredProject.progress !== undefined && (
                  <div className="max-w-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">
                        Project Progress
                      </span>
                      <span className="text-xs text-[#0096c7] font-semibold">
                        {featuredProject.progress}%
                      </span>
                    </div>
                    <ProgressBar progress={featuredProject.progress} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════ FILTER TABS ═══════════════ */}
      <section id="projects-grid" className="max-w-7xl mx-auto px-6 mb-12 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            All Projects
          </h2>
          <p className="text-gray-500 max-w-xl">
            Browse our comprehensive portfolio of transformative projects across
            multiple sectors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-[#0096c7] text-white border-[#0096c7] shadow-lg shadow-[#0096c7]/25"
                  : "bg-gray-900/40 text-gray-400 border-white/5 hover:border-[#0096c7]/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════ PROJECT GRID ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((project, index) => {
              const title =
                project.title || project.attributes?.title || "Untitled";
              const description =
                project.description ||
                project.attributes?.description ||
                "";
              const location =
                project.location || project.attributes?.location || "";
              const category =
                project.category || project.attributes?.category || "";
              const status =
                project.status || project.attributes?.status || "Active";
              const year =
                project.year || project.attributes?.year || "";
              const projectImage =
                project.image || "/images/project-infrastructure.png";
              const progress = project.progress;
              const budget = project.budget;
              const impact = project.impact;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedProject(project)}
                  className="group relative rounded-[1.75rem] bg-gray-900/30 border border-white/5 backdrop-blur-sm hover:border-[#0096c7]/30 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  {/* Project Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={projectImage}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                    {/* Category badge on image */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-[#48cae4] border border-white/10">
                        {category}
                      </span>
                    </div>

                    {/* Status badge on image */}
                    <div className="absolute top-4 right-4">
                      <StatusBadge status={status} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7">
                    {/* Hover glow */}
                    <div
                      className={`absolute -top-12 -right-12 w-40 h-40 bg-[#0096c7]/10 blur-3xl rounded-full transition-all duration-700 ${
                        hoveredId === project.id
                          ? "opacity-100 scale-150"
                          : "opacity-0 scale-100"
                      }`}
                    />

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 relative z-10 group-hover:text-[#48cae4] transition-colors duration-300 line-clamp-2">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 relative z-10 line-clamp-2">
                      {description}
                    </p>

                    {/* Progress bar */}
                    {progress !== undefined && (
                      <div className="mb-5 relative z-10">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[11px] text-gray-600 font-medium">
                            Progress
                          </span>
                          <span className="text-[11px] text-[#0096c7] font-semibold">
                            {progress}%
                          </span>
                        </div>
                        <ProgressBar progress={progress} />
                      </div>
                    )}

                    {/* Metrics row */}
                    <div className="flex items-center gap-4 mb-5 relative z-10">
                      {budget && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 text-[#0096c7]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {budget}
                        </div>
                      )}
                      {impact && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 text-[#0096c7]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {impact}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-xs">{location}</span>
                      </div>

                      {year && (
                        <span className="text-xs text-gray-600 font-medium">
                          {year}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute bottom-7 right-7 w-10 h-10 rounded-full bg-[#0096c7]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-[#0096c7]"
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
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </section>

      {/* ═══════════════ TIMELINE ═══════════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0096c7] font-semibold text-sm uppercase tracking-widest">
            Our Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            Project Milestones
          </h2>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#0096c7]/30 to-transparent -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-0 relative">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`flex items-center md:mb-16 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                  <div className={`p-6 rounded-2xl bg-gray-900/30 border border-white/5 backdrop-blur-sm hover:border-[#0096c7]/20 transition-all duration-300 inline-block`}>
                    <span className="text-[#0096c7] font-bold text-2xl">
                      {item.year}
                    </span>
                    <p className="text-gray-400 mt-2 text-sm">
                      {item.event}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex w-4 h-4 bg-[#0096c7] rounded-full border-4 border-black z-10 shrink-0" />

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 pb-24"
      >
        <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-[#0096c7]/10 via-gray-900/50 to-gray-900/30 border border-[#0096c7]/15 backdrop-blur-sm overflow-hidden text-center">
          {/* Decorative glows */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#0096c7]/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#48cae4]/8 blur-[80px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-[#0096c7]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#0096c7]/20">
              <svg className="w-8 h-8 text-[#0096c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Partner with QIB Group to bring your vision to life. Our team of
              experts is ready to deliver exceptional results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-[#0096c7] text-white rounded-2xl font-medium hover:bg-[#0077b6] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0096c7]/20"
              >
                Start a Conversation
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border border-white/10 text-gray-300 rounded-2xl font-medium hover:border-[#0096c7]/40 hover:text-white transition-all duration-300"
              >
                Learn About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════ PROJECT DETAIL MODAL ═══════════════ */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-gray-900/95 border border-white/10 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Image */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={selectedProject.image || "/images/project-infrastructure.png"}
                  alt={selectedProject.title || selectedProject.attributes?.title || "Project"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-10 -mt-16 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <StatusBadge
                    status={
                      selectedProject.status ||
                      selectedProject.attributes?.status ||
                      "Active"
                    }
                  />
                  <span className="text-xs uppercase tracking-widest text-[#0096c7]/80 font-semibold">
                    {selectedProject.category ||
                      selectedProject.attributes?.category}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {selectedProject.title ||
                    selectedProject.attributes?.title}
                </h2>

                <p className="text-gray-400 text-base leading-relaxed mb-8">
                  {selectedProject.description ||
                    selectedProject.attributes?.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {selectedProject.year && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Year</p>
                      <p className="text-lg font-bold text-white">{selectedProject.year || selectedProject.attributes?.year}</p>
                    </div>
                  )}
                  {selectedProject.budget && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Budget</p>
                      <p className="text-lg font-bold text-white">{selectedProject.budget}</p>
                    </div>
                  )}
                  {selectedProject.impact && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Impact</p>
                      <p className="text-lg font-bold text-white">{selectedProject.impact}</p>
                    </div>
                  )}
                  {(selectedProject.location || selectedProject.attributes?.location) && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-lg font-bold text-white">{selectedProject.location || selectedProject.attributes?.location}</p>
                    </div>
                  )}
                </div>

                {/* Progress */}
                {selectedProject.progress !== undefined && (
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium">
                        Overall Progress
                      </span>
                      <span className="text-sm text-[#0096c7] font-semibold">
                        {selectedProject.progress}%
                      </span>
                    </div>
                    <ProgressBar progress={selectedProject.progress} />
                  </div>
                )}

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0096c7] text-white rounded-xl font-medium hover:bg-[#0077b6] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0096c7]/20"
                >
                  Inquire About This Project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
