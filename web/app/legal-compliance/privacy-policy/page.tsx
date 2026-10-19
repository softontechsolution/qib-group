import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  Cookie,
  FileText,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy | QIB",
  description:
    "Learn how Quality Insurance Brokers Limited collects, uses, shares, retains and protects personal information across its digital insurance services.",
};

type PolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  paragraphsAfter?: string;
};

const sections: PolicySection[] = [
  {
    id: "who-we-are",
    title: "1. Data Controller and Scope",
    paragraphs: [
      "Quality Insurance Brokers Limited (QIB, we, us or our) is responsible for determining how personal data is processed in connection with its own website, customer accounts, enquiries and insurance brokerage activities, to the extent that QIB acts as a data controller for those activities.",
      "The role of QIB, an insurer, a payment service provider or another organisation depends on the actual activity and the arrangements governing it. An insurer or service provider may act as an independent data controller, joint controller where legally appropriate, or data processor. Their responsibilities should be assessed in the context of the relevant transaction.",
      "This Policy applies to personal data collected through QIB's website, digital insurance applications, customer vault, claims-related facilities, communications and other services to which this Policy is presented or linked.",
      "QIB's business contact address currently published on its website is Ahmadu Bello Way, Garki, Abuja, Nigeria. Its registered office details, designated Data Protection Officer (DPO), and specific regulatory particulars should be confirmed and completed before this Policy is approved for publication.",
    ],
  },
  {
    id: "data-we-collect",
    title: "2. Personal Data We Collect",
    paragraphs: [
      "The information collected depends on the service you use, the insurance product concerned, the information necessary to assess or administer a risk, and any applicable legal or regulatory requirements. We seek to collect information that is relevant and reasonably necessary for the stated purposes.",
    ],
    bullets: [
      "Identity and contact information: names, contact details, residential or business address, date of birth, and identification information such as a National Identification Number where it is lawfully required for an insurance or verification process.",
      "Insurance application and risk information: vehicle make and model, registration and chassis details, engine number, vehicle use, location, policyholder details, proposed coverage, insurer information and other information provided to arrange or administer insurance.",
      "Policy and transaction information: application references, policy and certificate numbers, insurance status, premium information, payment references, transaction status, relevant dates and correspondence associated with a policy.",
      "Claims and supporting documents: policy references, claim details, incident descriptions, forms, photographs, evidence files and other documents submitted for claim assistance or processing. These documents may contain sensitive information, which requires appropriate handling.",
      "Account and communications information: account identifiers, contact preferences, information submitted through website forms, customer enquiries, support communications and relevant account-security records.",
      "Payment-related information: transaction references, payment status and the limited payment information supplied by the relevant payment service provider. Do not send QIB your card PIN, account password, one-time verification code or full card security code.",
      "Technical and usage information: information such as IP address, device and browser characteristics, access times, diagnostic logs and usage events may be collected where the website, hosting environment or enabled technologies generate them.",
    ],
  },
  {
    id: "sources",
    title: "3. How We Obtain Personal Data",
    paragraphs: [
      "We generally obtain personal data directly from you when you register an account, submit an insurance application, request a quotation, make a payment, lodge or follow up on a claim, upload a document, or contact QIB.",
      "Where appropriate and lawful, information may also be obtained from an insurer, an authorised insurance intermediary, a payment service provider, an identity-verification provider, an authorised representative, a policy-issuance or verification system, or another source relevant to the requested transaction.",
      "If you provide information about another person, you should have the authority or other lawful basis necessary to provide it. Where required by law, that person should receive the relevant privacy information.",
    ],
  },
  {
    id: "purposes",
    title: "4. How We Use Personal Data",
    paragraphs: [
      "We process personal data for specific, lawful and legitimate purposes associated with operating QIB's business and delivering the relevant services. Depending on the circumstances, those purposes may include:",
    ],
    bullets: [
      "Creating and managing customer accounts and responding to enquiries.",
      "Receiving and processing insurance applications and communicating relevant information to an insurer.",
      "Supporting policy issuance, certificate access, policy administration and insurance verification where applicable.",
      "Processing or reconciling premium payments, transaction references and payment enquiries.",
      "Receiving claim-related information and assisting with claims communication or documentation.",
      "Verifying identity, preventing fraud, protecting accounts and investigating suspected unlawful activity.",
      "Maintaining business, customer-support, audit and transaction records where required or reasonably necessary.",
      "Operating, troubleshooting, securing and improving the website and digital insurance services.",
      "Meeting legal, regulatory, recordkeeping and lawful-authority requirements.",
      "Sending service-related notifications and, where permitted, optional marketing communications in accordance with your preferences and applicable law.",
    ],
  },
  {
    id: "lawful-bases",
    title: "5. Lawful Bases for Processing",
    paragraphs: [
      "QIB processes personal data only where an applicable lawful basis is available under the Nigeria Data Protection Act 2023 and other applicable law. The lawful basis depends on the purpose and context of each processing activity.",
    ],
    bullets: [
      "Contractual necessity: processing necessary to take steps at your request before entering into an arrangement, or to perform a contract with you.",
      "Legal obligation: processing necessary to comply with a legal or regulatory requirement applicable to QIB or the relevant transaction.",
      "Consent: processing based on your valid consent where consent is the appropriate legal basis, such as certain optional marketing activities or non-essential tracking technologies where required.",
      "Legitimate interests: processing necessary for a legitimate interest pursued by QIB or another relevant party, where that interest is not overridden by your applicable rights and interests and the legal requirements are satisfied.",
      "Vital interests, public interest or other recognised legal grounds: where the particular circumstances and applicable law permit reliance on such a basis.",
    ],
    // Keep the lawful basis aligned with the actual purpose and transaction.
  },
  {
    id: "sharing",
    title: "6. How We Share Personal Data",
    paragraphs: [
      "QIB does not sell personal data as a commercial product. We may disclose relevant information where necessary for a stated purpose, permitted by law, authorised by you, or required by a lawful obligation.",
      "The recipients depend on the service involved and may include:",
    ],
    bullets: [
      "Insurers and authorised insurance intermediaries involved in obtaining, issuing or administering a policy or handling an insurance enquiry or claim.",
      "Payment service providers and relevant financial institutions for payment processing, reconciliation, refunds or transaction investigations.",
      "Technology, hosting, communications, security and support providers that help operate the website and digital services under appropriate arrangements.",
      "Authorised policy-issuance, verification or industry systems where sharing is necessary and lawful for the insurance transaction.",
      "Professional advisers, auditors and insurers where relevant to QIB's lawful business and risk-management needs.",
      "Regulators, courts, law-enforcement authorities and other public bodies where required by law or valid legal process.",
    ],
    paragraphsAfter:
      "We seek to limit disclosures to information relevant to the recipient's role and the purpose for which it is shared. The recipient's own privacy obligations may also apply to its subsequent processing.",
  },
  {
    id: "international-transfers",
    title: "7. International Data Transfers",
    paragraphs: [
      "Some technology or service providers may store or process information outside Nigeria. Where personal data is transferred across borders, QIB will assess the transfer and apply the requirements and safeguards prescribed by the Nigeria Data Protection Act 2023 and applicable rules.",
      "Depending on the circumstances, this may require an applicable adequacy basis, an appropriate safeguard or another legally recognised transfer mechanism. The transfer must also respect the rights of data subjects and any applicable restrictions.",
      "The specific location of data storage and processing depends on the systems and providers used for the relevant service. Details should be confirmed against QIB's actual provider arrangements before publication of a final compliance statement.",
    ],
  },
  {
    id: "retention",
    title: "8. Data Retention",
    paragraphs: [
      "QIB retains personal data for no longer than is reasonably necessary for the purpose for which it was collected, except where a longer period is required or permitted by law or a lawful business need.",
      "Retention periods may depend on the type of insurance transaction, the status of an application or policy, the handling of a claim or complaint, applicable regulatory and accounting obligations, security needs and the resolution of legal claims.",
      "When data is no longer required, QIB will take appropriate steps to delete, securely dispose of or irreversibly anonymise it, subject to applicable legal and operational constraints.",
      "Specific retention periods should be established in QIB's internal retention schedule and may differ between application records, policy documents, claims evidence, payment records, security logs and general enquiries.",
    ],
  },
  {
    id: "security",
    title: "9. Data Security and Confidentiality",
    paragraphs: [
      "QIB seeks to protect personal data using technical and organisational measures proportionate to the nature of the information, the purposes of processing and the potential risks to individuals.",
      "Depending on the relevant system, safeguards may include access restrictions, authentication controls, secure transmission, operational monitoring, backup arrangements, staff confidentiality requirements and supplier oversight. The exact controls and their implementation should be confirmed against the systems in use.",
      "Access to customer data should be limited to people and service providers who require it for an authorised purpose. Customers should keep their account credentials private, use secure devices and report suspected unauthorised access promptly.",
      "No method of transmission or storage can be guaranteed to be completely secure. However, this does not remove QIB's responsibility to apply appropriate safeguards and respond to security incidents in accordance with applicable law.",
    ],
  },
  {
    id: "your-rights",
    title: "10. Your Data Protection Rights",
    paragraphs: [
      "Subject to the requirements, conditions and exceptions in applicable law, you may have rights in relation to personal data processed about you. These rights may include:",
    ],
    bullets: [
      "The right to be informed about the processing of your personal data.",
      "The right to request access to your personal data and relevant information about its processing.",
      "The right to request correction or completion of inaccurate or incomplete data.",
      "The right to request erasure in circumstances where the law gives you that right.",
      "The right to request restriction of processing or to object to certain processing where applicable.",
      "The right to receive or request transfer of qualifying data in a structured, commonly used and machine-readable format where the legal conditions for portability are met.",
      "The right to withdraw consent where processing is based on consent. Withdrawal does not make prior lawful processing unlawful and does not affect processing that relies on another lawful basis.",
      "The right to challenge certain decisions based solely on automated processing where the applicable legal protections apply.",
      "The right to lodge a complaint with the Nigeria Data Protection Commission (NDPC) if you believe your data protection rights have been infringed.",
    ],
    paragraphsAfter:
      "These rights are not absolute and may be subject to lawful exceptions, including legitimate retention requirements. QIB may need to verify your identity and request sufficient information to locate the relevant records before responding.",
  },
  {
    id: "how-to-exercise",
    title: "11. How to Exercise Your Rights",
    paragraphs: [
      "To make a privacy request or raise a data-protection concern, contact QIB using the contact details in the Contact section below and mark the communication for the attention of the Data Protection Officer or privacy contact.",
      "Please describe the request, provide an appropriate account or transaction reference where relevant, and include enough information for QIB to locate the records. Do not send account passwords, one-time codes or unnecessary sensitive information.",
      "QIB will assess and respond to requests in accordance with applicable law. Depending on the request, QIB may need to verify identity, clarify the scope of the request, explain a lawful reason for retaining certain information or advise where another organisation is responsible for the relevant processing.",
      "If the concern relates to an insurer or another organisation acting as an independent controller, QIB may direct you to that organisation or assist with the enquiry where appropriate.",
    ],
  },
  {
    id: "marketing",
    title: "12. Marketing and Communications",
    paragraphs: [
      "QIB may send service-related communications needed to process an application, administer an account, confirm transactions, provide policy information or respond to a customer enquiry.",
      "Optional marketing messages will be handled in accordance with applicable law and the relevant lawful basis. Where consent is required, QIB will seek it before sending those communications.",
      "You can opt out of marketing communications by using an available unsubscribe mechanism or contacting QIB. Opting out of marketing does not prevent communications necessary to administer a policy, transaction, security matter or legal obligation.",
    ],
  },
  {
    id: "cookies",
    title: "13. Cookies and Similar Technologies",
    paragraphs: [
      "The website or its service providers may use cookies and similar technologies to support essential functionality, maintain preferences, protect sessions, measure performance or understand website usage, depending on the technologies enabled.",
      "Where consent is required for non-essential cookies or tracking technologies, QIB should provide an appropriate notice and choice mechanism. Browser settings may also allow you to control certain cookies, although disabling essential cookies can affect website functionality.",
      "More detail will be provided in the separate Cookie Policy, which should describe the technologies actually used by the QIB website and how preferences can be managed.",
    ],
  },
  {
    id: "children",
    title: "14. Children's Personal Data",
    paragraphs: [
      "QIB's customer-account and transactional services are generally intended for users who have the legal capacity to use them. However, certain insurance records may lawfully contain information about a child or dependent where that information is necessary for a policy or related service.",
      "Where children's personal data is processed, QIB will apply the protections and authorisation requirements prescribed by applicable law. A parent, guardian or other authorised representative should provide information about a child only where legally permitted and necessary for the relevant purpose.",
    ],
  },
  {
    id: "breaches",
    title: "15. Personal Data Breaches",
    paragraphs: [
      "QIB will take appropriate steps to assess and respond to suspected personal data breaches, including investigating the incident, containing further exposure where practicable, assessing risks to individuals and keeping relevant records.",
      "Where a breach is likely to result in a risk to the rights and freedoms of individuals, QIB will notify the Nigeria Data Protection Commission within the period required by applicable law, including the 72-hour notification requirement where it applies. Where a breach is likely to result in a high risk to the rights and freedoms of affected individuals, QIB will notify those individuals as required by law, subject to applicable exceptions.",
      "Notifications will be made in accordance with the Nigeria Data Protection Act 2023 and any applicable regulatory requirements. The information provided will depend on the incident and the information reasonably available at the time.",
    ],
  },
  {
    id: "changes",
    title: "16. Changes to This Policy",
    paragraphs: [
      "QIB may update this Policy to reflect changes in its services, data-processing practices, technology providers or legal obligations.",
      "The current version should display its effective date and version number. Where a material change requires notice, consent or another action under applicable law, QIB will take the appropriate steps.",
      "Please review this page periodically to remain informed about how QIB handles personal data.",
    ],
  },
  {
    id: "contact",
    title: "17. Contact QIB and Privacy Complaints",
    paragraphs: [
      "For privacy enquiries, data-subject requests or concerns about the handling of your personal data, contact Quality Insurance Brokers Limited and identify your message as a privacy or data-protection request.",
      "Email: info@qibgroup.com",
      "Telephone: +234 706 675 0550",
      "Business contact address: Ahmadu Bello Way, Garki, Abuja, Nigeria.",
      "Attention: Data Protection Officer / Privacy Contact. QIB should confirm and publish the designated privacy contact or DPO details before this Policy is finalised.",
      "You may also contact the Nigeria Data Protection Commission through its official website at https://ndpc.gov.ng/ if you believe your data protection rights have been infringed.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck size={15} />
              Privacy & Data Protection
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              Your information. Handled with care.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              This Policy explains how Quality Insurance Brokers Limited
              collects, uses, shares, retains and protects personal information
              through its website and digital insurance services.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-slate-300 sm:text-sm">
              <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                Nigeria Data Protection Act 2023
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
          <FileText className="mt-0.5 shrink-0 text-amber-700" size={20} />
          <div>
            <h2 className="text-sm font-bold text-amber-950">
              Publication review required
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              This is a working draft. QIB should confirm its actual data flows,
              technology providers, retention schedule, privacy contact and
              applicable regulatory disclosures before publishing this Policy as
              final.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-sm font-bold text-slate-950">On this page</h2>
            <nav aria-label="Privacy policy contents" className="mt-4">
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
                <LockKeyhole size={22} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Our privacy commitment
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  QIB aims to handle personal information lawfully,
                  transparently and responsibly, with safeguards appropriate to
                  the nature of the information and the services provided.
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
                        ) : paragraph.startsWith("You may also contact") ? (
                          <>
                            You may also contact the Nigeria Data Protection
                            Commission through its official website at{" "}
                            <a
                              href="https://ndpc.gov.ng/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#0085b3] hover:underline"
                            >
                              ndpc.gov.ng
                              <ArrowUpRight
                                size={13}
                                className="ml-0.5 inline"
                              />
                            </a>{" "}
                            if you believe your data protection rights have been
                            infringed.
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
                    {section.paragraphsAfter && (
                      <p>{section.paragraphsAfter}</p>
                    )}
                    {section.id === "cookies" && (
                      <Link
                        href="/legal-compliance/cookie-policy"
                        className="inline-flex items-center gap-2 font-semibold text-[#0085b3] hover:text-[#006d92]"
                      >
                        <Cookie size={16} />
                        Read the Cookie Policy when available
                        <ArrowUpRight size={15} />
                      </Link>
                    )}

                    {section.id === "sharing" && (
                      <Link
                        href="/legal-compliance/non-disclosure-confidentiality"
                        className="inline-flex items-center gap-2 font-semibold text-[#0085b3] hover:text-[#006d92]"
                      >
                        <FileText size={16} />
                        Non-Disclosure & Confidentiality Policy
                        <ArrowUpRight size={15} />
                      </Link>
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
                    Questions about your data?
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Contact QIB through its official support channels and
                    identify your request as a privacy or data-protection
                    enquiry. Do not send passwords or one-time verification
                    codes.
                  </p>
                  <a
                    href="mailto:info@qibgroup.com?subject=Privacy%20and%20Data%20Protection%20Request"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] hover:text-[#006d92]"
                  >
                    Contact QIB about privacy
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-5">
              <Link
                href="/legal-compliance/terms-and-conditions"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] hover:text-[#006d92]"
              >
                Read Terms & Conditions of Use
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
