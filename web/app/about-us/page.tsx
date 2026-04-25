"use client";

import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <PageHeader 
        title="About Us" 
        subtitle="Leading the way in Africa's digital and industrial transformation."
      />
      
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="space-y-24 text-gray-300 leading-relaxed">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white border-l-4 border-[#0096c7] pl-6 uppercase tracking-wider">Our Mission</h2>
            <div className="space-y-4 text-lg">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white border-l-4 border-[#0096c7] pl-6 uppercase tracking-wider">Our Vision</h2>
            <p className="text-lg">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 py-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-10 border border-white/5 rounded-[2.5rem] bg-gray-900/20 backdrop-blur-md shadow-2xl hover:border-[#0096c7]/30 transition-all"
            >
              <h3 className="text-2xl font-black text-[#0096c7] mb-4 uppercase tracking-tighter italic">Innovation</h3>
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-10 border border-white/5 rounded-[2.5rem] bg-gray-900/20 backdrop-blur-md shadow-2xl hover:border-[#0096c7]/30 transition-all"
            >
              <h3 className="text-2xl font-black text-[#0096c7] mb-4 uppercase tracking-tighter italic">Integrity</h3>
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white border-l-4 border-[#0096c7] pl-6 uppercase tracking-wider">Our Story</h2>
            <p className="text-lg">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
