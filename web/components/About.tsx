"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function About() {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="p-20 text-center bg-gray-950 text-white"
    >
      <h2 className="text-4xl font-bold">Who We Are</h2>

      <p className="mt-6 max-w-2xl mx-auto text-gray-400">
        QIB Group is a diversified enterprise transforming Africa through
        technology, infrastructure and innovation.
      </p>
    </motion.section>
  );
}