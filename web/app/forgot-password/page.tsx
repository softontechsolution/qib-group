"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

      if (!strapiUrl) {
        throw new Error("Password recovery is currently unavailable.");
      }

      const response = await fetch(`${strapiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // Keep the response generic to avoid revealing whether an account exists.
      if (!response.ok) {
        throw new Error(
          "We could not process your request right now. Please try again later.",
        );
      }

      setMessage(
        "If an account exists for that email address, password-reset instructions will be sent to it.",
      );
      setEmail("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Password recovery is currently unavailable.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[65vh] bg-slate-50 px-4 py-12 sm:px-6">
        <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <h1 className="text-2xl font-bold text-slate-900">
            Forgot Your Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter the email address associated with your QIB customer account.
            If the account exists, we'll send instructions to reset its
            password.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="recovery-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#0096c7] focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {message && (
              <p
                role="status"
                className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
              >
                {message}
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#0096c7] px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {submitting ? "Sending Request..." : "Send Reset Instructions"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0096c7] hover:underline"
            >
              Return to login
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
