"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/QIB-2-CROPED-trans.png"
            alt="QIB Group"
            width={160}
            height={48}
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Nav Center */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-[#0096c7] ${
                pathname === link.href
                  ? "text-[#0096c7]"
                  : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Login */}
        <div className="hidden md:block">
          {showLogin && (
            <Link
              href="/login"
              className="px-6 py-2 bg-[#0096c7] text-white rounded-xl"
            >
              Login into your account
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-6 py-6 space-y-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block ${
                pathname === link.href
                  ? "text-[#0096c7]"
                  : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {showLogin && (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center py-3 bg-[#0096c7] rounded-xl"
            >
              Login into your account
            </Link>
          )}
        </div>
      )}
    </header>
  );
}