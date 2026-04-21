"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-black border-t border-gray-800 text-white px-8 md:px-20 py-16"
    >
       <div className="grid md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-yellow-500">
            QIB Group
          </h3>
          <p className="mt-4 text-gray-400">
            Building Africa’s future through innovation,
            infrastructure and sustainable growth.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#">About</a></li>
            <li><a href="#">Businesses</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">News</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Abuja, Nigeria</li>
            <li>info@qibgroup.com</li>
            <li>+234 800 000 0000</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} QIB Group. All rights reserved.
      </div>
    </motion.footer>
  );
}