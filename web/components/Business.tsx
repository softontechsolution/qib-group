"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBusinesses } from "@/services/strapi";

export default function Business() {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    getBusinesses().then(setBusinesses);
  }, []);

  return (
    <section className="p-20 bg-black text-white">
      <h2 className="text-4xl text-center font-bold">
        Our Businesses
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {businesses.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="p-8 border border-gray-700 rounded-2xl"
          >
            <h3 className="text-xl font-bold">
              {item.name}
            </h3>

            <p className="mt-3 text-gray-400">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}