"use client";

import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ICTPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <PageHeader 
        title="ICT Division" 
        subtitle="Empowering businesses through cutting-edge technology and digital innovation."
      />
      
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="space-y-24 text-gray-300 leading-relaxed max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white border-l-4 border-[#0096c7] pl-6">Our Technology Stack</h2>
            <p className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 py-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-8 border border-white/5 rounded-3xl bg-gray-900/30 backdrop-blur-sm text-center hover:border-[#0096c7]/30 transition-all"
            >
              <div className="w-14 h-14 bg-[#0096c7]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-[#0096c7] font-black text-xl">01</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cloud Solutions</h3>
              <p className="text-sm text-gray-500">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 border border-white/5 rounded-3xl bg-gray-900/30 backdrop-blur-sm text-center hover:border-[#0096c7]/30 transition-all"
            >
              <div className="w-14 h-14 bg-[#0096c7]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-[#0096c7] font-black text-xl">02</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cybersecurity</h3>
              <p className="text-sm text-gray-500">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="p-8 border border-white/5 rounded-3xl bg-gray-900/30 backdrop-blur-sm text-center hover:border-[#0096c7]/30 transition-all"
            >
              <div className="w-14 h-14 bg-[#0096c7]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-[#0096c7] font-black text-xl">03</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI & Data</h3>
              <p className="text-sm text-gray-500">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white border-l-4 border-[#0096c7] pl-6">Digital Transformation</h2>
            <p className="text-lg">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0096c7]/5 border border-[#0096c7]/20 p-12 rounded-[2.5rem] mt-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0096c7]/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose QIB ICT?</h2>
            <ul className="space-y-4 grid md:grid-cols-2 gap-x-8">
              {[
                "Scalable infrastructure for growth",
                "24/7 technical maintenance",
                "Industry-standard security",
                "Innovative problem solving",
                "Dedicated expert support",
                "Seamless system integration"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-400">
                  <span className="w-1.5 h-1.5 bg-[#0096c7] rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <TeamSection />
      </section>

      <Footer />
    </main>
  );
}
