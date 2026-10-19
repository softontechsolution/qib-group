"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Cookie, Settings2, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "qib-cookie-consent-v1";
const OPEN_SETTINGS_EVENT = "qib:open-cookie-settings";
const CONSENT_CHANGED_EVENT = "qib:cookie-consent-changed";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  functionality: boolean;
  marketing: boolean;
  updatedAt: string;
};

type OptionalCategory = "analytics" | "functionality" | "marketing";

type PreferenceDraft = Record<OptionalCategory, boolean>;

const DEFAULT_DRAFT: PreferenceDraft = {
  analytics: false,
  functionality: false,
  marketing: false,
};

function readStoredConsent(): CookiePreferences | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;

    // Reject malformed records instead of treating them as consent.
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.functionality !== "boolean" ||
      typeof parsed.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      necessary: true,
      analytics: parsed.analytics,
      functionality: parsed.functionality,
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    // Storage can be unavailable in restricted browser contexts.
    return null;
  }
}

function toDraft(preferences: CookiePreferences | null): PreferenceDraft {
  if (!preferences) return { ...DEFAULT_DRAFT };

  return {
    analytics: preferences.analytics,
    functionality: preferences.functionality,
    marketing: preferences.marketing,
  };
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draft, setDraft] = useState<PreferenceDraft>({
    ...DEFAULT_DRAFT,
  });
  const [storageWarning, setStorageWarning] = useState("");

 
const savePreferences = useCallback((nextDraft: PreferenceDraft) => {
  const preferences: CookiePreferences = {
    necessary: true,
    analytics: nextDraft.analytics,
    functionality: nextDraft.functionality,
    marketing: nextDraft.marketing,
    updatedAt: new Date().toISOString(),
  };

  let savedToStorage = false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    savedToStorage = true;
    setStorageWarning("");
  } catch {
    setStorageWarning(
      "Your browser could not save these settings. They may not be remembered on your next visit.",
    );
  }

  // Notify consent-aware integrations of the visitor's current choice.
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGED_EVENT, {
      detail: preferences,
    }),
  );

  setDraft(toDraft(preferences));
  setIsCustomizing(!savedToStorage);
  setIsVisible(!savedToStorage);
}, []);


  const openSettings = useCallback(() => {
    setDraft(toDraft(readStoredConsent()));
    setIsCustomizing(true);
    setStorageWarning("");
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const existing = readStoredConsent();

    if (existing) {
      setDraft(toDraft(existing));
      setIsVisible(false);
    } else {
      setDraft({ ...DEFAULT_DRAFT });
      setIsVisible(true);
    }

    // The footer dispatches this event to reopen the preference panel.
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);

    return () => {
      window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
    };
  }, [openSettings]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[100] flex justify-center sm:inset-x-5 sm:bottom-5">
      <section
        role={isCustomizing ? "dialog" : "region"}
        aria-modal={isCustomizing ? false : undefined}
        aria-labelledby="qib-cookie-title"
        aria-describedby="qib-cookie-description"
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl shadow-slate-950/20"
      >
        <div className="h-1 bg-gradient-to-r from-[#0096c7] via-sky-400 to-cyan-200" />

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0096c7]">
              {isCustomizing ? <Settings2 size={22} /> : <Cookie size={22} />}
            </span>

            <div className="min-w-0 flex-1">
              <h2
                id="qib-cookie-title"
                className="text-lg font-bold text-slate-950"
              >
                {isCustomizing
                  ? "Cookie Settings"
                  : "Your privacy choices matter"}
              </h2>

              <p
                id="qib-cookie-description"
                className="mt-2 text-sm leading-6 text-slate-600"
              >
                {isCustomizing
                  ? "Choose which optional cookie categories QIB may use. Necessary technologies remain enabled to support essential website functions."
                  : "QIB uses necessary technologies to support the website. With your permission, optional technologies can help us understand website usage, remember preferences and measure marketing."}
              </p>
            </div>
          </div>

          {isCustomizing && (
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="mt-0.5 text-emerald-600">
                  <ShieldCheck size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Strictly necessary
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Supports requested core features such as secure sessions and
                    essential site functionality.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  Always on
                </span>
              </div>

              {(
                [
                  {
                    key: "analytics",
                    title: "Performance & analytics",
                    description:
                      "Helps assess site usage, diagnose errors and improve performance where analytics tools are enabled.",
                  },
                  {
                    key: "functionality",
                    title: "Functionality & preferences",
                    description:
                      "Remembers optional choices to provide a more personalised experience where supported.",
                  },
                  {
                    key: "marketing",
                    title: "Marketing & advertising",
                    description:
                      "Allows marketing measurement or advertising technologies where they are implemented and consent is required.",
                  },
                ] as {
                  key: OptionalCategory;
                  title: string;
                  description: string;
                }[]
              ).map((category) => (
                <label
                  key={category.key}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50/40"
                >
                  <input
                    type="checkbox"
                    checked={draft[category.key]}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        [category.key]: event.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 accent-[#0096c7]"
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">
                      {category.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {category.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {storageWarning && (
            <p role="status" className="mt-4 text-sm text-amber-700">
              {storageWarning}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            {isCustomizing ? (
              <>
                <button
                  type="button"
                  onClick={() => savePreferences({ ...DEFAULT_DRAFT })}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                >
                  Reject optional
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCustomizing(false);
                    setDraft(toDraft(readStoredConsent()));
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => savePreferences(draft)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0096c7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#007da7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                >
                  <Check size={17} />
                  Save preferences
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => savePreferences({ ...DEFAULT_DRAFT })}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                >
                  Reject non-essential
                </button>

                <button
                  type="button"
                  onClick={openSettings}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                >
                  <Settings2 size={17} />
                  Customize
                </button>

                <button
                  type="button"
                  onClick={() =>
                    savePreferences({
                      analytics: true,
                      functionality: true,
                      marketing: true,
                    })
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0096c7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#007da7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                >
                  Accept all
                </button>
              </>
            )}
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            Read our{" "}
            <a
              href="/legal-compliance/cookie-policy"
              className="font-semibold text-[#0085b3] underline-offset-4 hover:underline"
            >
              Cookie Policy
            </a>{" "}
            and{" "}
            <a
              href="/legal-compliance/privacy-policy"
              className="font-semibold text-[#0085b3] underline-offset-4 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
