"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { submitContact } from "@/services/strapi";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white text-black">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
            <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Contact Us
            </h2>
            <div className="h-1.5 w-24 bg-[#0096c7] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Have a question or want to work together? Send us a message.
            </p>
            </div>
        </motion.div>
      <div className="max-w-7xl mx-auto space-y-16">
        {/* TOP TWO COLUMNS */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Let's build the future together
              </h2>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Whether you have a question about our services, or want to
                discuss a potential project, our team is ready to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0096c7]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#0096c7]/20">
                    <span className="text-[#0096c7]">📍</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wider text-[#0096c7] font-semibold">
                    Office Address
                  </p>
                  <p className="mt-2 text-gray-700">
                    Plot 24, Central Business District, Abuja, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0096c7]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#0096c7]/20">
                  <span className="text-[#0096c7]">📧</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wider text-[#0096c7] font-semibold">
                    Official Email
                  </p>
                  <p className="mt-2 text-gray-700">
                    info@qibgroup.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0096c7]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#0096c7]/20">
                  <span className="text-[#0096c7]">📞</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wider text-[#0096c7] font-semibold">
                    Phone Number
                  </p>
                  <p className="mt-2 text-gray-700">
                    +234 800 000 0000
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onSubmit={handleSubmit}
            className="bg-gray-50 p-8 md:p-10 rounded-[2rem] border border-gray-200 space-y-8 shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:border-[#0096c7] outline-none"
                required
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:border-[#0096c7] outline-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:border-[#0096c7] outline-none"
                required
              />

              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:border-[#0096c7] outline-none"
                required
              />
            </div>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message..."
              rows={6}
              className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:border-[#0096c7] outline-none resize-none"
              required
            />

            <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#0096c7] text-white font-bold rounded-2xl hover:shadow-[0_0_30px_-5px_#0096c7] transition-all disabled:opacity-50 text-lg uppercase tracking-widest"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>

          {success && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-green-400 font-bold bg-green-400/10 py-4 rounded-xl border border-green-400/20"
            >
              {success}
            </motion.p>
          )}
          </motion.form>
        </div>
        {/* FULL WIDTH GOOGLE MAP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg mt-6"
          >
            <iframe
              src="https://www.google.com/maps?q=Abuja,Nigeria&output=embed"
              width="100%"
              height="350"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </motion.div>
      </div>
    </section>
  );
}