"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-black text-white">
      
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-yellow-500 opacity-20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold">
          Building Africa’s <br /> Future
        </h1>

        <p className="mt-6 text-gray-300">
          Technology • Insurance • Innovation
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-8 px-8 py-4 bg-yellow-500 text-black rounded-xl"
        >
          Explore More
        </motion.button>
      </motion.div>
    </section>
  );
}