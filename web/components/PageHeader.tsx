"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-20 px-6 bg-black flex flex-col items-center text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#0096c7]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="mt-8 w-24 h-1 bg-[#0096c7] mx-auto rounded-full" />
      </motion.div>
    </section>
  );
}
