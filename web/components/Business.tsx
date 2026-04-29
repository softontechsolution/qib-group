"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBusinesses } from "@/services/strapi";

interface BusinessItem {
  id: number;
  name: string;
  description: string;
}

export default function Business() {
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);

  useEffect(() => {
    getBusinesses().then(setBusinesses);
  }, []);

  return (
    <section id="businesses" className="py-32 px-6 max-w-7xl mx-auto bg-white text-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold">Our Businesses</h2>
        <div className="h-1.5 w-24 bg-[#0096c7] mx-auto mt-4 rounded-full"></div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {businesses.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="p-8 border border-white/5 rounded-3xl bg-[#0096c7]/15 backdrop-blur-md shadow-xl hover:border-[#0096c7]/30 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-[#0096c7]/20 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-[#0096c7] font-bold">{index + 1}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0096c7] mb-4">{item.name}</h3>
            <p className="text-gray-800 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}