import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Cookie,
  FileCheck2,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Legal & Compliance | QIB",
  description:
    "Review Quality Insurance Brokers Limited's legal documents, customer policies and privacy commitments.",
};

const legalDocuments = [
  {
    title: "Privacy & Data Protection Policy",
    description:
      "How QIB collects, uses, stores, shares and protects personal information, including your rights and privacy choices.",
    icon: ShieldCheck,
    status: "Available to review",
    href: "/legal-compliance/privacy-policy",
  },
  {
    title: "Cookie Policy",
    description:
      "Information about cookies and similar technologies, what they do and how you can manage your preferences.",
    icon: Cookie,
    status: "Available to review",
    href: "/legal-compliance/cookie-policy",
  },
  {
    title: "Non-Disclosure & Confidentiality Policy",
    description:
      "How confidential customer, insurance and business information should be handled and protected.",
    icon: LockKeyhole,
    status: "Available to review",
    href: "/legal-compliance/non-disclosure-confidentiality",
  },
  {
    title: "Terms & Conditions of Use",
    description:
      "The terms governing website access, customer accounts, digital insurance applications, payments and related services.",
    icon: FileCheck2,
    status: "Available to review",
    href: "/legal-compliance/terms-and-conditions",
  },
];

export default function LegalCompliancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8fb] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="relative mb-10 overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full bg-[#0096c7]/20 blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
              <Scale size={15} />
              Legal & Compliance
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              Transparency builds trust.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Welcome to the legal and compliance centre of Quality Insurance
              Brokers Limited (QIB). Find the policies that explain how we
              handle information, protect confidentiality and provide access to
              our digital insurance services.
            </p>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <BookOpen className="mt-0.5 shrink-0 text-sky-300" size={20} />
              <p className="text-sm leading-6 text-slate-300">
                Please review the documents relevant to your use of QIB's
                website and services. Insurance coverage remains subject to the
                applicable insurer's policy documents and terms.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0085b3]">
              Our documents
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Policies and terms
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
              These documents are intended to explain the standards, terms and
              safeguards associated with using QIB's platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {legalDocuments.map((document) => {
              const Icon = document.icon;
              const isAvailable = Boolean(document.href);

              const cardContent = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#0096c7] transition group-hover:bg-[#0096c7] group-hover:text-white">
                      <Icon size={23} />
                    </span>

                    {isAvailable ? (
                      <ArrowUpRight
                        size={19}
                        className="text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0096c7]"
                      />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        Coming soon
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-slate-950">
                      {document.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {document.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span
                      className={`text-xs font-semibold ${
                        isAvailable ? "text-[#0085b3]" : "text-slate-400"
                      }`}
                    >
                      {document.status}
                    </span>

                    {isAvailable && (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3]">
                        Read document
                        <ArrowRight size={16} />
                      </span>
                    )}
                  </div>
                </>
              );

              return isAvailable ? (
                <Link
                  key={document.title}
                  href={document.href!}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-900/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 sm:p-6"
                >
                  {cardContent}
                </Link>
              ) : (
                <article
                  key={document.title}
                  aria-label={`${document.title}, ${document.status}`}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  {cardContent}
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0096c7]">
              <Scale size={20} />
            </span>
            <div>
              <h2 className="font-bold text-slate-950">
                Have a legal or privacy enquiry?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                For questions about a QIB policy or how it applies to your use
                of our services, please contact QIB through the official contact
                channels published on our website.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
