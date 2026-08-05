// web/app/(admin)/admin/agents/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  UserCheck,
  DollarSign,
  Award,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { fetchAdminAgents } from "@/services/adminService";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchAdminAgents();
      if (data) {
        if (data.agents) setAgents(data.agents);
        if (data.stats) setStats(data.stats);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 font-mono text-sm">
        Loading agent network telemetry from Strapi CMS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Agent Network & Commissions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track live agent registration, sales performance, and approve
            commission payouts.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid powered by real database computations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">
            TOTAL AGENT COMMISSIONS ACCRUED
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ₦{(stats?.totalAccrued || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">
            PENDING PAYOUT APPROVALS
          </span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            ₦{(stats?.pendingPayouts || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">
            ACTIVE REGISTERED AGENTS
          </span>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {stats?.activeAgentsCount || 0} Agents
          </div>
        </div>
      </div>

      {/* Live Agents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <UserCheck className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            No agent records or sales volumes found in the database.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Agent ID & Name</th>
                <th className="px-6 py-4">Total Sales Volume</th>
                <th className="px-6 py-4">Commission Balance</th>
                <th className="px-6 py-4">Total Paid Out</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {agents.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-emerald-400 text-xs">
                      {a.id}
                    </div>
                    <div className="font-medium text-slate-200">{a.name}</div>
                    <div className="text-xs text-slate-500">{a.email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-300">
                    {a.totalSales}
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-amber-400">
                    ₦{a.unpaidCommission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">
                    ₦{a.totalPaidOut.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono transition-colors">
                      Approve Payout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
