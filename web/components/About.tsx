"use client";

import { useEffect, useState } from "react";
import { getHomepage } from "@/services/strapi";

export default function About() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getHomepage().then(setData);
  }, []);

  if (!data) return null;

  return (
    <section className="p-20 text-center bg-gray-950 text-white">
      <h2 className="text-4xl font-bold">Who We Are</h2>

      <p className="mt-6 max-w-2xl mx-auto text-gray-400">
        {data.aboutText}
      </p>
    </section>
  );
}