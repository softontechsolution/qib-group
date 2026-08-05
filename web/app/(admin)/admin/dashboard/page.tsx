"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  ShieldAlert,
  MailWarning,
  RefreshCw,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
} from "lucide-react";
import { fetchAdminDashboardData } from "@/services/adminService";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live stats and registrations data from Strapi when component mounts
  useEffect(() => {
    async function loadData() {
      const data = await fetchAdminDashboardData();
      if (data) {
        if (data.stats) setStats(data.stats);
        if (data.registrations) setRegistrations(data.registrations);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 font-mono text-sm">
        Loading live system analytics and records from Strapi CMS...
      </div>
    );
  }

  // Slice to show only the 5 most recent registrations on the dashboard overview
  const recentRegistrations = registrations.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          System Control Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Live operational telemetry and recent activities connected directly to
          Strapi CMS database.
        </p>
      </div>

      {/* KPI Cards Grid powered by real database values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Policies"
          value={stats?.activePolicies || 0}
          subtitle={`${stats?.expiringSoon || 0} expiring in 30 days`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Revenue"
          value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`}
          subtitle={`${stats?.totalRegistrations || 0} total registrations`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Failed Email Dispatches"
          value={`${stats?.failedEmails || 0} Failed`}
          subtitle="Requires retry action"
          icon={MailWarning}
          color="rose"
        />
        <StatCard
          title="Failed NPF Syncs"
          value={`${stats?.failedNpfSyncs || 0} Failed`}
          subtitle="Requires API resync"
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-2">
            Live Integration Queues
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Review error logs and trigger instant background retries via Redis
            workers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/logs/emails"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg border border-slate-700 text-slate-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Review Email Queue ({stats?.failedEmails || 0} errors)
            </Link>
            <Link
              href="/admin/logs/npf"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg border border-slate-700 text-slate-200 transition-colors flex items-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Review NPF Sync Queue ({stats?.failedNpfSyncs || 0} errors)
            </Link>
          </div>
        </div>
      </div>

      {/* Live Recent Registrations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">
              Recent Motor Insurance Registrations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live feed pulled directly from the Strapi database
            </p>
          </div>
          <Link
            href="/admin/customers"
            className="text-xs font-medium text-emerald-400 hover:underline"
          >
            View All Customers &rarr;
          </Link>
        </div>

        {recentRegistrations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            No registration records found in Strapi database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Policy Number</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Insurer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentRegistrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-emerald-400 font-semibold">
                      {reg.policyNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">
                        {reg.customerName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {reg.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      {reg.insurer}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-200">
                      ₦{Number(reg.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium uppercase ${
                          reg.paymentStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-300 uppercase">
                        {reg.policyStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colorMap: any = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
    </div>
  );
}
