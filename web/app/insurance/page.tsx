"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import {
  getInsurancePage,
  getInsuranceSlides,
  getInsuranceFeatures,
  getInsurancePolicies,
  getTestimonials,
} from "@/services/strapi";

export default function InsurancePage() {
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    getInsurancePage().then(setPage);
    getInsuranceSlides().then(setSlides);
    getInsuranceFeatures().then(setFeatures);
    getInsurancePolicies().then(setPolicies);
    getTestimonials().then(setTestimonials);
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!page) return null;

  return (
    <>
      <Navbar showLogin />

      <main className="bg-black text-white pt-24">
        {/* Hero Slider */}
        <section className="relative h-[85vh] overflow-hidden">
          {slides.map((slide, index) => {
            console.log(slide);
            const imageUrl =
              slide.image?.url
                ? `http://localhost:1337${slide.image.url}`
                : slide.attributes?.image?.data?.attributes?.url
                ? `http://localhost:1337${slide.attributes.image.data.attributes.url}`
                : "";

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-6">
                  <div>
                    <h1 className="text-5xl md:text-7xl font-bold">
                      {slide.title || slide.attributes?.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-gray-300">
                      {slide.description || slide.attributes?.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Feature Cards */}
        <section className="px-8 md:px-20 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="p-10 border border-gray-700 rounded-2xl text-center cursor-pointer"
              >
                <Shield className="mx-auto w-12 h-12 text-yellow-500" />
                <h3 className="mt-6 text-xl font-bold">
                  {item.title || item.attributes?.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="px-8 md:px-20 py-20 bg-gray-950">
          <h2 className="text-4xl font-bold text-center">Why Choose Us</h2>

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {[
              "Trusted Nationwide",
              "Fast Claim Processing",
              "Affordable Premiums",
              "24/7 Customer Support",
            ].map((benefit) => (
              <div
                key={benefit}
                className="p-6 border border-gray-700 rounded-2xl"
              >
                {benefit}
              </div>
            ))}
          </div>
        </section>

        {/* Insurance Policies */}
        <section className="px-8 md:px-20 py-20">
          <h2 className="text-4xl font-bold text-center">Our Policies</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {policies.map((policy) => (
              <motion.div
                key={policy.id}
                whileHover={{ scale: 1.03 }}
                className="p-8 border border-gray-700 text-center rounded-2xl cursor-pointer"
              >
                <Shield className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />

                <h3 className="text-xl font-bold">
                  {policy.title || policy.attributes?.title}
                </h3>

                <p className="mt-3 text-gray-400">
                  {policy.description || policy.attributes?.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-8 md:px-20 py-20 bg-gray-950">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold">Contact Us</h2>

              <p className="mt-6 text-gray-400">
                Email: {page.contactEmail || page.attributes?.contactEmail}
              </p>

              <p className="text-gray-400">
                Phone: {page.contactPhone || page.attributes?.contactPhone}
              </p>

              <p className="text-gray-400">
                {page.contactAddress || page.attributes?.contactAddress}
              </p>
            </div>

            <form className="space-y-4">
              <input
                placeholder="Your Name"
                className="w-full p-4 bg-black rounded-xl"
              />

              <input
                placeholder="Email"
                className="w-full p-4 bg-black rounded-xl"
              />

              <textarea
                placeholder="Message / Report Issue"
                rows={5}
                className="w-full p-4 bg-black rounded-xl"
              />

              <button className="px-8 py-4 bg-yellow-500 text-black rounded-xl">
                Submit
              </button>
            </form>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-8 md:px-20 py-20">
          <h2 className="text-4xl font-bold text-center">Testimonials</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-8 border border-gray-700 rounded-2xl"
              >
                <p className="text-gray-400">
                  "{item.testimony || item.attributes?.testimony}"
                </p>

                <p className="mt-6 text-yellow-500 font-bold">
                  {item.name || item.attributes?.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}