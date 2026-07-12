"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUserPolicies, getUserClaims } from "@/services/strapi";

// =====================================================
// LOCAL UI COMPONENTS: TIMELINE PIPELINE
// =====================================================
interface TimelineProps {
  children: React.ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return (
    <div className="relative border-l-2 border-gray-200 ml-2.5 pl-6 space-y-8 my-4">
      {children}
    </div>
  );
}

interface TimelineEventProps {
  title: string;
  time: string;
  children: React.ReactNode;
}

export function TimelineEvent({ title, time, children }: TimelineEventProps) {
  const isActive = time === "In Progress";

  return (
    <div className="relative">
      {/* Timeline Bullet Ring */}
      <span className={`absolute -left-[32px] top-0.5 rounded-full h-4 w-4 border-2 bg-white flex items-center justify-center transition-all ${
        isActive 
          ? 'border-[#0096c7] ring-4 ring-sky-50' 
          : 'border-gray-300'
      }`}>
        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#0096c7] animate-pulse" />}
      </span>

      {/* Event Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h6 className={`text-sm font-bold transition-colors ${isActive ? 'text-[#0096c7]' : 'text-gray-900'}`}>
          {title}
        </h6>
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border inline-block w-fit ${
          isActive 
            ? 'bg-sky-50 text-[#0096c7] border-sky-200' 
            : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}>
          {time}
        </span>
      </div>

      {/* Description Content */}
      <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
        {children}
      </p>
    </div>
  );
}

export default function UserVaultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "policies" | "claims">("overview");
  const [policies, setPolicies] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. SAFE USER CONTEXT EXTRACTOR (NextAuth token normalization)
  const currentUser = session?.user ? {
    id: (session as any).id || (session?.user as any).id,
    email: session.user.email || "",
    fullName: session.user.name || "Valued Policyholder"
  } : null;

  // 2. AUTH SECURITY GATE ROUTINE
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 3. ASYNC DATA FETCH ROUTINE (Triggers when user verification resolves)
  useEffect(() => {
    async function fetchVaultContent() {
      if (!currentUser?.id) return;
      
      try {
        setIsLoadingData(true);
        const [policiesData, claimsData] = await Promise.all([
          getUserPolicies(currentUser.id).catch(() => []),
          getUserClaims(currentUser.id).catch(() => [])
        ]);
        
        // Populate state with raw data array if it contains items
        setPolicies(policiesData || []);
        setClaims(claimsData || []);
      } catch (err) {
        console.error("Vault background fetch error:", err);
      } finally {
        setIsLoadingData(false);
      }
    }

    if (status === "authenticated") {
      fetchVaultContent();
    }
  }, [status, session]);

  // 4. BLOCK LAYOUT FLASHING DURING SESSION CHECKING
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
        <div className="text-center font-semibold text-gray-500 animate-pulse">
          Verifying security keys...
        </div>
      </div>
    );
  }

  // Fallback view if user context evaluates to empty
  if (!currentUser) {
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* VAULT TOP BANNER */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0096c7]">Secure Account Vault</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Welcome back, {currentUser.fullName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your policies, track claims, and access premium insurance assets.</p>
          </div>
          <button 
            onClick={() => router.push("/lodge-claim")}
            className="inline-flex justify-center items-center px-5 py-3 bg-[#0096c7] hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-sky-50 text-center"
          >
            ➕ Lodge New Claim
          </button>
        </div>

        {/* VAULT CONTROL TABS */}
        <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto">
          {(["overview", "policies", "claims"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-bold capitalize border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-[#0096c7] text-[#0096c7]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' ? 'Account Dashboard' : tab === 'policies' ? 'My Cover Policies' : 'Track Claims'}
            </button>
          ))}
        </div>

        {/* CONTENT REGION CONTAINER */}
        {isLoadingData ? (
          <div className="py-20 text-center text-gray-500 font-medium animate-pulse">
            Syncing database indices with Strapi...
          </div>
        ) : (
          <div>
            {/* TAB CONTENT: ACCOUNT DASHBOARD OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* METRIC GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Active Policies</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{policies.length}</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Incidents</p>
                    <p className="text-3xl font-black text-[#0096c7] mt-2">
                      {claims.filter(c => {
                        const status = c.attributes?.status || c.status;
                        return status !== 'approved' && status !== 'rejected';
                      }).length}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Status</p>
                    <div className="inline-flex items-center gap-1.5 mt-3 bg-green-50 text-green-700 font-bold px-3 py-1 rounded-full text-xs border border-green-200">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Verified Holder
                    </div>
                  </div>
                </div>

                {/* QUICK ACCESS ACTION SHEET */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-base mb-4">Other Actions & Tasks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left">
                      <p className="font-bold text-sm text-gray-900">🔄 Renew Existing Policy</p>
                      <p className="text-xs text-gray-500 mt-1">Quick-pay upcoming premiums or extend current protection windows.</p>
                    </button>
                    <button className="p-4 border border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left">
                      <p className="font-bold text-sm text-gray-900">📄 Download Account Statement</p>
                      <p className="text-xs text-gray-500 mt-1">Export comprehensive transactional receipts and coverage logs as PDF.</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: POLICIES GRID */}
            {activeTab === "policies" && (
              <div>
                {policies.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">
                    No active cover policies found under this profile identity.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {policies.map((p) => {
                      // Supports both Strapi v4 response (.attributes) and Strapi v5 flat objects
                      const item = p.attributes || p;
                      return (
                        <div key={p.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#0096c7]" />
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Policy Reference</span>
                              <h4 className="text-lg font-black text-gray-900">{item.policyNumber || "N/A"}</h4>
                            </div>
                            <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 border border-green-200 rounded-md uppercase">
                              {item.policyStatus || "active"}
                            </span>
                          </div>

                          <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Coverage Class:</span> <span className="font-bold">{item.classOfInsurance || item.coverType || "Motor Insurance"}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Asset Detail:</span> <span className="font-medium text-gray-900">{item.vehicleMake} {item.vehicleModel}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Premium Cost:</span> <span className="font-bold text-gray-900">₦{item.premium?.toLocaleString() || "Market Value"}</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: CLAIMS STATUS TIMELINE */}
            {activeTab === "claims" && (
              <div>
                {claims.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">
                    No ongoing or past incident claims filed by this account.
                  </div>
                ) : (
                  <div className="space-y-8">
                    {claims.map((c) => {
                      const item = c.attributes || c;
                      const claimDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent";
                      
                      return (
                        <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-2">
                            <div>
                              <span className="text-xs text-gray-400 font-medium">Claim Code Ref: #{c.id}</span>
                              <h4 className="font-bold text-gray-900 text-base">Cover Category: {item.coverType || "Motor Claim"}</h4>
                            </div>
                            <div className="text-xs sm:text-right">
                              <p className="text-gray-400">Linked Policy: <span className="font-bold text-gray-700">{item.policyNumber || "Verified Holder"}</span></p>
                              <p className="text-gray-400 mt-0.5">Lodged On: {claimDate}</p>
                            </div>
                          </div>

                          <h5 className="text-sm font-bold text-gray-900 mb-4">Live Verification Status</h5>
                          
                          <Timeline>
                            <TimelineEvent title="Claim Filed Successfully" time={claimDate}>
                              Document uploads packaged and indexed securely inside backend database environments.
                            </TimelineEvent>
                            <TimelineEvent 
                              title="Desk Auditing & Assessment" 
                              time={item.status === "pending" || item.status === "reviewing" ? "In Progress" : "Completed"}
                            >
                              Claims adjusters are actively reviewing supporting damage scene documentation, identity fields, and policy validation tags.
                            </TimelineEvent>
                            <TimelineEvent 
                              title="Settlement Authorization" 
                              time={item.status === "approved" || item.status === "rejected" ? "Completed" : "Pending Review"}
                            >
                              Resolution state: <span className="capitalize font-semibold text-[#0096c7]">{item.status || "Processing"}</span>. Verification signing workflow or check dispatch tracking.
                            </TimelineEvent>
                          </Timeline>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}