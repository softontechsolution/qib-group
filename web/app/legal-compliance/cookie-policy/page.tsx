import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Cookie,
  LockKeyhole,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy | QIB",
  description:
    "Learn how Quality Insurance Brokers Limited uses cookies and similar technologies and how to manage your privacy choices.",
};

type CookieSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const sections: CookieSection[] = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    paragraphs: [
      "Cookies are small text files that a website may store on your device when you visit it. They can help a website remember information about a session, preserve preferences, support security or understand how visitors interact with its pages.",
      "Similar technologies may include local storage, software development tools, pixels, tags and other mechanisms that store or access information on a device. The technology used and the information collected depend on the features enabled on the website.",
      "This Policy explains the purposes for which Quality Insurance Brokers Limited (QIB) may use these technologies through its website and digital insurance services.",
    ],
  },
  {
    id: "necessary",
    title: "2. Strictly Necessary Cookies",
    paragraphs: [
      "Strictly necessary technologies support core functions that a visitor has requested or that are required to operate, secure and maintain a website service. Depending on the features used, these may support account authentication, session continuity, fraud prevention, security controls, form submissions or payment-related workflows.",
      "These technologies are not used to create advertising profiles. Where a cookie or similar technology is genuinely necessary for a service you request, it may be treated differently from optional analytics or advertising technologies under applicable law.",
      "QIB will seek to limit necessary technologies to those required for their stated purpose. Disabling some of them through browser settings may prevent account sign-in or other website features from working correctly.",
    ],
  },
  {
    id: "analytics",
    title: "3. Performance and Analytics Cookies",
    paragraphs: [
      "Where analytics tools are enabled, they may help QIB understand how visitors use the website, such as which pages are visited, how visitors navigate between sections, whether errors occur and how the website performs.",
      "Such information may be used to identify technical problems, improve page usability, assess the effectiveness of content and improve the reliability of digital insurance services.",
      "QIB will not treat analytics cookies as necessary merely because analytics may be useful for improving the website. Where the applicable law requires consent for an analytics or related tracking technology, that technology must not be activated before valid consent is obtained.",
      "QIB's specific analytics providers and the cookies they set should be identified in the cookie inventory when those tools are confirmed. This Policy does not assert that any particular analytics service is currently enabled.",
    ],
  },
  {
    id: "functionality",
    title: "4. Functionality and Preference Cookies",
    paragraphs: [
      "Where enabled, functionality technologies may remember choices that improve your experience, such as display preferences or other settings you choose to save.",
      "Information used for these purposes should be limited to what is reasonably necessary to provide the relevant preference or feature. Technologies that are not essential to a service you requested will be handled according to the consent requirements that apply to them.",
    ],
  },
  {
    id: "advertising",
    title: "5. Targeting and Advertising Technologies",
    paragraphs: [
      "Advertising or targeting technologies may be used by websites to measure marketing activity, understand advertising performance or provide more relevant promotional messages.",
      "QIB will use these technologies only if they are enabled for a defined purpose and the required legal basis and consent controls are in place. Where consent is required, the relevant technologies must remain disabled until the visitor makes a valid choice.",
      "This Policy does not mean that QIB currently uses advertising cookies, remarketing pixels or any specific advertising platform. Such services should be listed here only after their presence and configuration have been verified.",
    ],
  },
  {
    id: "third-party",
    title: "6. Third-Party Cookies and Services",
    paragraphs: [
      "Some website functions may rely on third-party services, such as payment providers, security services, embedded content, communications tools or analytics providers. These services may use their own cookies or similar technologies when their features are active.",
      "A third party may process information under its own privacy notice and applicable terms. QIB does not control every aspect of a third party's technology or subsequent processing, but will assess relevant integrations and take appropriate steps concerning the disclosures, permissions and safeguards for which QIB is responsible.",
      "The exact third-party providers, cookie names, purposes, retention periods and domains should be recorded in QIB's cookie inventory and added to the detailed preference interface where applicable. Provider names must not be assumed or listed without verification.",
    ],
  },
  {
    id: "purposes",
    title: "7. Why We Use Cookies",
    paragraphs: [
      "Depending on which technologies are implemented and enabled, cookies and similar technologies may be used for the following purposes:",
    ],
    bullets: [
      "To maintain essential website functionality and requested sessions.",
      "To help protect accounts, forms and digital transactions against misuse.",
      "To remember preferences where the relevant functionality is enabled.",
      "To measure website performance and diagnose technical errors, where analytics tools are enabled and legally permitted.",
      "To assess content or marketing performance, where relevant tools are enabled and the required consent has been obtained.",
    ],
  },
  {
    id: "your-choices",
    title: "8. Your Cookie Choices and Consent",
    paragraphs: [
      "QIB's cookie practices must reflect the technologies actually in use. Where consent is legally required for a cookie or similar technology, consent must be freely given, informed, specific and expressed through a clear affirmative choice. Visitors must have a meaningful option to decline non-essential technologies without being forced to accept them.",
      "The intended cookie-preference experience for QIB will allow visitors to accept all relevant optional categories, reject non-essential categories, or review and select preferences by category. Necessary technologies may remain active where legally justified for the requested service.",
      "A preference interface must store the visitor's choice and ensure that optional technologies are not activated contrary to that choice. Simply displaying a banner or saving a preference is not sufficient if analytics or advertising scripts continue to run regardless of the selected setting.",
      "Before this Policy is published as final, QIB must verify that a working consent interface is available on the website and that the Cookie Settings control can reopen the preference interface. If a category is not used on the site, it should not be represented as an active cookie category.",
    ],
  },
  {
    id: "browser-controls",
    title: "9. Managing Cookies Through Your Browser",
    paragraphs: [
      "Most modern browsers allow you to review, block or delete cookies through their privacy or security settings. The available controls and instructions vary by browser and device.",
      "Blocking all cookies may prevent some website features from working correctly, including account authentication, maintaining a session or completing a requested workflow.",
      "Browser-level controls are separate from a website's consent interface. Where the website provides a preference tool, use that tool to update choices for the categories it manages.",
    ],
  },
  {
    id: "retention",
    title: "10. Cookie Lifetimes and Storage",
    paragraphs: [
      "Some cookies are temporary and may be removed when you close your browser. Others may remain on your device for a defined period or until you delete them.",
      "The retention period should be proportionate to the purpose of each cookie or similar technology. QIB should document the actual lifespan of the technologies it uses and periodically review whether they remain necessary.",
      "Where personal data is processed through cookies or similar technologies, the processing is also subject to the applicable Privacy & Data Protection Policy and relevant legal requirements.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to This Cookie Policy",
    paragraphs: [
      "QIB may update this Policy when the website changes, new technologies are introduced, existing tools are removed or applicable legal requirements change.",
      "The current version should display its effective date and version number. Where a material change requires further notice or consent, QIB will take the steps required by applicable law.",
      "Visitors should review this page periodically to remain informed about QIB's cookie practices.",
    ],
  },
  {
    id: "contact",
    title: "12. Contact QIB",
    paragraphs: [
      "For questions about this Cookie Policy or QIB's use of cookies and similar technologies, contact Quality Insurance Brokers Limited through its official channels.",
      "Email: info@qibgroup.com",
      "Telephone: +234 706 675 0550",
      "Business contact address: Ahmadu Bello Way, Garki, Abuja, Nigeria.",
      "For a privacy request involving personal data, please identify your message as a privacy or data-protection enquiry.",
    ],
  },
];

export default function CookiePolicyPage() {
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
              <Cookie size={15} />
              Cookie Policy
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              Clear choices for your browsing experience.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              This Policy explains how Quality Insurance Brokers Limited (QIB)
              may use cookies and similar technologies across its website and
              digital insurance services, and how those technologies should be
              managed.
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
          <SlidersHorizontal
            className="mt-0.5 shrink-0 text-amber-700"
            size={20}
          />
          <div>
            <h2 className="text-sm font-bold text-amber-950">
              Cookie implementation review required
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              This is a working draft. Before publication, QIB should verify the
              cookies and third-party scripts actually used on the website,
              implement a functional consent and preference control where
              required, and ensure optional technologies respect each
              visitor&apos;s choice.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-sm font-bold text-slate-950">On this page</h2>
            <nav aria-label="Cookie Policy contents" className="mt-4">
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
                  Your privacy choices matter
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  QIB&apos;s cookie practices should be transparent, limited to
                  defined purposes and consistent with any consent required by
                  applicable law.
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
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <LockKeyhole
                  className="mt-0.5 shrink-0 text-[#0096c7]"
                  size={20}
                />
                <div>
                  <h2 className="font-bold text-slate-950">
                    Read our related policies
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Cookie-related processing may also involve personal
                    information covered by QIB&apos;s Privacy & Data Protection
                    Policy.
                  </p>
                  <Link
                    href="/legal-compliance/privacy-policy"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] hover:text-[#006d92]"
                  >
                    Privacy & Data Protection Policy
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-5">
              <Link
                href="/legal-compliance/terms-and-conditions"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0085b3] hover:text-[#006d92]"
              >
                <CheckCircle2 size={16} />
                Terms & Conditions of Use
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
