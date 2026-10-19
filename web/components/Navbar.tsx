"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

type NavbarProps = {
  showLogin?: boolean;
};

export default function Navbar({ showLogin = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();

  // Only treat the visitor as logged in after NextAuth confirms the session.
  const isLoggedIn = status === "authenticated";
  const isLoggedOut = status === "unauthenticated";

  const links = [
    { name: "About Us", href: "/about" },
    { name: "Insurance", href: "/insurance" },
    { name: "ICT", href: "/ict" },
    { name: "Construction", href: "/construction" },
    { name: "Logistics", href: "/logistics" },
    { name: "Projects", href: "/projects" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Close the mobile menu after navigation to keep the mobile experience tidy.
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-gray-200 bg-white text-[#0096c7] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Brand logo */}
        <Link href="/" className="group flex items-center">
          <Image
            src="/QIB-2-CROPED-trans.png"
            alt="QIB Group"
            width={160}
            height={48}
            priority
            className="h-10 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
        >
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className="relative py-1 text-sm font-medium transition-colors hover:text-[#0096c7]"
              >
                {link.name}

                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-[#0096c7]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions: authenticated and logged-out states */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn && (
            <>
              <Link
                href="/vault"
                className="rounded-xl border border-[#0096c7] px-5 py-2 text-sm font-semibold text-[#0096c7] transition hover:bg-[#0096c7] hover:text-white"
              >
                My Vault
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-500 px-5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          )}

          {isLoggedOut && showLogin && (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-[#0096c7] px-5 py-2 text-sm font-medium text-[#0096c7] transition hover:bg-[#0096c7] hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/buy-insurance"
                className="rounded-xl bg-[#0096c7] px-5 py-2 text-sm font-medium text-white transition hover:scale-105 hover:bg-[#007da7]"
              >
                Buy Insurance
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="p-2 text-black md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile navigation and responsive account actions */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 border-t border-white/10 bg-black/95 px-6 py-8 text-white backdrop-blur-xl md:hidden"
        >
          <nav aria-label="Mobile navigation" className="space-y-6">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`block text-lg font-medium transition-colors ${
                    isActive
                      ? "text-[#0096c7]"
                      : "text-white hover:text-[#0096c7]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-white/10 pt-6">
            {isLoggedIn && (
              <>
                <Link
                  href="/vault"
                  onClick={closeMobileMenu}
                  className="block rounded-xl bg-[#0096c7] py-3 text-center font-semibold text-white transition hover:bg-[#007da7]"
                >
                  My Vault
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-xl border border-red-500 py-3 text-center font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}

            {isLoggedOut && showLogin && (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block rounded-xl border border-[#0096c7] py-3 text-center font-medium text-[#0096c7] transition hover:bg-[#0096c7] hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/buy-insurance"
                  onClick={closeMobileMenu}
                  className="block rounded-xl bg-[#0096c7] py-3 text-center font-semibold text-white transition hover:bg-[#007da7]"
                >
                  Buy Motor Vehicle Insurance
                </Link>
              </>
            )}

            {/* Avoid showing the wrong action while NextAuth checks the session. */}
            {status === "loading" && (
              <p className="py-2 text-center text-sm text-gray-400">
                Checking your session...
              </p>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
