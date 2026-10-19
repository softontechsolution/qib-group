"use client";

import { Suspense, FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Keep token-dependent logic inside a component rendered under Suspense.
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Keep the new-password and confirmation visibility independent.
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!code) {
      setError("This reset link is missing its token. Request a new link.");
      return;
    }

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

      if (!strapiUrl) {
        throw new Error("Password reset is currently unavailable.");
      }

      const response = await fetch(`${strapiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation: confirmation,
        }),
      });

      const result = await response.json().catch(() => ({}));

      // Never persist the returned token in browser storage.
      if (!response.ok || !result?.jwt) {
        throw new Error(
          "This reset link may be invalid or already used. Request a new link and try again.",
        );
      }

      // Require a fresh login through the existing NextAuth credentials flow.
      setPassword("");
      setConfirmation("");
      setMessage("Your password has been reset. You can now sign in.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Password reset failed. Please request a new link.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
      <h1 className="text-2xl font-bold text-slate-900">Reset Your Password</h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Choose a new password for your QIB account.
      </p>

      {!code && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          No reset token was found in this link. Request a new password-reset
          email.
        </p>
      )}

      {message ? (
        <div
          role="status"
          className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {message}
          <div className="mt-4">
            <Link
              href="/login"
              className="font-semibold text-[#0096c7] hover:underline"
            >
              Continue to login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="reset-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="reset-password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-[#0096c7] focus:ring-2 focus:ring-sky-100"
              />
              {/* Toggle visibility of the new password without submitting the form. */}
              <button
                type="button"
                onClick={() => setShowNewPassword((visible) => !visible)}
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
                aria-pressed={showNewPassword}
                title={
                  showNewPassword ? "Hide new password" : "Show new password"
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
              Use at least 12 characters, including uppercase, lowercase, and a
              number.
            </p>
          </div>

          <div>
            <label
              htmlFor="reset-confirmation"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="reset-confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
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
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !code}
            className="w-full rounded-lg bg-[#0096c7] px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-600">
        <Link
          href="/forgot-password"
          className="font-semibold text-[#0096c7] hover:underline"
        >
          Request another reset link
        </Link>
      </p>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[65vh] bg-slate-50 px-4 py-12 sm:px-6">
        <Suspense
          fallback={
            <div className="mx-auto max-w-lg rounded-2xl bg-white p-9 text-slate-600 shadow-sm">
              Loading password-reset form...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
