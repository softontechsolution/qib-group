"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full flex justify-between p-6 bg-black/70 backdrop-blur-md text-white z-50">
      <h1 className="font-bold text-xl">QIB Group</h1>

      <div className="space-x-6">
        <a href="#">About Us</a>
        <a href="#">Businesses</a>
        <a href="#">Projects</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  );
}