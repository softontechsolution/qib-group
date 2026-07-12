"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState<PageData | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);

  // AUTH STATE HOOKS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  // SECURE AUTH SUBMISSION HANDLER
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (!email || !password) {
      setAuthError("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Trigger NextAuth flow without triggering an abrupt full-page refresh loop
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password: password,
      });

      if (result?.error) {
        console.log("Authentication failed message:", result.error);
        setAuthError("Invalid credentials. Please verify your email and password.");
        setIsLoading(false);
      } else {
        // Safe validation confirmed -> Dispatch user straight into the Vault Page Hub
        router.push("/vault");
        router.refresh();
      }
    } catch (err) {
      console.error("Login component execution failure:", err);
      setAuthError("An unexpected routing exception occurred.");
      setIsLoading(false);
    }
  };

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
            <div className="w-full max-w-md border border-gray-700 rounded-2xl p-10 bg-zinc-950">
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

              {/* RENDER DYNAMIC ERROR MESSAGES */}
              {authError && (
                <div className="mt-6 p-4 bg-red-950/50 border border-red-800 text-red-200 text-xs font-semibold rounded-xl text-center">
                  ⚠️ {authError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#0096c7] disabled:opacity-50"
                  required
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-[#0096c7] disabled:opacity-50"
                  required
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="accent-[#0096c7]" />
                    Remember me
                  </label>

                  <Link href="/forgot-password" className="hover:text-[#0096c7] transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#0096c7] hover:bg-[#0085b3] text-white rounded-xl font-semibold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Authenticating Session..." : "Login"}
                </button>

                <Link
                  href="/insurance"
                  className="block w-full text-center py-4 border border-[#0096c7] text-[#0096c7] rounded-xl hover:bg-[#0096c7] hover:text-white transition"
                >
                  {page.signupText || page.attributes?.signupText}
                </Link>
                <p className="mt-6 text-center text-gray-400 text-sm">
                  Need help?{" "}
                  <Link href="/insurance" className="text-[#0096c7] hover:underline">
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