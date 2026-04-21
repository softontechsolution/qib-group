"use client";

import { useState } from "react";
import { submitContact } from "@/services/strapi";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await submitContact(form);

    setSuccess("Your message has been sent.");
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <section className="p-20 bg-black text-white">
      <h2 className="text-4xl text-center font-bold">
        Contact Us
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto mt-10 space-y-6"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-4 bg-gray-900 rounded-xl"
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full p-4 bg-gray-900 rounded-xl"
          required
        />

        <input
          name="phone"
          type="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-4 bg-gray-900 rounded-xl"
          required
        />

        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full p-4 bg-gray-900 rounded-xl"
          required
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={6}
          className="w-full p-4 bg-gray-900 rounded-xl"
          required
        />

        <button
          type="submit"
          className="px-8 py-4 bg-yellow-500 text-black rounded-xl"
        >
          Send Message
        </button>

        {success && (
          <p className="text-green-400">{success}</p>
        )}
      </form>
    </section>
  );
}