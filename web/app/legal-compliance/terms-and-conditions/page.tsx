import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  Scale,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions of Use | QIB",
  description:
    "Read the terms governing use of the Quality Insurance Brokers Limited website and digital insurance services.",
};

type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  paragraphsAfter?: string;
};

const sections: LegalSection[] = [
  {
    id: "definitions",
    title: "1. Definitions and Interpretation",
    paragraphs: [
      "In these Terms, QIB, we, us or our means Quality Insurance Brokers Limited. Website means the official QIB website, customer portal and associated digital facilities operated or authorised by QIB.",
      "Services means the insurance brokerage, insurance-related support, digital application facilities, payment facilitation, policy-document access and other services made available by QIB, subject to applicable law and the scope of QIB's authorisation.",
      "Insurer means an insurance company responsible for underwriting or providing an insurance policy. Policy means the insurance contract and its applicable schedule, certificate, terms, conditions, exclusions, endorsements and other documents.",
      "User, Customer or you means a person or legal entity accessing the Website or using QIB's Services. Customer Account means an account used to access relevant digital services or records. Content means materials made available on the Website, excluding materials owned by third parties.",
      "Applicable Law means the laws and binding regulatory requirements relevant to QIB and the Services in Nigeria, including applicable insurance, data protection and consumer-protection legislation, as amended or replaced.",
      "These Terms govern general Website use. Where an insurance policy or separate agreement governs a specific transaction, that document applies to the transaction to the extent of any lawful inconsistency with these Terms.",
    ],
  },
  {
    id: "about-qib",
    title: "2. About QIB",
    paragraphs: [
      "Quality Insurance Brokers Limited is an insurance-focused business providing brokerage services and digital facilities intended to make insurance-related processes more accessible and convenient.",
      "Depending on the service, QIB may help customers explore insurance options, submit applications, communicate information to insurers, facilitate approved payment processes, access policy documents and obtain assistance with insurance-related enquiries or claims.",
      "QIB operates subject to the legal and regulatory requirements applicable to the activities it performs. Regulated insurance brokerage activities will be undertaken only to the extent permitted by applicable law and relevant authorisations.",
      "QIB is not the insurer under a policy merely because an application is submitted or processed through the Website. The relevant insurer is responsible for underwriting decisions, policy terms, coverage decisions and claim determinations, subject to applicable law and the insurance contract.",
    ],
  },
  {
    id: "eligibility",
    title: "3. Eligibility and Customer Accounts",
    paragraphs: [
      "By using account-based Services, you confirm that you have the legal capacity to enter into the relevant transaction. Where a service requires an individual to be at least 18 years old, that requirement must be satisfied.",
      "You agree to provide accurate, complete and current information, update material details when they change, protect your login credentials and notify QIB promptly if you suspect unauthorised account access.",
      "QIB may request information or documents reasonably necessary to process an application, verify identity, prevent fraud, meet regulatory requirements or administer a requested service.",
      "QIB may restrict or suspend an account where reasonably necessary to protect customers, investigate suspected fraud, address a security incident, comply with a lawful direction or respond to a material breach. Where practicable and legally permissible, QIB will provide notice or an explanation.",
    ],
    bullets: [
      "Use your account only for lawful purposes.",
      "Do not share credentials or allow unauthorised access to your account.",
      "Ensure you are authorised to submit information on behalf of any other person or business.",
      "Report suspected account compromise or incorrect account activity promptly.",
    ],
  },
  {
    id: "insurance-services",
    title: "4. Nature of Insurance Services",
    paragraphs: [
      "Website descriptions, educational material, calculators and indicative quotations are provided for general information and do not replace the actual terms of an insurance product or personalised advice where such advice is separately agreed.",
      "Submitting an application or requesting a quotation does not guarantee that an insurer will accept the application, offer the requested cover or approve the proposed terms. Quotations may depend on underwriting, verification, risk assessment, insurer approval and other applicable requirements.",
      "Do not assume that insurance cover has commenced merely because you submitted a form, received an application reference, initiated a payment or created an account. Commencement, duration and scope of cover are determined by the applicable insurance contract and valid confirmation of cover, subject to applicable law.",
      "QIB may provide policy documents or certificates electronically. Access to a document does not independently amend the insurance contract. Customers should check the insurer, insured party, coverage limits, exclusions and effective and expiry dates, and report apparent errors promptly.",
      "QIB may assist with claim submissions, communication with insurers or follow-up, depending on the relevant service. Claims remain subject to the policy, evidence, applicable deadlines, insurer assessment and applicable law. QIB does not guarantee claim approval, a particular settlement amount or a specific resolution time.",
    ],
  },
  {
    id: "digital-processing",
    title: "5. Electronic Applications and Digital Processing",
    paragraphs: [
      "QIB may use digital systems to receive applications, validate information, communicate with insurers, process transactions, generate or retrieve documents and provide account services.",
      "Digital processing may require relevant information to be transmitted to insurers, payment service providers, technology providers and other authorised parties where necessary for the requested service or another lawful purpose.",
      "You agree to review material information before submitting an application or confirming a transaction. Electronic records, acknowledgements, receipts and communications may serve as evidence of a transaction, subject to applicable law and the relevant insurance contract.",
      "Temporary interruptions can occur because of maintenance, network failures, third-party disruptions, security incidents or other circumstances beyond reasonable control. If a transaction appears incomplete, duplicated or inconsistent, contact QIB through its official channels before repeating a payment or application.",
    ],
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable Use",
    paragraphs: [
      "You must use the Website lawfully and must not interfere with the security, integrity or intended operation of QIB's digital services.",
    ],
    bullets: [
      "Submit fraudulent applications, materially false information or misleading documents.",
      "Impersonate another person or misrepresent authority to act for a customer or business.",
      "Access another customer's account, policy documents or personal information without authorisation.",
      "Introduce malicious code, attempt unauthorised system access or compromise the platform.",
      "Scrape, harvest or systematically collect protected data or Content without lawful authority or required written permission.",
      "Infringe intellectual property, confidentiality or other legal rights.",
      "Use QIB's facilities to facilitate fraud, money laundering or another unlawful transaction.",
    ],
    paragraphsAfter:
      "QIB may investigate suspected misuse and take proportionate measures, including restricting access, preserving relevant records and reporting matters to competent authorities where required or permitted by law.",
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    paragraphs: [
      "Unless otherwise stated, the QIB name, logos, website design, original text, graphics, software and other Content are owned by QIB or used under an appropriate licence.",
      "You may access and use the Website for purposes consistent with the intended Services and applicable law. You must not reproduce, republish, distribute, adapt, commercially exploit or represent protected QIB Content as your own without permission, except where use is expressly permitted by law.",
      "Third-party names, insurer trademarks, payment-provider marks and externally owned materials remain the property of their respective owners. These Terms do not transfer intellectual property ownership to you.",
    ],
  },
  {
    id: "payments",
    title: "8. Premiums, Fees and Payments",
    paragraphs: [
      "Insurance premiums are determined in accordance with the relevant insurer's product, underwriting decision and applicable requirements. Any separate brokerage, administrative or service fee charged by QIB should be disclosed before the customer becomes bound to pay it, subject to applicable law.",
      "Payments must be made through channels officially designated for the relevant transaction. A third-party payment service provider may process payment details under its own terms and privacy arrangements. QIB's handling of related personal information is described in its privacy disclosures.",
      "Customers should retain transaction references and receipts. Do not disclose passwords, one-time verification codes or security credentials to anyone claiming to act for QIB.",
      "Payment initiation and successful payment confirmation are distinct stages. A receipt alone should not be treated as proof that insurance cover has commenced unless the applicable policy or valid confirmation establishes that cover has begun.",
      "Where a payment is delayed, duplicated, reversed or incorrectly allocated, QIB will investigate through the applicable process and coordinate with the relevant payment provider or insurer as appropriate.",
      "Refund eligibility, cancellation, reversal and applicable charges depend on the transaction terms, underlying insurance arrangement, payment procedures and applicable law. Nothing in these Terms excludes a refund or cancellation right that must be provided by law.",
    ],
  },
  {
    id: "customer-responsibilities",
    title: "9. Customer Responsibilities for Insurance Records",
    paragraphs: [
      "Customers are responsible for reviewing the accuracy of information submitted in an insurance application, including names, contact details, vehicle or property particulars, policyholder details and other material risk information.",
      "Notify QIB promptly of apparent inaccuracies or changes that may affect an application or policy. Whether an amendment can be made, and its effect on cover, depends on the insurer and policy terms.",
      "Customers should keep copies of policy documents, payment confirmations, correspondence and claim records. Making a document available through the Website does not remove the customer's responsibility to comply with valid policy conditions, disclosure obligations, payment requirements or claim-notification deadlines.",
    ],
  },
  {
    id: "privacy",
    title: "10. Confidentiality and Data Protection",
    paragraphs: [
      "Insurance applications and customer accounts may involve personal, financial, identity, vehicle, business and other confidential information.",
      "QIB's collection, use, disclosure, storage and other processing of personal data are governed by its Privacy Policy and Data Protection Policy, read together with applicable law.",
      "Information may be shared with insurers, authorised intermediaries, payment providers, technology providers, professional advisers, regulators or law-enforcement authorities where necessary for a requested service, permitted by law or required to meet a legal obligation.",
      "QIB will apply appropriate measures to protect information within its control, proportionate to the nature of the information and the risks associated with its processing. Users must not access, disclose or use another person's confidential or personal information without the necessary authority.",
      "More detailed information about processing purposes, lawful bases, data-subject rights, retention and privacy contacts will be provided in QIB's Privacy Policy and Data Protection Policy. Confidential business information may also be governed by the Non-Disclosure and Confidentiality Policy.",
    ],
  },
  {
    id: "third-parties",
    title: "11. Third-Party Services and Links",
    paragraphs: [
      "The Website may link to or integrate with insurer websites, payment providers, identity-verification services and other third-party platforms.",
      "Third-party services may have their own terms, privacy notices and operational procedures. QIB does not control every aspect of those services and cannot guarantee uninterrupted availability.",
      "This provision does not exclude any responsibility QIB has under applicable law for its own acts, omissions, representations or contractual obligations. Where an external service is necessary for a transaction, customers should review the relevant terms and disclosures before proceeding.",
    ],
  },
  {
    id: "availability",
    title: "12. Service Availability and Security",
    paragraphs: [
      "QIB aims to provide a reliable and secure digital experience but does not warrant that the Website will be continuously available, entirely error-free or compatible with every device, browser or external system.",
      "QIB may perform maintenance, security updates or operational changes and may temporarily restrict features where reasonably necessary.",
      "Users should not rely solely on a website display, notification or automated status message when a transaction, insurance decision or time-sensitive obligation requires formal confirmation. Where an interruption may materially affect a transaction, QIB will take reasonable steps to provide relevant information or assistance where practicable.",
    ],
  },
  {
    id: "liability",
    title: "13. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, QIB is not responsible for losses caused solely by circumstances outside its reasonable control, including independent third-party platform failures, external network interruptions or unauthorised acts by third parties that QIB could not reasonably prevent.",
      "QIB is not the insurer under a policy merely because it facilitates an application or makes documents available. QIB does not independently determine an insurer's underwriting decision or claim outcome.",
      "Nothing in these Terms excludes or limits liability for fraud, fraudulent misrepresentation, negligence, breach of a non-excludable legal duty or any other liability that cannot lawfully be excluded or limited.",
      "Nothing in these Terms removes or restricts a consumer right, statutory remedy or regulatory protection that applicable law makes non-excludable. Any limitation must be interpreted consistently with applicable law and the contractual relationship concerned.",
    ],
  },
  {
    id: "indemnity",
    title: "14. Indemnity and Unlawful Use",
    paragraphs: [
      "To the extent permitted by law, you may be responsible for direct losses or reasonable expenses arising from your unlawful misuse of the Website, deliberate submission of fraudulent information, infringement of third-party rights or material breach of these Terms.",
      "This provision does not make a customer liable for losses caused by QIB's own breach, negligence, unlawful conduct or other acts for which QIB remains responsible under applicable law. It does not override legal protections afforded to consumers.",
    ],
  },
  {
    id: "suspension",
    title: "15. Suspension and Termination",
    paragraphs: [
      "QIB may suspend or restrict a Website feature or Customer Account where reasonably necessary to protect security, prevent fraud, investigate suspected misuse, comply with a lawful direction or address a material breach of these Terms.",
      "Where practicable and legally permissible, QIB will provide notice and an appropriate opportunity to resolve the issue.",
      "Account suspension or closure does not automatically cancel an insurance policy, eliminate an outstanding contractual obligation or remove a legal right. Policy cancellation, renewal, termination and coverage decisions remain subject to the policy, insurer procedures and applicable law.",
      "Records may be retained for periods required by law or reasonably necessary for lawful business, regulatory, dispute-resolution and recordkeeping purposes, in accordance with applicable privacy disclosures.",
    ],
  },
  {
    id: "force-majeure",
    title: "16. Force Majeure",
    paragraphs: [
      "QIB is not responsible for a delay caused by an event beyond its reasonable control, which may include a natural disaster, public emergency, government action, widespread telecommunications or power failure, civil disturbance or major third-party infrastructure disruption.",
      "Where reasonably practicable, QIB will take steps to reduce the effects of such an event and communicate material service interruptions.",
      "This provision does not excuse an obligation where applicable law does not permit that result, nor does it automatically alter the commencement, expiry or scope of an insurance policy.",
    ],
  },
  {
    id: "complaints",
    title: "17. Complaints and Dispute Resolution",
    paragraphs: [
      "QIB encourages customers to raise service concerns through its official customer-support channels so that issues can be reviewed and, where possible, resolved promptly and fairly.",
      "When submitting a complaint, provide the relevant transaction or policy reference, a clear description of the issue and supporting information where appropriate. Avoid sending passwords or unnecessary sensitive information.",
      "QIB will review complaints in accordance with applicable procedures and regulatory obligations. Where a complaint concerns an insurer's underwriting, claims decision or policy obligations, it may also be necessary to contact the insurer and, where appropriate, the competent regulator.",
      "Nothing in these Terms prevents a customer from exercising a lawful right to complain to a regulator, consumer-protection authority or other competent body.",
      "Where a dispute cannot be resolved directly, the parties may use mediation, arbitration under a valid agreement or proceedings before a court of competent jurisdiction, as appropriate under applicable law. No dispute-resolution provision is intended to remove a statutory remedy or impose an unlawful procedure.",
    ],
  },
  {
    id: "governing-law",
    title: "18. Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria, subject to any mandatory law applicable to a particular transaction or customer.",
      "Legal proceedings relating to these Terms may be brought before a court of competent jurisdiction in Nigeria, subject to applicable jurisdictional rules and any valid dispute-resolution agreement.",
      "Nothing in this section restricts a customer's statutory rights or a competent regulator's lawful authority.",
    ],
  },
  {
    id: "amendments",
    title: "19. Amendments to These Terms",
    paragraphs: [
      "QIB may update these Terms to reflect changes in its digital Services, business operations, security requirements or applicable law.",
      "The current version will be made available on the Website with its effective date and version information. Where required by law or where a material change affects an existing contractual relationship, QIB will provide appropriate notice or obtain any required acceptance.",
      "A revised version will not retrospectively remove an accrued legal right or alter an existing insurance contract contrary to its terms or applicable law. Where affirmative acceptance is legally required, continued browsing or use alone is not a substitute for that acceptance.",
    ],
  },
  {
    id: "general",
    title: "20. General Provisions",
    paragraphs: [
      "Severability: If a provision is found invalid or unenforceable, the remaining provisions continue to apply to the extent legally permissible.",
      "Entire agreement: These Terms govern general Website use and should be read with the relevant insurance policy, service-specific terms, Privacy Policy and Data Protection Policy, Cookie Policy and Non-Disclosure and Confidentiality Policy, as applicable.",
      "No waiver: Failure or delay by QIB in exercising a right does not automatically waive that right.",
      "No transfer: You must not transfer your account or rights under these Terms where doing so would breach these Terms, the relevant insurance policy or applicable law.",
      "Interpretation: Headings are included for ease of reading and do not independently determine the meaning of a provision.",
      "Electronic communications: QIB may communicate electronically through contact details associated with your account or transaction, subject to applicable law and any required customer consent.",
      "If a provision conflicts with a mandatory legal requirement, that legal requirement prevails to the extent of the conflict.",
    ],
  },
  {
    id: "contact",
    title: "21. Contact QIB",
    paragraphs: [
      "For questions about these Terms, the Website or QIB's digital insurance services, contact Quality Insurance Brokers Limited using its verified official contact channels.",
      "Before publication, QIB should confirm and supply the official website URL, customer-support email, telephone number, registered office address and applicable insurance brokerage registration or licence details.",
      "For privacy and personal-data concerns, use the contact details specified in QIB's Privacy Policy and Data Protection Policy. For a policy-specific enquiry or claim, include the relevant policy or transaction reference where appropriate, but do not send passwords, one-time verification codes or unnecessary sensitive information by ordinary email.",
    ],
  },
];

export default function TermsAndConditionsPage() {
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
              <Scale size={15} />
              Legal document
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              Terms & Conditions of Use
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              The terms governing access to QIB's website, customer portal and
              digital insurance services.
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
          <FileText className="mt-0.5 shrink-0 text-amber-700" size={20} />
          <div>
            <h2 className="text-sm font-bold text-amber-950">
              Publication review required
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              This is a working draft. Confirm the effective date, registered
              company details, contact information and applicable regulatory
              disclosures, and obtain legal review before publishing it as QIB's
              final terms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-sm font-bold text-slate-950">On this page</h2>
            <nav aria-label="Terms and Conditions contents" className="mt-4">
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
                  About these Terms
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Please read these provisions carefully before using the
                  relevant QIB digital services. They should be read together
                  with any applicable insurance policy and service-specific
                  agreement.
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
                        {paragraph}
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

                    {"paragraphsAfter" in section &&
                      typeof section.paragraphsAfter === "string" && (
                        <p>{section.paragraphsAfter}</p>
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
                    Related legal documents
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Visit the Legal & Compliance Centre for QIB's other policies
                    as they become available.
                  </p>
                  <Link
                    href="/legal-compliance"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] hover:text-[#006d92]"
                  >
                    Open Legal & Compliance Centre
                    <ArrowUpRight size={16} />
                  </Link>
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
