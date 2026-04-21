"use client";

import Link from "next/link";

export default function Navbar({ showLogin = false }) {
  return (
    <nav className="fixed top-0 w-full flex justify-between p-6 bg-black/70 backdrop-blur-md text-white z-50">
      <h1 className="font-bold text-xl">QIB Group</h1>

      <div className="space-x-6">
        <Link href="/about">About Us</Link>
        <Link href="/insurance">Insurance</Link>
        <a href="#">ICT</a>
        <a href="#">Construction</a>
        <a href="#">Logistics</a>
        <a href="#">Projects</a>
        <a href="#">Contact</a>
      </div>
      {showLogin && (
        <Link
          href="/login"
          className="px-6 py-2 bg-yellow-500 text-black rounded-xl"
        >
          Login
        </Link>
      )}
    </nav>
  );
}