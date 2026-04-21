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
    <section className="p-20 bg-gray-950 text-white">
      <h2 className="text-4xl text-center font-bold">
        Latest News
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        {articles.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ scale: 1.03 }}
            className="border border-gray-700 rounded-2xl p-6"
          >
            <h3 className="text-2xl font-bold">
              {article.title || article.attributes?.title}
            </h3>

            <p className="mt-4 text-gray-400">
              {article.excerpt || article.attributes?.excerpt}
            </p>

            <p className="mt-3 text-yellow-500">
              {article.publishedAt || article.attributes?.publishedAt}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}