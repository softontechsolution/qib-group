"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LockKeyhole, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FirstLoginPage() {
  const [email, setEmail] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Keep each first-login password field independently showable.
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    // Catch mismatched passwords in the browser for a better user experience.
    // The backend independently validates all security-sensitive requirements.
    if (newPassword !== passwordConfirmation) {
      setError("Your new passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

      if (!strapiUrl) {
        throw new Error("Password service is currently unavailable.");
      }

      const response = await fetch(
        `${strapiUrl}/api/customer-auth/first-login-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            temporaryPassword,
            newPassword,
            passwordConfirmation,
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result?.ok !== true) {
        throw new Error(
          result?.error?.message ||
            "We could not change your password. Check your details or use password recovery.",
        );
      }

      // Do not create a session here; the customer must sign in with the new password.
      setSuccess(true);
      setTemporaryPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6">
        <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-[#0096c7]">
            <LockKeyhole size={28} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Set Your New Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            If you received a temporary password with your policy account,
            replace it here before signing in to your customer vault.
          </p>

          {success ? (
            <div
              className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5"
              role="status"
            >
              <div className="flex items-center gap-2 font-semibold text-emerald-800">
                <ShieldCheck size={20} aria-hidden="true" />
                Password changed successfully
              </div>

              <p className="mt-2 text-sm text-emerald-800">
                You can now sign in using your email address and new password.
              </p>

              <Link
                href="/login"
                className="mt-5 inline-flex rounded-lg bg-[#0096c7] px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Continue to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="first-login-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="first-login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#0096c7] focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label
                  htmlFor="temporary-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Temporary password
                </label>
                <div className="relative">
                  <input
                    id="temporary-password"
                    type={showTemporaryPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={temporaryPassword}
                    onChange={(event) =>
                      setTemporaryPassword(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-[#0096c7] focus:ring-2 focus:ring-sky-100"
                  />
                  {/* Toggle visibility of the new password without submitting the form. */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowTemporaryPassword((visible) => !visible)
                    }
                    aria-label={
                      showTemporaryPassword
                        ? "Hide temporary password"
                        : "Show temporary password"
                    }
                    aria-pressed={showTemporaryPassword}
                    title={
                      showTemporaryPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition-colors hover:text-[#0096c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0096c7] rounded-r-lg"
                  >
                    {showTemporaryPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-[#0096c7] focus:ring-2 focus:ring-sky-100"
                  />
                  {/* Toggle visibility of the new password without submitting the form. */}
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((visible) => !visible)}
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    aria-pressed={showNewPassword}
                    title={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition-colors hover:text-[#0096c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0096c7] rounded-r-lg"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Use at least 12 characters, including uppercase, lowercase,
                  and a number.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="confirm-new-password"
                    type={showPasswordConfirmation ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                    value={passwordConfirmation}
                    onChange={(event) =>
                      setPasswordConfirmation(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-[#0096c7] focus:ring-2 focus:ring-sky-100"
                  />
                  {/* Confirmation has its own visibility toggle. */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswordConfirmation((visible) => !visible)
                    }
                    aria-label={
                      showPasswordConfirmation
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                    aria-pressed={showPasswordConfirmation}
                    title={
                      showPasswordConfirmation
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 transition-colors hover:text-[#0096c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0096c7] rounded-r-lg"
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#0096c7] px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Updating Password..." : "Change Password"}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-6 text-center text-sm text-slate-600">
              Already changed your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#0096c7] hover:underline"
              >
                Sign in
              </Link>
              {" · "}
              <Link
                href="/forgot-password"
                className="font-semibold text-[#0096c7] hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
