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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      await submitContact(form);
      setSuccess("Your message has been sent successfully.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="p-20 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl text-center font-bold mb-4">
          Contact Us
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Have a question or want to work together? Send us a message.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-950 p-8 md:p-12 rounded-3xl border border-gray-800 space-y-6 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-500 ml-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-4 bg-black border border-gray-800 rounded-xl focus:border-[#0096c7] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full p-4 bg-black border border-gray-800 rounded-xl focus:border-[#0096c7] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-500 ml-1">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+234..."
                className="w-full p-4 bg-black border border-gray-800 rounded-xl focus:border-[#0096c7] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-500 ml-1">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Inquiry"
                className="w-full p-4 bg-black border border-gray-800 rounded-xl focus:border-[#0096c7] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500 ml-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message..."
              rows={5}
              className="w-full p-4 bg-black border border-gray-800 rounded-xl focus:border-[#0096c7] focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#0096c7] text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-center text-green-400 font-medium animate-pulse">{success}</p>
          )}
        </form>
      </div>
    </section>
  );
}