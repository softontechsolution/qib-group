"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAboutPage, getTeamMembers } from "@/services/strapi";

export default function AboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    getAboutPage().then(setAbout);
    getTeamMembers().then(setTeam);
  }, []);

  if (!about) return null;

  const values = about.values || about.attributes?.values || [];

  return (
    <>
      <Navbar />

      <main className="bg-black text-white pt-28">
        <section className="text-center px-8 py-24">
          <h1 className="text-5xl md:text-7xl font-bold">
            {about.heroTitle || about.attributes?.heroTitle}
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-gray-400">
            {about.companyStory || about.attributes?.companyStory}
          </p>
        </section>

        <section className="px-8 md:px-20 py-16">
          <h2 className="text-4xl font-bold">Our Vision</h2>
          <p className="mt-6 text-gray-400">
            {about.vision || about.attributes?.vision}
          </p>
        </section>

        <section className="px-8 md:px-20 py-16 bg-gray-950">
          <h2 className="text-4xl font-bold">Our Mission</h2>
          <p className="mt-6 text-gray-400">
            {about.mission || about.attributes?.mission}
          </p>
        </section>

        <section className="px-8 md:px-20 py-16">
          <h2 className="text-4xl font-bold text-center">
            Core Values
          </h2>

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

        <section className="px-8 md:px-20 py-16 bg-gray-950">
          <h2 className="text-4xl font-bold text-center">
            Leadership Team
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
           {team.map((member) => {
            const imageUrl =
                member.photo?.url
                ? `http://localhost:1337${member.photo.url}`
                : member.attributes?.photo?.data?.attributes?.url
                ? `http://localhost:1337${member.attributes.photo.data.attributes.url}`
                : null;

            return (
                <div
                key={member.id}
                className="p-8 border border-gray-700 rounded-2xl text-center"
                >
                {imageUrl && (
                    <img
                    src={imageUrl}
                    alt={member.name || member.attributes?.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover mb-6"
                    />
                )}

                <h3 className="text-2xl font-bold">
                    {member.name || member.attributes?.name}
                </h3>

                <p className="text-yellow-500 mt-2">
                    {member.role || member.attributes?.role}
                </p>

                <p className="text-gray-400 mt-4">
                    {member.bio || member.attributes?.bio}
                </p>
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