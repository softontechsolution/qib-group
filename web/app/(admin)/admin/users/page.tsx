import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

// Provide a safe landing page until user-management functionality is implemented.
export default function AdminUsersPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-[#0096c7]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Admin
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-[#0096c7]">
            <Users size={28} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            User Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            This section is not yet implemented. User-management features can be
            added here once the required data sources and permissions are
            defined.
          </p>

          <div className="mt-8">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-lg bg-[#0096c7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
