"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getHeroSlides } from "@/services/strapi";

export default function Hero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getHeroSlides().then((res) => {
      if (res?.length) setSlides(res);
    });
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  const slide = slides[current];

  const imageUrl =
    slide.image?.url
      ? `http://localhost:1337${slide.image.url}`
      : slide.attributes?.image?.data?.attributes?.url
      ? `http://localhost:1337${slide.attributes.image.data.attributes.url}`
      : "";

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl text-white">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                {slide.title || slide.attributes?.title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
              >
                {slide.subtitle || slide.attributes?.subtitle}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href={slide.buttonLink || slide.attributes?.buttonLink || "#"}
                  className="inline-block mt-10 px-8 py-4 bg-[#0096c7] text-white rounded-xl font-semibold hover:opacity-90 transition"
                >
                  {slide.buttonText || slide.attributes?.buttonText}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current ? "bg-[#0096c7]" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}