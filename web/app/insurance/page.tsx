"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Shield, HeartPulse, Car, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const slides = [
  {
    image: "/insurance1.jpg",
    title: "Protect What Matters",
    description: "Comprehensive insurance solutions for individuals and businesses."
  },
  {
    image: "/insurance2.jpg",
    title: "Fast Claims Process",
    description: "Reliable support when you need it most."
  },
  {
    image: "/insurance3.jpg",
    title: "Trusted Nationwide",
    description: "Serving clients across Nigeria with confidence."
  }
];

const features = [
  { icon: HeartPulse, title: "Health Insurance" },
  { icon: Car, title: "Auto Insurance" },
  { icon: Building2, title: "Corporate Insurance" }
];

const policies = [
  "Life Insurance",
  "Health Insurance",
  "Motor Insurance",
  "Travel Insurance",
  "Property Insurance",
  "Business Protection"
];

const testimonials = [
  {
    name: "Amina Yusuf",
    text: "QIB Insurance made my claims process simple and stress-free."
  },
  {
    name: "David Okeke",
    text: "Professional service and excellent customer support."
  },
  {
    name: "Fatima Bello",
    text: "Their business protection plans gave us peace of mind."
  }
];

export default function InsurancePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar showLogin />

      <main className="bg-black text-white pt-24">
        {/* Hero Slider */}
        <section className="relative h-[85vh] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-6">
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold">
                    {slide.title}
                  </h1>
                  <p className="mt-6 max-w-2xl text-gray-300">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Feature Cards */}
        <section className="px-8 md:px-20 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="p-10 border border-gray-700 rounded-2xl text-center cursor-pointer"
              >
                <item.icon className="mx-auto w-12 h-12 text-yellow-500" />
                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
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
              "24/7 Customer Support"
            ].map((benefit) => (
              <div key={benefit} className="p-6 border border-gray-700 rounded-2xl">
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
                key={policy}
                whileHover={{ scale: 1.03 }}
                className="p-8 border border-gray-700 rounded-2xl cursor-pointer"
              >
                <Shield className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold">{policy}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-8 md:px-20 py-20 bg-gray-950">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold">Contact Us</h2>
              <p className="mt-6 text-gray-400">Email: insurance@qibgroup.com</p>
              <p className="text-gray-400">Phone: +234 800 000 0000</p>
              <p className="text-gray-400">Abuja, Nigeria</p>
            </div>

            <form className="space-y-4">
              <input placeholder="Your Name" className="w-full p-4 bg-black rounded-xl" />
              <input placeholder="Email" className="w-full p-4 bg-black rounded-xl" />
              <textarea placeholder="Message / Report Issue" rows={5} className="w-full p-4 bg-black rounded-xl" />
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
              <div key={item.name} className="p-8 border border-gray-700 rounded-2xl">
                <p className="text-gray-400">"{item.text}"</p>
                <p className="mt-6 text-yellow-500 font-bold">{item.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}