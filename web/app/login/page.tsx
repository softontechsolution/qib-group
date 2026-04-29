"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getLoginPage, getLoginSlides } from "@/services/strapi";

interface StrapiImage {
  url: string;
  data?: {
    attributes: {
      url: string;
    };
  };
}

interface StrapiAttributes {
  title?: string;
  description?: string;
  pageTitle?: string;
  subtitle?: string;
  signupText?: string;
  logo?: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  image?: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
}

interface PageData {
  pageTitle?: string;
  subtitle?: string;
  signupText?: string;
  logo?: StrapiImage;
  attributes?: StrapiAttributes;
}

interface Slide {
  id: number;
  title?: string;
  description?: string;
  image?: StrapiImage;
  attributes?: StrapiAttributes;
}

export default function LoginPage() {
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState<PageData | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    getLoginPage().then(setPage);
    getLoginSlides().then(setSlides);
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!page) return null;

  const logoUrl =
    page.logo?.url
      ? `http://localhost:1337${page.logo.url}`
      : page.attributes?.logo?.data?.attributes?.url
      ? `http://localhost:1337${page.attributes.logo.data.attributes.url}`
      : "";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24">
        <section className="grid md:grid-cols-2 min-h-[85vh]">
          {/* Left Side */}
          <div className="hidden md:flex items-center justify-center px-16 bg-[#0096c7]/10">
            {slides.length > 0 && (
              <div className="max-w-lg">
                {(() => {
                  const slide = slides[current];

                  const imageUrl =
                    slide.image?.url
                      ? `http://localhost:1337${slide.image.url}`
                      : slide.attributes?.image?.data?.attributes?.url
                      ? `http://localhost:1337${slide.attributes.image.data.attributes.url}`
                      : "";

                  return (
                    <>
                      <div className="relative w-full h-72">
                        <Image
                          src={imageUrl || "/placeholder.jpg"}
                          alt={slide.title || slide.attributes?.title || "Login Slide"}
                          fill
                          className="object-cover rounded-3xl"
                        />
                      </div>

                      <h1 className="text-5xl font-bold mt-8">
                        {slide.title || slide.attributes?.title}
                      </h1>

                      <p className="mt-6 text-gray-300">
                        {slide.description || slide.attributes?.description}
                      </p>
                    </>
                  );
                })()}

                <div className="flex gap-3 mt-8">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrent(index)}
                      className={`h-3 rounded-full transition-all ${
                        index === current
                          ? "w-10 bg-[#0096c7]"
                          : "w-3 bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center px-8">
            <div className="w-full max-w-md border border-gray-700 rounded-2xl p-10">
              <div className="text-center">
                {logoUrl && (
                  <div className="relative h-16 w-full mb-4">
                    <Image
                      src={logoUrl}
                      alt="QIB Group"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                <h2 className="mt-4 text-3xl font-bold">
                  {page.pageTitle || page.attributes?.pageTitle}
                </h2>

                <p className="text-gray-400 mt-2">
                  {page.subtitle || page.attributes?.subtitle}
                </p>
              </div>

              <form className="mt-8 space-y-5">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <Link href="/forgot-password" className="hover:text-[#0096c7]">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0096c7] rounded-xl font-semibold"
                >
                  Login
                </button>

                <Link
                  href="/insurance"
                  className="block w-full text-center py-4 border border-[#0096c7] text-[#0096c7] rounded-xl hover:bg-[#0096c7] hover:text-white transition"
                >
                  {page.signupText || page.attributes?.signupText}
                </Link>
                <p className="mt-6 text-center text-gray-400">
                Need help?{" "}
                <Link href="/insurance" className="text-[#0096c7]">
                  Contact support
                </Link>
              </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}