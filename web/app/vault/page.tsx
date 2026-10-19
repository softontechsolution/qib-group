"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Download,
  FolderOpen,
  LockKeyhole,
  Plus,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldPlus,
  UserRound,
  Wallet,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AgentCommissionsSection } from "@/components/AgentCommissionsSection";
import { getUserVaultData } from "@/services/strapi";

type Tab = "overview" | "policies" | "claims";

type DataRecord = {
  id?: string | number;
  attributes?: Record<string, any>;
  [key: string]: any;
};

const BRAND = "#0096c7";

function recordData(record: DataRecord) {
  return record?.attributes || record || {};
}

function normalizedStatus(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
/**
 * Converts a stored certificate URL into a usable browser URL.
 * Supports absolute HTTP(S) URLs and paths served by the Strapi CMS.
 */
function resolveCertificateUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const rawUrl = value.trim();

  // Preserve absolute URLs supplied by the certificate generator.
  if (/^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }

  // The public CMS URL should point to the Strapi server, not /api.
  const strapiBaseUrl = (
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  )
    .replace(/\/api\/?$/i, "")
    .replace(/\/+$/, "");

  const filePath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;

  return `${strapiBaseUrl}${filePath}`;
}

function formatMoney(value: unknown) {
  const amount = Number(value);

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(amount)
  ) {
    return "Not available";
  }

  return `₦${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  })}`;
}

function displayStatus(value: unknown) {
  if (!value) return "Status unavailable";

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }: { status: unknown }) {
  const normalized = normalizedStatus(status);

  const style = ["active", "approved", "completed", "paid", "settled"].includes(
    normalized,
  )
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : ["pending", "reviewing", "in progress", "processing"].includes(normalized)
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : ["rejected", "expired", "cancelled", "canceled", "failed"].includes(
            normalized,
          )
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {displayStatus(status)}
    </span>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "cyan",
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  accent?: "cyan" | "amber" | "green";
}) {
  const accents = {
    cyan: "bg-sky-50 text-[#0096c7] ring-sky-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${accents[accent]}`}
        >
          <Icon size={21} strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-[#0096c7]">
        <Icon size={26} strokeWidth={1.6} />
      </span>
      <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface TimelineEventProps {
  title: string;
  time: string;
  children: React.ReactNode;
  complete?: boolean;
  active?: boolean;
  last?: boolean;
}

export function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="space-y-0">{children}</div>;
}

export function TimelineEvent({
  title,
  time,
  children,
  complete = false,
  active = false,
  last = false,
}: TimelineEventProps) {
  return (
    <div className="relative flex gap-4">
      <div className="flex w-5 shrink-0 flex-col items-center">
        <span
          className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            complete
              ? "border-emerald-500 bg-emerald-500 text-white"
              : active
                ? "border-[#0096c7] bg-white text-[#0096c7] ring-4 ring-sky-50"
                : "border-slate-200 bg-white text-slate-300"
          }`}
        >
          {complete ? (
            <CheckCircle2 size={13} />
          ) : active ? (
            <span className="h-1.5 w-1.5 rounded-full bg-[#0096c7]" />
          ) : null}
        </span>
        {!last && (
          <span
            className={`w-px flex-1 ${complete ? "bg-emerald-200" : "bg-slate-200"}`}
          />
        )}
      </div>

      <div className={`min-w-0 flex-1 ${last ? "pb-0" : "pb-7"}`}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h4
            className={`text-sm font-semibold ${active ? "text-[#007da7]" : "text-slate-800"}`}
          >
            {title}
          </h4>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <p className="mt-1.5 text-sm leading-6 text-slate-500">{children}</p>
      </div>
    </div>
  );
}

export default function UserVaultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [policies, setPolicies] = useState<DataRecord[]>([]);
  const [claims, setClaims] = useState<DataRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const currentUser = session?.user
    ? {
        id: (session as any).id || (session.user as any).id,
        email: session.user.email || "",
        fullName: session.user.name || "Valued Policyholder",
      }
    : null;

  // Read the Strapi JWT stored by the existing NextAuth session.
  const strapiJwt = (session as any)?.jwt as string | undefined;
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    let cancelled = false;

    async function fetchVaultContent() {
      if (!currentUser?.id || !strapiJwt) {
        setPolicies([]);
        setClaims([]);
        setLoadError(true);
        setIsLoadingData(false);
        return;
      }

      setIsLoadingData(true);
      setLoadError(false);

      try {
        // The backend identifies the customer from the validated JWT.
        const result = await getUserVaultData(strapiJwt);

        if (cancelled) return;

        setPolicies(Array.isArray(result.policies) ? result.policies : []);

        setClaims(Array.isArray(result.claims) ? result.claims : []);
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to load customer vault:", error);
          setPolicies([]);
          setClaims([]);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingData(false);
        }
      }
    }

    if (status === "authenticated") {
      fetchVaultContent();
    }

    return () => {
      cancelled = true;
    };
  }, [status, currentUser?.id, strapiJwt]);

  const activePolicies = useMemo(
    () =>
      policies.filter((policy) => {
        const item = recordData(policy);
        const state = normalizedStatus(item.policyStatus || item.status);
        return ["active", "approved", "issued"].includes(state);
      }),
    [policies],
  );

  const pendingClaims = useMemo(
    () =>
      claims.filter((claim) => {
        const state = normalizedStatus(recordData(claim).status);
        return ![
          "approved",
          "rejected",
          "completed",
          "settled",
          "closed",
        ].includes(state);
      }),
    [claims],
  );

  if (status === "loading" || (status === "authenticated" && !currentUser)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <ShieldCheck className="animate-pulse text-[#0096c7]" size={26} />
          </span>
          <p className="text-sm font-medium text-slate-500">
            Securing your account...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: FolderOpen },
    { id: "policies", label: "My policies", icon: Shield },
    { id: "claims", label: "Claims", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8fb] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your insurance vault
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Welcome back, {currentUser.fullName}. Manage your cover, review
              policy details and follow your claims.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm sm:self-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Signed in
          </div>
        </div>

        <section className="relative mb-7 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-900/10 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[#0096c7]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-sky-100">
                <ShieldCheck size={15} />
                Your protection, in one place
              </span>
              <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">
                Peace of mind starts with being prepared.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                Access your insurance records and keep track of your cover
                whenever you need them.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/buy-insurance")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0096c7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#007da7] focus:outline-none focus:ring-4 focus:ring-sky-400/30"
              >
                <ShieldPlus size={18} />
                Buy a policy
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => router.push("/lodge-claim")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                <Plus size={18} />
                Lodge a claim
              </button>
            </div>
          </div>
        </section>

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Active policies"
            value={isLoadingData ? "—" : activePolicies.length}
            description="Policies returned by your account that have an active, approved or issued status."
            icon={ShieldCheck}
            accent="cyan"
          />
          <MetricCard
            label="Claims awaiting resolution"
            value={isLoadingData ? "—" : pendingClaims.length}
            description="Claims not currently marked as approved, rejected, completed, settled or closed."
            icon={Clock3}
            accent="amber"
          />
          <MetricCard
            label="Total records"
            value={isLoadingData ? "—" : policies.length + claims.length}
            description="Policy and claim records currently available in your account."
            icon={Wallet}
            accent="green"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 pt-3 sm:px-6">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => {
                const selected = activeTab === id;

                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setActiveTab(id)}
                    aria-current={selected ? "page" : undefined}
                    className={`relative inline-flex shrink-0 items-center gap-2 px-4 py-4 text-sm font-semibold transition ${
                      selected
                        ? "text-[#0085b3]"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                    {id === "policies" && !isLoadingData && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${selected ? "bg-sky-50 text-[#0085b3]" : "bg-slate-100 text-slate-500"}`}
                      >
                        {policies.length}
                      </span>
                    )}
                    {id === "claims" && !isLoadingData && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${selected ? "bg-sky-50 text-[#0085b3]" : "bg-slate-100 text-slate-500"}`}
                      >
                        {claims.length}
                      </span>
                    )}
                    {selected && (
                      <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#0096c7]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-7">
            {isLoadingData ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <RefreshCw size={26} className="animate-spin text-[#0096c7]" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Loading your account records
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Retrieving your policies and claims.
                </p>
              </div>
            ) : loadError ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <CircleAlert
                    size={21}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <div>
                    <h3 className="font-semibold text-amber-900">
                      Some account records could not be loaded
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      The information below may be incomplete. Please refresh
                      the page to try again.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 underline underline-offset-4"
                    >
                      Refresh records
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-7">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-slate-950">
                          Account overview
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          A summary of the records currently available to you.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        Account records
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#0096c7]">
                              <Shield size={19} />
                            </span>
                            <div>
                              <h3 className="font-bold text-slate-900">
                                Your policies
                              </h3>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {policies.length} record
                                {policies.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab("policies")}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0085b3] hover:underline"
                          >
                            View all <ChevronRight size={16} />
                          </button>
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          {policies.length === 0 ? (
                            <p className="text-sm leading-6 text-slate-500">
                              No policy records are currently available for this
                              account.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {policies.slice(0, 3).map((policy, index) => {
                                const item = recordData(policy);
                                const status = item.policyStatus || item.status;

                                return (
                                  <div
                                    key={policy.id ?? index}
                                    className="flex items-center justify-between gap-3"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-slate-800">
                                        {item.policyNumber ||
                                          `Policy record ${index + 1}`}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-500">
                                        {item.classOfInsurance ||
                                          item.coverType ||
                                          "Insurance cover"}
                                      </p>
                                    </div>
                                    <StatusBadge status={status} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                              <FileText size={19} />
                            </span>
                            <div>
                              <h3 className="font-bold text-slate-900">
                                Claims activity
                              </h3>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {claims.length} record
                                {claims.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab("claims")}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0085b3] hover:underline"
                          >
                            View all <ChevronRight size={16} />
                          </button>
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          {claims.length === 0 ? (
                            <p className="text-sm leading-6 text-slate-500">
                              No claim records are currently available for this
                              account.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {claims.slice(0, 3).map((claim, index) => {
                                const item = recordData(claim);

                                return (
                                  <div
                                    key={claim.id ?? index}
                                    className="flex items-center justify-between gap-3"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-slate-800">
                                        Claim #{claim.id ?? index + 1}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-500">
                                        {formatDate(item.createdAt)}
                                      </p>
                                    </div>
                                    <StatusBadge status={item.status} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0096c7] shadow-sm">
                            <UserRound size={19} />
                          </span>
                          <div>
                            <h3 className="font-bold text-slate-900">
                              Account information
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Signed in as{" "}
                              {currentUser.email || "Email unavailable"}.
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                          <LockKeyhole size={14} />
                          Customer account
                        </span>
                      </div>
                    </div>

                    {session?.user && (session as any).user.isAgent && (
                      <div className="pt-1">
                        <AgentCommissionsSection
                          agentId={(session as any).user.agentId}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "policies" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-slate-950">
                        My cover policies
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Review the insurance records returned for your account.
                      </p>
                    </div>

                    {policies.length === 0 ? (
                      <EmptyState
                        icon={Shield}
                        title="No policy records found"
                        description="There are currently no policy records available in this account. You can explore insurance options if you need new cover."
                        action={
                          <button
                            type="button"
                            onClick={() => router.push("/buy-insurance")}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0096c7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#007da7]"
                          >
                            Explore insurance
                            <ArrowRight size={16} />
                          </button>
                        }
                      />
                    ) : (
                      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {policies.map((policy, index) => {
                          const item = recordData(policy);
                          const policyStatus = item.policyStatus || item.status;
                          const vehicle = [item.vehicleMake, item.vehicleModel]
                            .filter(Boolean)
                            .join(" ");
                          const policyDate = item.createdAt || item.publishedAt;
                          const certificateUrl = resolveCertificateUrl(
                            item.certificateUrl,
                          );
                          return (
                            <article
                              key={policy.id ?? index}
                              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-900/5"
                            >
                              <div className="h-1 bg-gradient-to-r from-[#0096c7] to-sky-300" />
                              <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex min-w-0 items-start gap-3">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0096c7]">
                                      <ShieldCheck size={22} />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                        Policy reference
                                      </p>
                                      <h3 className="mt-1 break-words text-base font-bold text-slate-950">
                                        {item.policyNumber ||
                                          "Reference unavailable"}
                                      </h3>
                                    </div>
                                  </div>
                                  <StatusBadge status={policyStatus} />
                                </div>

                                <div className="my-5 grid grid-cols-1 gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Coverage class
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                      {item.classOfInsurance ||
                                        item.coverType ||
                                        "Not specified"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Vehicle / asset
                                    </p>
                                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                      {vehicle || "Not specified"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Premium
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-slate-900">
                                      {formatMoney(item.premium)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">
                                      Record date
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                      {formatDate(policyDate)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <LockKeyhole
                                      size={14}
                                      className="shrink-0"
                                    />
                                    <span>
                                      Policy details from your account records
                                    </span>
                                  </div>

                                  {certificateUrl ? (
                                    <a
                                      href={certificateUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label={`Print or download PDF for policy ${
                                        item.policyNumber ||
                                        policy.id ||
                                        index + 1
                                      }`}
                                      className="group/button inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0096c7] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#007da7] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 sm:w-auto"
                                    >
                                      <Download
                                        size={18}
                                        className="transition-transform duration-200 group-hover/button:translate-y-0.5"
                                      />
                                      Print / Download PDF
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled
                                      title="A PDF certificate is not available for this policy yet."
                                      className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-400 sm:w-auto"
                                    >
                                      <Download size={18} />
                                      Certificate unavailable
                                    </button>
                                  )}
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "claims" && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-slate-950">
                        Claims tracking
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Review the recorded status of your claims.
                      </p>
                    </div>

                    {claims.length === 0 ? (
                      <EmptyState
                        icon={FileText}
                        title="No claims recorded"
                        description="No claim records are currently available for this account. If you need to report an incident, you can start a claim."
                        action={
                          <button
                            type="button"
                            onClick={() => router.push("/lodge-claim")}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0096c7] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#007da7]"
                          >
                            <Plus size={16} />
                            Lodge a claim
                          </button>
                        }
                      />
                    ) : (
                      <div className="space-y-5">
                        {claims.map((claim, index) => {
                          const item = recordData(claim);
                          const state = normalizedStatus(item.status);
                          const isApproved = [
                            "approved",
                            "completed",
                            "settled",
                            "closed",
                          ].includes(state);
                          const isRejected = state === "rejected";
                          const isResolved = isApproved || isRejected;
                          const isReviewing = [
                            "pending",
                            "reviewing",
                            "in progress",
                            "processing",
                          ].includes(state);
                          const date = formatDate(item.createdAt);
                          const claimId = claim.id ?? index + 1;

                          return (
                            <article
                              key={claimId}
                              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                            >
                              <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3">
                                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <FileText size={21} />
                                  </span>
                                  <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                      Claim reference
                                    </p>
                                    <h3 className="mt-1 text-base font-bold text-slate-950">
                                      Claim #{claimId}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                      {item.coverType ||
                                        item.classOfInsurance ||
                                        "Insurance claim"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-start gap-2 sm:items-end">
                                  <StatusBadge status={item.status} />
                                  <span className="text-xs text-slate-400">
                                    Filed: {date}
                                  </span>
                                </div>
                              </div>

                              <div className="mb-5 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Linked policy
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {item.policyNumber || "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Current status
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {displayStatus(
                                      item.status || "Unavailable",
                                    )}
                                  </p>
                                </div>
                              </div>

                              <h4 className="mb-5 text-sm font-bold text-slate-900">
                                Claim progress
                              </h4>

                              <Timeline>
                                <TimelineEvent
                                  title="Claim recorded"
                                  time={date}
                                  complete
                                >
                                  Your claim appears in the account records.
                                </TimelineEvent>

                                <TimelineEvent
                                  title="Review and assessment"
                                  time={
                                    isResolved
                                      ? "Resolved"
                                      : isReviewing
                                        ? "Current status"
                                        : "Status unavailable"
                                  }
                                  complete={isResolved}
                                  active={!isResolved && isReviewing}
                                >
                                  The recorded claim status is{" "}
                                  <span className="font-semibold text-slate-700">
                                    {displayStatus(
                                      item.status || "Unavailable",
                                    )}
                                  </span>
                                  . Contact QIB for clarification if you need an
                                  update.
                                </TimelineEvent>

                                <TimelineEvent
                                  title={
                                    isRejected ? "Claim rejected" : "Resolution"
                                  }
                                  time={
                                    isApproved
                                      ? "Completed"
                                      : isRejected
                                        ? "Decision recorded"
                                        : "Awaiting update"
                                  }
                                  complete={isResolved}
                                  active={!isResolved}
                                  last
                                >
                                  {isApproved
                                    ? "The claim is marked as resolved in the available records."
                                    : isRejected
                                      ? "The claim is marked as rejected in the available records. Contact QIB if you need further information."
                                      : "A final decision is not reflected in the current claim status."}
                                </TimelineEvent>
                              </Timeline>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="inline-flex items-center gap-2">
            <LockKeyhole size={14} className="shrink-0 text-[#0096c7]" />
            Your account information is shown from the records currently
            available to QIB.
          </span>
          <button
            type="button"
            onClick={() => router.push("/contact")}
            className="inline-flex items-center gap-1 self-start font-semibold text-[#0085b3] hover:underline sm:self-auto"
          >
            Insurance support
            <ArrowRight size={14} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
