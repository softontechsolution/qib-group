"use client";

import { motion } from "framer-motion";

const businesses = [
  { name: "QIB Tech", desc: "Digital transformation solutions" },
  { name: "QIB Energy", desc: "Power and infrastructure" },
  { name: "QIB Logistics", desc: "Smart movement systems" }
];

export default function Business() {
  return (
    <section className="p-20 bg-black text-white">
      <h2 className="text-4xl text-center font-bold">Our Businesses</h2>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {businesses.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-8 border border-gray-700 rounded-2xl"
          >
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="mt-3 text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}