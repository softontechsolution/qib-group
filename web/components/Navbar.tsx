"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar({ showLogin = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "About Us", href: "/about" },
    { name: "Insurance", href: "/insurance" },
    { name: "ICT", href: "/ict" },
    { name: "Construction", href: "/construction" },
    { name: "Logistics", href: "/logistics" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl  bg-white text-[#0096c7] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/QIB-2-CROPED-trans.png"
            alt="QIB Group"
            width={160}
            height={48}
            className="h-10 w-auto group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Nav Center */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                  className="relative py-1 text-sm font-medium transition-colors hover:text-[#0096c7]"
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0096c7]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {showLogin && (
            <>
              <Link
                href="/login"
                className="px-5 py-2 border border-[#0096c7] text-[#0096c7] rounded-xl hover:bg-[#0096c7] hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/buy-insurance"
                className="px-5 py-2 bg-[#0096c7] text-white rounded-xl hover:scale-105 transition"
              >
                Buy Insurance
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-black"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-6 py-8 space-y-6"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-lg font-medium ${
                pathname === link.href
                  ? "text-[#0096c7]"
                  : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {showLogin && (
            <div className="space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 border border-[#0096c7] text-[#0096c7] rounded-xl"
              >
                Login
              </Link>

              <Link
                href="/buy-insurance"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-[#0096c7] text-white rounded-xl"
              >
                Buy Motor Vehicle Insurance
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
}