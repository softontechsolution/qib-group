"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHomepage } from "@/services/strapi";

export default function Hero() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getHomepage().then(setData);
  }, []);

  if (!data) return null;

  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-black text-white">

      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#0096c7] opacity-20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold">
          {data.heroTitle}
        </h1>

        <p className="mt-6 text-gray-300">
          {data.heroSubtitle}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-8 px-8 py-4 bg-[#0096c7] text-white rounded-xl"
        >
          {data.heroButton}
        </motion.button>
      </motion.div>
    </section>
  );
}