"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNews } from "@/services/strapi";

export default function News() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    getNews().then(setArticles);
  }, []);

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto bg-white text-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold">Latest News</h2>
        <div className="h-1.5 w-24 bg-[#0096c7] mx-auto mt-4 rounded-full"></div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className="group p-8 border border-white/5 rounded-3xl bg-[#0096c7]/15 backdrop-blur-sm shadow-xl hover:border-[#0096c7]/30 transition-all duration-300"
          >
            <h3 className="text-2xl font-bold text-[#0096c7] mb-4 group-hover:text-[#0096c7] transition-colors">
              {article.title || article.attributes?.title}
            </h3>

            <p className="text-gray-800 leading-relaxed mb-6">
              {article.excerpt || article.attributes?.excerpt}
            </p>

            <div className="text-[#0096c7] text-sm font-semibold tracking-wider uppercase">
              {article.publishedAt || article.attributes?.publishedAt}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}