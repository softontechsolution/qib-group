"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Lock, Building2, Menu, X } from "lucide-react";

export default function SignupPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(1);

const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* MOBILE SIDEBAR OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
     <aside
        className={`fixed md:sticky md:top-0 z-50 md:z-auto top-0 left-0 h-screen w-72 bg-gray-950 border-r border-white/5 p-8 flex flex-col transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
        {/* Close button mobile */}
        <button
          className="md:hidden mb-8 self-end"
          onClick={() => setMenuOpen(false)}
        >
          <X />
        </button>

        {/* Logo desktop */}
        <div className="hidden md:block mb-12">
          <Image
            src="/QIB-2-CROPED-trans.png"
            alt="QIB Group"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="space-y-6 text-gray-400">
          <Link href="/" className="block hover:text-[#0096c7] transition">
            Dashboard
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Insurance Plans
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Claims
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Support
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Contact
          </Link>
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <section className="flex-1 flex flex-col w-full">
        {/* TOP HEADER */}
        <div className="p-6 border-b border-white/5">
          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-start justify-between">
            {/* left menu button */}
            <button onClick={() => setMenuOpen(true)}>
              <Menu />
            </button>

            {/* right logo + login */}
            <div className="flex flex-col items-end gap-4">
              <Image
                src="/QIB-2-CROPED-trans.png"
                alt="QIB Group"
                width={120}
                height={40}
                className="object-contain"
              />

              <Link
                href="/login"
                className="px-5 py-2 border border-[#0096c7] text-[#0096c7] rounded-xl"
              >
                Login
              </Link>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden md:flex justify-end">
            <Link
              href="/login"
              className="px-6 py-3 border border-[#0096c7] text-[#0096c7] rounded-xl hover:bg-[#0096c7] hover:text-white transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* FORM */}
       <div className="flex-1 flex items-start  px-4 md:px-12 pt-6 md:pt-10 pb-10">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Account</span>
                        <span>Company</span>
                        <span>Finish</span>
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-[#0096c7] transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                    </div>
                {/* Title */}
                <div className="mb-6 text-left">
                <h3 className="font-bold">
                    Buy Motor Vehicle Insurance
                </h3>
                </div>

                {/* Form Card */}
                <div className="bg-gray-950 border border-white/5 rounded-3xl p-6 md:p-10">
                <form className="space-y-6">

                    {/* STEP 1 */}
                    {step === 1 && (
                    <>
                        {/* Class of Insurance */}
                        <div>
                        <label className="text-sm text-gray-400">Class of Insurance</label>
                        <select className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]">
                            <option value="">Select Class</option>
                            <option value="private">Private Vehicle</option>
                            <option value="commercial">Commercial Vehicle</option>
                            <option value="corporate">Corporate Fleet</option>
                        </select>
                        </div>

                        {/* Cover Type */}
                        <div>
                        <label className="text-sm text-gray-400">Cover Type</label>
                        <select className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]">
                            <option value="">Select Cover Type</option>
                            <option value="comprehensive">Comprehensive</option>
                            <option value="third-party">Third Party</option>
                            <option value="third-party-fire-theft">
                            Third Party, Fire & Theft
                            </option>
                        </select>
                        </div>

                        {/* Vehicle Use */}
                        <div>
                        <label className="text-sm text-gray-400">Vehicle Use</label>
                        <select className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]">
                            <option value="">Select Vehicle Use</option>
                            <option value="personal">Personal Use</option>
                            <option value="commercial">Commercial Use</option>
                            <option value="transport">Public Transport</option>
                        </select>
                        </div>
                    </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-4 text-gray-500" />
                            <input
                            placeholder="Company Name"
                            className="w-full pl-12 p-4 bg-black border border-white/10 rounded-2xl"
                            />
                        </div>

                        <input
                            placeholder="Industry"
                            className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                        />

                        <input
                            placeholder="Phone Number"
                            className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                        />
                        </>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <>
                        <input
                            placeholder="Company Address"
                            className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                        />

                        <textarea
                            placeholder="Tell us about your insurance needs (optional)"
                            rows={5}
                            className="w-full p-4 bg-black border border-white/10 rounded-2xl resize-none"
                        />
                        </>
                    )}

                    {/* NAV BUTTONS */}
                    <div className="flex justify-between pt-4">
                        {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-3 border border-white/10 rounded-xl"
                        >
                            Back
                        </button>
                        ) : (
                        <div />
                        )}

                        {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-3 bg-[#0096c7] rounded-xl"
                        >
                            Next
                        </button>
                        ) : (
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#0096c7] rounded-xl"
                        >
                            Submit
                        </button>
                        )}
                    </div>

                    </form>
                </div>
            </div>
            </div>
      </section>
    </main>
  );
}