"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Clock3,
  Wallet,
  Headphones,
  HeartPulse,
  Car,
  Building2,
  LucideIcon,
} from "lucide-react";
import {
  getInsurancePage,
  getInsuranceSlides,
  getInsuranceFeatures,
  getInsurancePolicies,
  getInsuranceBenefits,
  getTestimonials,
} from "@/services/strapi";

interface StrapiImage {
  url: string;
}

interface StrapiAttributes {
  title?: string;
  description?: string;
  icon?: string;
  testimony?: string;
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  image?: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
}

interface PageData {
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  attributes?: StrapiAttributes;
}

interface Slide {
  id: number;
  title?: string;
  description?: string;
  image?: StrapiImage;
  attributes?: StrapiAttributes;
}

interface Feature {
  id: number;
  title?: string;
  icon?: string;
  attributes?: StrapiAttributes;
}

interface Policy {
  id: number;
  title?: string;
  description?: string;
  icon?: string;
  attributes?: StrapiAttributes;
}

interface Benefit {
  id: number;
  title?: string;
  description?: string;
  icon?: string;
  attributes?: StrapiAttributes;
}

interface Testimonial {
  id: number;
  name?: string;
  testimony?: string;
  attributes?: StrapiAttributes;
}

const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  clock: Clock3,
  wallet: Wallet,
  support: Headphones,
  health: HeartPulse,
  car: Car,
  building: Building2,
};

export default function InsurancePage() {
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState<PageData>({
    contactEmail: "info@qibgroup.com",
    contactPhone: "+234 800 QIB GROUP",
    contactAddress: "Abuja, Nigeria"
  });
  const [slides, setSlides] = useState<Slide[]>([
    { id: 1, title: "Premium Insurance", description: "Protecting what matters most to you with tailored coverage." }
  ]);
  const [features, setFeatures] = useState<Feature[]>([
    { id: 1, title: "Life Insurance", icon: "heart" },
    { id: 2, title: "Auto Insurance", icon: "car" },
    { id: 3, title: "Home Insurance", icon: "building" }
  ]);
  const [policies, setPolicies] = useState<Policy[]>([
    { id: 1, title: "Comprehensive Cover", description: "All-inclusive protection for peace of mind.", icon: "shield" },
    { id: 2, title: "Standard Policy", description: "Reliable coverage for everyday needs.", icon: "wallet" },
    { id: 3, title: "Flexi-Plan", description: "Customizable insurance tailored to you.", icon: "clock" }
  ]);
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: 1, title: "Fast Claims", description: "Quick and hassle-free processing.", icon: "clock" },
    { id: 2, title: "Expert Support", description: "Available whenever you need us.", icon: "support" },
    { id: 3, title: "Global Reach", description: "Coverage that follows you anywhere.", icon: "shield" },
    { id: 4, title: "Secure Data", description: "Your information is always protected.", icon: "wallet" }
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: 1, name: "Ibrahim Ahmed", testimony: "QIB Group provided the best insurance package for my business." }
  ]);

  useEffect(() => {
    getInsurancePage().then(data => data && setPage(data));
    getInsuranceSlides().then(data => data?.length && setSlides(data));
    getInsuranceFeatures().then(data => data?.length && setFeatures(data));
    getInsurancePolicies().then(data => data?.length && setPolicies(data));
    getInsuranceBenefits().then(data => data?.length && setBenefits(data));
    getTestimonials().then(data => data?.length && setTestimonials(data));
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  return (
    <>
      <Navbar showLogin />

      <main className="bg-black text-white pt-24">
        {/* Hero Slider */}
        <section className="relative h-[85vh] overflow-hidden">
          {slides.map((slide, index) => {
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
                  backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-6">
                  <div>
                    <h1 className="text-5xl md:text-7xl font-bold">
                      {slide.title || slide.attributes?.title}
                    </h1>

                    <p className="mt-6 max-w-2xl text-gray-300 mx-auto">
                      {slide.description || slide.attributes?.description}
                    </p>

                    <Link
                      href="/buy-insurance"
                      className="inline-block mt-10 px-8 py-4 bg-[#0096c7] text-white rounded-2xl font-semibold hover:scale-105 transition"
                    >
                      CLICK HERE TO GET STARTED
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Feature Cards */}
        <section className="px-8 md:px-20 py-24 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, index) => {
              const iconName =
                (item.icon || item.attributes?.icon || "").toLowerCase();

              const Icon = iconMap[iconName] || Shield;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10 }}
                  className="p-12 border border-white/5 bg-gray-900/20 backdrop-blur-md rounded-[2rem] text-center cursor-pointer hover:border-[#0096c7]/30 transition-all shadow-xl"
                >
                  <Icon className="mx-auto w-14 h-14 text-[#0096c7] mb-6" />

                  <h3 className="text-2xl font-bold">
                    {item.title || item.attributes?.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us */}
       <section className="px-8 md:px-20 py-32 bg-gray-900/10 backdrop-blur-xl">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto text-center">
            {benefits.map((benefit, index) => {
              const iconName =
                (benefit.icon || benefit.attributes?.icon || "").toLowerCase();

              const Icon = iconMap[iconName] || Shield;

              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border border-white/5 bg-black/40 text-center rounded-3xl hover:border-[#0096c7]/20 transition-all"
                >
                  <Icon className="w-12 h-12 text-[#0096c7] mb-6 mx-auto" />

                  <h3 className="text-xl font-bold text-white mb-4">
                    {benefit.title || benefit.attributes?.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {benefit.description || benefit.attributes?.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Insurance Policies */}
        <section className="px-8 md:px-20 py-32 max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Our Policies
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {policies.map((policy, index) => {
              const iconName =
                (policy.icon || policy.attributes?.icon || "").toLowerCase();

              const Icon = iconMap[iconName] || Shield;

              return (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-10 border border-white/5 bg-gray-900/30 backdrop-blur-sm text-center rounded-[2.5rem] cursor-pointer hover:shadow-[0_0_30px_-10px_#0096c7] transition-all"
                >
                  <Icon className="w-12 h-12 text-[#0096c7] mb-6 mx-auto" />

                  <h3 className="text-2xl font-bold mb-4">
                    {policy.title || policy.attributes?.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {policy.description || policy.attributes?.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-8 md:px-20 py-32 bg-gray-900/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-8">Get In Touch</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-12 h-12 bg-[#0096c7]/20 rounded-xl flex items-center justify-center text-[#0096c7]">
                    @
                  </div>
                  <span className="text-lg uppercase tracking-wider">{page.contactEmail || page.attributes?.contactEmail}</span>
                </div>
                
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-12 h-12 bg-[#0096c7]/20 rounded-xl flex items-center justify-center text-[#0096c7]">
                    #
                  </div>
                  <span className="text-lg font-bold">{page.contactPhone || page.attributes?.contactPhone}</span>
                </div>
              </div>

              <p className="mt-8 text-gray-400 text-lg italic border-l-2 border-[#0096c7] pl-4">
                {page.contactAddress || page.attributes?.contactAddress}
              </p>

              {/* Google Map */}
              <div className="mt-12 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                <iframe
                  src="https://www.google.com/maps?q=Abuja,Nigeria&output=embed"
                  width="100%"
                  height="300"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full grayscale invert opacity-70 hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 p-10 bg-black/40 rounded-[2.5rem] border border-white/5"
            >
              <input
                placeholder="YOUR NAME"
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#0096c7] outline-none transition-all placeholder:text-gray-600 font-bold"
              />

              <input
                placeholder="EMAIL ADDRESS"
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#0096c7] outline-none transition-all placeholder:text-gray-600 font-bold"
              />

              <textarea
                placeholder="TELL US MORE..."
                rows={5}
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#0096c7] outline-none transition-all placeholder:text-gray-600 font-bold resize-none"
              />

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-5 bg-[#0096c7] text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_20px_-5px_#0096c7] transition-all"
              >
                Send Request
              </motion.button>
            </motion.form>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-8 md:px-20 py-32 max-w-7xl mx-auto overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl text-center font-bold mb-20"
          >
            What Our Clients Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-10 border border-white/5 bg-gray-900/20 backdrop-blur-sm rounded-[2rem] relative"
              >
                <span className="absolute top-8 left-8 text-6xl text-[#0096c7]/20 font-serif leading-none italic select-none">&quot;</span>
                <p className="text-gray-400 text-lg italic leading-relaxed relative z-10 pt-4">
                  {item.testimony || item.attributes?.testimony}
                </p>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <p className="text-[#0096c7] font-black uppercase tracking-widest text-sm">
                    {item.name || item.attributes?.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}