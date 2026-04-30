"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  getAboutPage,
  getTeamMembers,
  getAboutSlides,
  getStrategicPartners,
  getCEOProfile,
  getAboutGallery,
} from "@/services/strapi";

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
  vision?: string;
  mission?: string;
  values?: string[];
  name?: string;
  role?: string;
  bio?: string;
  photo?: {
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

interface AboutData {
  vision?: string;
  mission?: string;
  values?: string[];
  attributes?: StrapiAttributes;
}

interface TeamMember {
  id: number;
  name?: string;
  role?: string;
  bio?: string;
  photo?: StrapiImage;
  attributes?: StrapiAttributes;
}

interface Slide {
  id: number;
  title?: string;
  description?: string;
  image?: StrapiImage;
  attributes?: StrapiAttributes;
}

interface StrategicPartner {
  id: number;
  title?: string;
  description?: string;
  image?: StrapiImage;
  attributes?: StrapiAttributes;
}

interface CEOProfile {
  name?: string;
  bio?: string;
  photo?: StrapiImage;
  attributes?: StrapiAttributes;
}

interface GalleryItem {
  image?: StrapiImage;
  attributes?: StrapiAttributes;
}

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [partners, setPartners] = useState<StrategicPartner[]>([]);
  const [ceo, setCeo] = useState<CEOProfile | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);

  const truncateText = (text: string, words = 70) => {
    const split = text.split(" ");
    if (split.length <= words) return text;
    return split.slice(0, words).join(" ") + "...";
  };

  useEffect(() => {
    getAboutPage().then(setAbout).catch(() => setAbout({}));
    getTeamMembers().then(setTeam).catch(() => setTeam([]));
    getAboutSlides().then(setSlides).catch(() => setSlides([]));
    getStrategicPartners().then(setPartners).catch(() => setPartners([]));
    getCEOProfile().then(setCeo).catch(() => setCeo(null));
    getAboutGallery().then(setGallery).catch(() => setGallery([]));
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (!about) return null;

  const values = about.values || about.attributes?.values || [];

  return (
    <>
      <Navbar />

      <main className="bg-white text-black pt-20">
        {/* HERO SLIDER */}
        {slides.length > 0 && (
          <section className="relative h-[80vh] overflow-hidden">
            {slides.map((slide, index) => {
              const imageUrl =
                slide.image?.url
                  ? `http://localhost:1337${slide.image.url}`
                  : slide.attributes?.image?.data?.attributes?.url
                  ? `http://localhost:1337${slide.attributes.image.data.attributes.url}`
                  : "";

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === current ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-8">
                    <div>
                      <h1 className="text-5xl md:text-7xl text-white font-bold">
                        {slide.title || slide.attributes?.title}
                      </h1>

                      <p className="mt-6 max-w-3xl mx-auto text-gray-300">
                        {slide.description || slide.attributes?.description}
                      </p>
                      <button className="mt-10 px-8 py-4 bg-[#0096c7] text-white rounded-xl">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* MISSION + VISION */}
        <section className="grid md:grid-cols-2 gap-10 px-8 md:px-20 py-20">
          <div className="p-10 border border-[#0096c7] rounded-3xl backdrop-blur-md shadow-xl hover:border-[#0096c7]/30 transition-all duration-300">
            <h2 className="text-3xl font-bold text-[#0096c7]">Our Vision</h2>
            <p className="mt-6 text-gray-800">
              {about.vision || about.attributes?.vision}
            </p>
          </div>

          <div className="p-10 border border-[#0096c7] rounded-3xl backdrop-blur-md shadow-xl hover:border-[#0096c7]/30 transition-all duration-300">
            <h2 className="text-3xl font-bold text-[#0096c7]">Our Mission</h2>
            <p className="mt-6 text-gray-800">
              {about.mission || about.attributes?.mission}
            </p>
          </div>
        </section>

        {/* CEO BIO */}
        {ceo && (
          <section className="px-8 md:px-20 py-20 bg-[#0096c7]/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative w-full h-[600px]">
                <Image
                  src={`http://localhost:1337${
                    ceo.photo?.url ||
                    ceo.attributes?.photo?.data?.attributes?.url
                  }`}
                  alt={ceo.name || ceo.attributes?.name || "CEO Profile"}
                  fill
                  className="rounded-3xl object-cover backdrop-blur-md shadow-xl"
                />
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#0683ac]">Alhaji Umar Bida</h2>
                <h3 className="mt-4 text-2xl text-black">
                  {ceo.name || ceo.attributes?.name}
                </h3>
                <div className="h-1 w-80 bg-[#c70000] mx-1 mt-2 rounded-full"></div>

                <p className="mt-6 text-gray-800">
                  {ceo.bio || ceo.attributes?.bio}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* LEADERSHIP TEAM */}
        <section className="px-8 md:px-20 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0096c7] mb-4">Executive Leadership</h2>
            <div className="h-1 w-20 bg-[#c70000] mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-800 max-w-2xl mx-auto">
              Our senior executives bring tremendous experience, visionary thinking and a shared commitment to excellence, creativity, and innovation to the day to day operation of the company.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {team.map((member) => {
              const imageUrl =
                member.photo?.url
                  ? `http://localhost:1337${member.photo.url}`
                  : member.attributes?.photo?.data?.attributes?.url
                  ? `http://localhost:1337${member.attributes.photo.data.attributes.url}`
                  : "";

              return (
                <div
                  key={member.id}
                  className="p-8 border border-[#c70000] rounded-2xl text-center backdrop-blur-md shadow-xl hover:border-[#0096c7]/30 transition-all"
                >
                  <div className="relative w-40 h-40 mx-auto">
                    <Image
                      src={imageUrl || "placeholder.jpg"}
                      alt={member.name || member.attributes?.name || "Team Member"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {member.name || member.attributes?.name}
                  </h3>

                  <p className="text-[#0096c7] mt-2">
                    {member.role || member.attributes?.role}
                  </p>

                  <p className="mt-4 text-gray-800">
                    {member.bio || member.attributes?.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="px-8 md:px-20 py-20 bg-gray-100">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0096c7] mb-4">Core Values</h2>
            <div className="h-1 w-20 bg-[#c70000] mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-800 max-w-2xl mx-auto">
              We are known for our commitments to the following values and trusted by all our clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {values.map((value: string) => (
              <div
                key={value}
                className="p-8 border border-[#0096c7] rounded-2xl text-center backdrop-blur-md shadow-xl hover:border-[#0096c7]/30 transition-all"
              >
                {value}
              </div>
            ))}
          </div>
        </section>

        {/* IMAGE GALLERY */}
          {gallery.length > 0 && (
            <section className="py-20 overflow-hidden bg-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-[#0096c7] mb-4">Our Partners</h2>
                <div className="h-1 w-20 bg-[#c70000] mx-auto rounded-full"></div>
                <p className="mt-6 text-gray-800 max-w-2xl mx-auto">
                  We work with the best in the industry to provide top notch services and products.
                </p>
              </motion.div>

              <div className="relative">
                <div className="flex gap-6 animate-marquee w-max">
                  {[...gallery, ...gallery].map((item, index) => {
                    const imageUrl =
                      item.image?.url
                        ? `http://localhost:1337${item.image.url}`
                        : item.attributes?.image?.data?.attributes?.url
                        ? `http://localhost:1337${item.attributes.image.data.attributes.url}`
                        : "";

                    return (
                      <div key={index} className="relative w-80 h-24 flex-shrink-0">
                        <Image
                          src={imageUrl || "/placeholder.jpg"}
                          alt="Gallery"
                          fill
                          className="object-contain rounded-2xl"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

        {/* STRATEGIC PARTNERS */}
        <section className="px-8 md:px-20 py-20">
          <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-[#0096c7] mb-4">Strategy & History</h2>
                <div className="h-1 w-20 bg-[#c70000] mx-auto rounded-full"></div>
              </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {partners.map((partner) => {
              const imageUrl =
                partner.image?.url
                  ? `http://localhost:1337${partner.image.url}`
                  : partner.attributes?.image?.data?.attributes?.url
                  ? `http://localhost:1337${partner.attributes.image.data.attributes.url}`
                  : "";

              return (
                <div
                  key={partner.id}
                  className="border border-[#0096c7] rounded-3xl overflow-hidden"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={imageUrl || "/placeholder.jpg"}
                      alt={partner.title || partner.attributes?.title || "Partner"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#0092c2]">
                      {partner.title || partner.attributes?.title}
                    </h3>

                    {(() => {
                      const fullText =
                        partner.description || partner.attributes?.description || "";

                      const isExpanded = expandedPartner === partner.id;

                      return (
                        <>
                          <p className="mt-4 text-gray-900">
                            {isExpanded ? fullText : truncateText(fullText, 70)}
                          </p>

                          {fullText.split(" ").length > 70 && (
                            <button
                              onClick={() =>
                                setExpandedPartner(isExpanded ? null : partner.id)
                              }
                              className="mt-4 text-[#0096c7] font-medium hover:underline"
                            >
                              {isExpanded ? "Read Less" : "Read More"}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
