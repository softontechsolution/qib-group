"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
          <h3 className="text-2xl font-bold text-[#0096c7]">QIB Group</h3>
          <p className="mt-4 text-gray-400">
            Building Africa’s future through innovation, infrastructure and
            sustainable growth.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/businesses"
                className="hover:text-white transition-colors"
              >
                Businesses
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="hover:text-white transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/QUALITY INSURANCE BROKERS LTD CLAIMS HANDLING PROCEDURE.pdf"
                className="hover:text-white transition-colors"
              >
                Claim Procedure
              </Link>
            </li>
            <li>
              <Link
                href="/lodge-claim"
                className="hover:text-white transition-colors"
              >
                Lodge a Claim
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-white transition-colors">
                News
              </Link>
            </li>
            <li>
              <Link
                href="/vault"
                className="hover:text-white transition-colors"
              >
                My Insurance Vault
              </Link>
            </li>
            <li>
              <Link
                href="/register-agent"
                className="hover:text-white transition-colors"
              >
                Register as Sales Rep
              </Link>
            </li>
            <li>
              <Link
                href="https://www.askniid.org/"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Your Policy on NIID
              </Link>
            </li>

            {/* Legal & Compliance Centre */}
            <li>
              <Link
                href="/legal-compliance"
                className="inline-flex items-center gap-2 font-medium text-[#0096c7] transition-colors hover:text-white"
              >
                Legal &amp; Compliance
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  // Reopen the global consent manager without navigating away.
                  window.dispatchEvent(new Event("qib:open-cookie-settings"));
                }}
                className="text-left text-gray-400 transition-colors hover:text-[#0096c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0096c7] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Cookie Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Ahmadu Bello Way, Garki, Abuja</li>
            <li>
              <a
                href="mailto:info@qibgroup.com?subject=Complaint%20and%20Information%20Request"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] hover:text-[#006d92]"
              >
                info@qibgroup.com.ng
                <ArrowUpRight size={16} />
              </a>
            </li>
            <li>+234 706 675 0550</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} QIB Group. All rights reserved.
        <span className="mx-2">|</span>
        <Link
          href="/legal-compliance"
          className="transition-colors hover:text-[#0096c7]"
        >
          Legal &amp; Compliance
        </Link>
      </div>
    </motion.footer>
  );
}
