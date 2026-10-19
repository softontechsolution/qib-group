import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  FileCheck2,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Non-Disclosure & Confidentiality Policy | QIB",
  description:
    "Read Quality Insurance Brokers Limited's policy for handling confidential customer, insurance, claims and business information.",
};

type PolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const sections: PolicySection[] = [
  {
    id: "purpose",
    title: "1. Purpose and Scope",
    paragraphs: [
      "This Non-Disclosure and Confidentiality Policy explains how Quality Insurance Brokers Limited (QIB) approaches the protection and permitted use of confidential information received, accessed or generated in connection with its insurance brokerage business, website, customer accounts and related digital services.",
      "It applies to confidential information handled by QIB in the course of customer enquiries, insurance applications, policy administration, payment-related enquiries, claims assistance, business relationships and other authorised activities.",
      "The Policy should be read together with QIB's Privacy & Data Protection Policy, applicable service terms, insurance documentation and any separate confidentiality agreement that applies to a particular engagement.",
    ],
  },
  {
    id: "our-commitment",
    title: "2. Our Commitment to Confidentiality",
    paragraphs: [
      "QIB recognises that customers may entrust it with information that is personal, financially sensitive, commercially valuable or otherwise confidential. Such information should be accessed, used and disclosed only for an authorised purpose and in accordance with applicable law and the relevant contractual arrangements.",
      "Confidential information may include, depending on the circumstances:",
    ],
    bullets: [
      "Personal identification and contact information, including identity details and customer account information.",
      "Insurance applications, policy schedules, certificates, premium information and transaction references.",
      "Vehicle, property, ownership, risk and policyholder information supplied to arrange or administer insurance.",
      "Claims notifications, incident descriptions, photographs, supporting documents and related correspondence.",
      "Business, operational, financial, pricing, commercial and contractual information shared in confidence.",
      "Non-public security, system, access-control and operational information.",
      "Other information that is identified as confidential or that a reasonable person would understand to be confidential in the circumstances.",
    ],
  },
  {
    id: "permitted-use",
    title: "3. Permitted Use of Confidential Information",
    paragraphs: [
      "QIB will use confidential information only to the extent reasonably necessary for the purpose for which it was obtained or another purpose that is lawful and appropriately authorised.",
      "Depending on the relevant service, permitted uses may include processing insurance applications, communicating with an insurer, providing access to policy documents, helping administer a claim, reconciling a payment, responding to customer support requests, protecting platform security and meeting lawful recordkeeping or regulatory requirements.",
      "Confidential information must not be used for an unrelated purpose, personal advantage or unauthorised commercial benefit. Access should be limited according to the task being performed and the authority of the person accessing the information.",
    ],
  },
  {
    id: "permitted-disclosure",
    title: "4. Permitted Disclosure",
    paragraphs: [
      "QIB will not disclose confidential information indiscriminately. Disclosure should be limited to what is relevant and reasonably necessary for the applicable lawful purpose.",
      "Depending on the circumstances, QIB may disclose information:",
    ],
    bullets: [
      "To an insurer or authorised insurance intermediary where the disclosure is necessary to obtain, issue, administer or service the relevant insurance cover.",
      "To payment providers, technology vendors, hosting providers or other authorised service providers where access is necessary to perform the relevant service and appropriate contractual or other safeguards are in place where required.",
      "To QIB personnel, auditors, professional advisers or authorised representatives who need the information for a legitimate role and are subject to appropriate confidentiality obligations.",
      "To a court, regulator, law-enforcement authority or other competent body where disclosure is required by law, a valid legal process or a lawful regulatory direction.",
      "Where disclosure is necessary to comply with an applicable reporting, fraud-prevention, anti-money laundering or counter-terrorist-financing obligation that applies to QIB or the relevant transaction.",
      "Where disclosure is necessary to establish, exercise or defend legal claims, protect a person's vital interests, or address another circumstance in which disclosure is lawfully permitted.",
      "With the relevant person's valid authorisation or consent where that is the appropriate basis for the disclosure.",
    ],
  },
  {
    id: "legal-privilege",
    title: "5. Legal Professional Privilege",
    paragraphs: [
      "QIB is an insurance brokerage and InsurTech business. Information provided to QIB does not automatically become legally privileged merely because it is confidential or relates to an insurance, dispute or claim.",
      "Legal professional privilege, where applicable, depends on the relevant legal relationship, the purpose and nature of the communication, and the requirements of Nigerian law. Where a customer separately engages a qualified legal practitioner, the protection of qualifying communications must be assessed in that professional relationship.",
      "This Policy does not claim to create, extend, waive or determine legal professional privilege. Customers who require legal advice should seek advice from a qualified legal practitioner.",
    ],
  },
  {
    id: "personnel",
    title: "6. Personnel and Authorised Access",
    paragraphs: [
      "QIB expects individuals who handle confidential customer or business information in the course of their duties to protect it against unauthorised access, use or disclosure.",
      "Access should be restricted to authorised personnel and representatives who need the information to perform an assigned task. Confidentiality expectations may be reflected in employment terms, service agreements, internal procedures and training, as applicable.",
      "Persons handling confidential information should use approved systems, follow access-control requirements, avoid unnecessary copying or downloading, and report suspected disclosure, loss or misuse promptly.",
      "The precise internal controls and training arrangements should be maintained and reviewed as part of QIB's operational governance. This Policy does not itself certify that a particular control has been implemented in every system.",
    ],
  },
  {
    id: "service-providers",
    title: "7. Third-Party Service Providers",
    paragraphs: [
      "QIB may rely on insurers, payment service providers, hosting providers, software vendors, communications platforms and other third parties to deliver or support its services.",
      "Where a third party needs access to confidential information, QIB will seek to limit that access to the relevant service and apply appropriate contractual, security and confidentiality safeguards in accordance with applicable law.",
      "Depending on the arrangement, the third party may act as a data processor, an independent data controller or another type of recipient. Its legal role and obligations should be established from the actual service and contractual arrangements.",
      "Third-party processing does not remove any obligations QIB continues to have for its own handling, sharing or protection of information.",
    ],
  },
  {
    id: "security",
    title: "8. Safeguarding Confidential Information",
    paragraphs: [
      "QIB aims to protect confidential information against unauthorised access, disclosure, alteration, loss or destruction through safeguards appropriate to the nature of the information and the risks involved.",
      "Depending on the system and service, relevant measures may include access restrictions, secure authentication, protected data transmission, supplier oversight, operational monitoring, backups and procedures for reporting and investigating incidents.",
      "Customers should protect their own account credentials and should not share passwords, one-time verification codes or other security credentials. Suspected unauthorised access to an account or confidential document should be reported through QIB's official channels as soon as possible.",
      "No method of electronic storage or transmission can be guaranteed to be completely secure. QIB's obligations to apply appropriate safeguards and respond to incidents remain subject to applicable law and the actual arrangements governing the service.",
    ],
  },
  {
    id: "retention",
    title: "9. Duration and Retention",
    paragraphs: [
      "Confidentiality obligations may continue after a transaction, policy administration task or business relationship has ended, subject to applicable law, the relevant agreement and the nature of the information.",
      "Information may need to be retained to administer an insurance policy, support a claim, address a complaint, satisfy legal or regulatory recordkeeping duties, investigate suspected fraud or establish or defend legal claims.",
      "QIB will handle retention and disposal of personal data in accordance with its Privacy & Data Protection Policy and applicable law. When confidential information is no longer required and there is no lawful reason to retain it, appropriate steps should be taken to securely dispose of it or render it irreversibly anonymous where suitable.",
      "This Policy does not impose a universal retention period for every category of confidential information. Applicable legal requirements, contractual terms, the relevant record type and QIB's documented retention schedule determine the appropriate period.",
    ],
  },
  {
    id: "incidents",
    title: "10. Reporting a Suspected Breach",
    paragraphs: [
      "If you believe confidential information held by QIB has been accessed, used, lost or disclosed without authorisation, please contact QIB promptly using the details in Section 11.",
      "Where appropriate, QIB will assess the report, investigate the circumstances, take reasonable steps to contain the incident, preserve relevant information and determine what remedial or follow-up measures are needed.",
      "Where an incident also constitutes a personal data breach, QIB will assess and meet applicable notification obligations to the relevant supervisory authority and affected individuals within the timelines and circumstances prescribed by law.",
      "Please do not include account passwords, one-time verification codes or unnecessary sensitive information in a breach report. Include a relevant transaction or policy reference only where it helps identify the matter safely.",
    ],
  },
  {
    id: "relationship",
    title: "11. Relationship with Other Policies and Agreements",
    paragraphs: [
      "This Policy is intended to explain QIB's confidentiality approach. It does not replace the Nigeria Data Protection Act 2023, another applicable law, a binding insurance contract, or a separate confidentiality agreement.",
      "Where a specific contract imposes valid confidentiality obligations that apply to a particular engagement, that agreement should be read alongside this Policy. In the event of a conflict, the applicable law governs, and the relevant contractual terms apply to the extent they are valid and enforceable.",
      "QIB's Privacy & Data Protection Policy provides further information about the handling of personal data. The Terms & Conditions of Use explain the general rules for using QIB's digital services.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to This Policy",
    paragraphs: [
      "QIB may update this Policy to reflect changes in its operations, technology, supplier arrangements or applicable legal requirements.",
      "The published version should identify its effective date and version number. Where a change requires notice or another action under applicable law or a relevant agreement, QIB will take the appropriate steps.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact QIB",
    paragraphs: [
      "For questions about this Policy or to report a suspected confidentiality concern, contact Quality Insurance Brokers Limited through its official customer-support channels.",
      "Email: info@qibgroup.com",
      "Telephone: +234 706 675 0550",
      "Business contact address: Ahmadu Bello Way, Garki, Abuja, Nigeria.",
      "When reporting a matter, identify it as a confidentiality or data-protection concern and provide sufficient information for QIB to understand the issue without exposing unnecessary sensitive data.",
    ],
  },
];

export default function NonDisclosureConfidentialityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8fb] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <Link
          href="/legal-compliance"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] transition hover:text-[#006d92]"
        >
          <ArrowLeft size={17} />
          Back to Legal & Compliance
        </Link>

        <header className="relative mb-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-9 text-white shadow-lg sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-44 w-44 rounded-full bg-[#0096c7]/20 blur-3xl" />

          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-sky-100">
              <LockKeyhole size={15} />
              Confidentiality & Information Protection
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              Protecting the information you entrust to QIB.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              This Policy explains how Quality Insurance Brokers Limited handles
              confidential customer, insurance, claims and business information
              in connection with its services.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-slate-300 sm:text-sm">
              <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                Quality Insurance Brokers Limited
              </span>
              <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                Version 1.0 — Draft for review
              </span>
              <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                Effective date: Pending approval
              </span>
            </div>
          </div>
        </header>

        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <FileCheck2 className="mt-0.5 shrink-0 text-amber-700" size={20} />
          <div>
            <h2 className="text-sm font-bold text-amber-950">
              Publication review required
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              This is a working draft. Confirm QIB&apos;s internal
              confidentiality procedures, supplier arrangements, retention
              schedule and incident-response process, and obtain legal review
              before publishing it as the final policy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-sm font-bold text-slate-950">On this page</h2>
            <nav aria-label="Confidentiality Policy contents" className="mt-4">
              <ol className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-lg px-3 py-2 text-xs leading-5 text-slate-600 transition hover:bg-sky-50 hover:text-[#007da7] sm:text-sm"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="min-w-0 rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-10">
            <div className="mb-8 flex items-start gap-3 border-b border-slate-100 pb-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0096c7]">
                <ShieldCheck size={22} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  A responsible approach to confidentiality
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Confidentiality, data protection and secure handling of
                  insurance records are important parts of a trustworthy digital
                  insurance service.
                </p>
              </div>
            </div>

            <div className="space-y-9">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28"
                >
                  <h2 className="text-lg font-bold leading-snug text-slate-950 sm:text-xl">
                    {section.title}
                  </h2>

                  <div className="mt-3 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={`${section.id}-paragraph-${index}`}>
                        {paragraph.startsWith("Email: ") ? (
                          <>
                            <strong>Email: </strong>
                            <a
                              href="mailto:info@qibgroup.com"
                              className="font-medium text-[#0085b3] hover:underline"
                            >
                              info@qibgroup.com
                            </a>
                          </>
                        ) : paragraph.startsWith("Telephone: ") ? (
                          <>
                            <strong>Telephone: </strong>
                            <a
                              href="tel:+2347066750550"
                              className="font-medium text-[#0085b3] hover:underline"
                            >
                              +234 706 675 0550
                            </a>
                          </>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))}

                    {section.bullets && (
                      <ul className="list-disc space-y-2 pl-5 marker:text-[#0096c7]">
                        {section.bullets.map((bullet, index) => (
                          <li key={`${section.id}-bullet-${index}`}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.id === "relationship" && (
                      <div className="flex flex-wrap gap-3 pt-1">
                        <Link
                          href="/legal-compliance/privacy-policy"
                          className="inline-flex items-center gap-2 font-semibold text-[#0085b3] hover:text-[#006d92]"
                        >
                          Privacy & Data Protection Policy
                          <ArrowUpRight size={15} />
                        </Link>
                        <Link
                          href="/legal-compliance/terms-and-conditions"
                          className="inline-flex items-center gap-2 font-semibold text-[#0085b3] hover:text-[#006d92]"
                        >
                          Terms & Conditions
                          <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <Scale className="mt-0.5 shrink-0 text-[#0096c7]" size={20} />
                <div>
                  <h2 className="font-bold text-slate-950">
                    Need to raise a concern?
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Contact QIB through its official channels if you suspect
                    your confidential information has been accessed or disclosed
                    without authorisation.
                  </p>
                  <a
                    href="mailto:info@qibgroup.com?subject=Confidentiality%20Concern"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] hover:text-[#006d92]"
                  >
                    Contact QIB
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
