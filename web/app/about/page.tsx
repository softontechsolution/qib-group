"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getAboutPage,
  getTeamMembers,
  getAboutSlides,
  getStrategicPartners,
  getCEOProfile,
} from "@/services/strapi";

export default function AboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [ceo, setCeo] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getAboutPage().then(setAbout);
    getTeamMembers().then(setTeam);
    getAboutSlides().then(setSlides);
    getStrategicPartners().then(setPartners);
    getCEOProfile().then(setCeo);
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

      <main className="bg-black text-white pt-20">
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
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-8">
                    <div>
                      <h1 className="text-5xl md:text-7xl font-bold">
                        {slide.title || slide.attributes?.title}
                      </h1>

                      <p className="mt-6 max-w-3xl mx-auto text-gray-300">
                        {slide.description || slide.attributes?.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* MISSION + VISION */}
        <section className="grid md:grid-cols-2 gap-10 px-8 md:px-20 py-20">
          <div className="p-10 border border-gray-700 rounded-3xl">
            <h2 className="text-3xl font-bold text-[#0096c7]">Our Vision</h2>
            <p className="mt-6 text-gray-400">
              {about.vision || about.attributes?.vision}
            </p>
          </div>

          <div className="p-10 border border-gray-700 rounded-3xl">
            <h2 className="text-3xl font-bold text-[#0096c7]">Our Mission</h2>
            <p className="mt-6 text-gray-400">
              {about.mission || about.attributes?.mission}
            </p>
          </div>
        </section>

        {/* CEO BIO */}
        {ceo && (
          <section className="px-8 md:px-20 py-20 bg-gray-950">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <img
                src={`http://localhost:1337${
                  ceo.photo?.url ||
                  ceo.attributes?.photo?.data?.attributes?.url
                }`}
                alt={ceo.name || ceo.attributes?.name}
                className="w-full h-150 rounded-3xl object-cover"
              />

              <div>

                <h3 className="mt-4 text-2xl text-[#0096c7]">
                  {ceo.name || ceo.attributes?.name}
                </h3>

                <p className="mt-2 text-gray-300">
                  {ceo.role || ceo.attributes?.role}
                </p>

                <p className="mt-6 text-gray-400">
                  {ceo.bio || ceo.attributes?.bio}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* LEADERSHIP TEAM */}
        <section className="px-8 md:px-20 py-20">
          <h2 className="text-4xl font-bold text-center">Leadership Team</h2>

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
                  className="p-8 border border-gray-700 rounded-2xl text-center"
                >
                  <img
                    src={imageUrl}
                    alt={member.name || member.attributes?.name}
                    className="w-28 h-28 rounded-full object-cover mx-auto"
                  />

                  <h3 className="mt-6 text-xl font-bold">
                    {member.name || member.attributes?.name}
                  </h3>

                  <p className="text-[#0096c7] mt-2">
                    {member.role || member.attributes?.role}
                  </p>

                  <p className="mt-4 text-gray-400">
                    {member.bio || member.attributes?.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="px-8 md:px-20 py-20 bg-gray-950">
          <h2 className="text-4xl font-bold text-center">Core Values</h2>

          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {values.map((value: string) => (
              <div
                key={value}
                className="p-8 border border-gray-700 rounded-2xl text-center"
              >
                {value}
              </div>
            ))}
          </div>
        </section>

        {/* STRATEGIC PARTNERS */}
        <section className="px-8 md:px-20 py-20">
          <h2 className="text-4xl font-bold text-center">
            Strategic Partners
          </h2>

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
                  className="border border-gray-700 rounded-3xl overflow-hidden"
                >
                  <img
                    src={imageUrl}
                    alt={partner.title || partner.attributes?.title}
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-8">
                    <h3 className="text-2xl font-bold">
                      {partner.title || partner.attributes?.title}
                    </h3>

                    <p className="mt-4 text-gray-400">
                      {partner.description || partner.attributes?.description}
                    </p>
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