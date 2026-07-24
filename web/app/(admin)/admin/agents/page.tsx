'use client';

import React from 'react';
import { UserCheck, DollarSign, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function AgentsPage() {
  const agents = [
    {
      id: 'AG-042',
      name: 'Joshua Emmanuel',
      email: 'softontechonline@gmail.com',
      totalSales: '₦1,450,000',
      commissionRate: '10%',
      unpaidCommission: 45000,
      totalPaidOut: 100000,
      status: 'Active',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Network & Commissions</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track agent registration, sales performance, and approve commission payouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">TOTAL AGENT COMMISSIONS ACCRUED</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₦145,000</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">PENDING PAYOUT APPROVALS</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">₦45,000</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">ACTIVE REGISTERED AGENTS</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">14 Agents</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
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
              <tr key={a.id} className="hover:bg-slate-800/40">
                <td className="px-6 py-4">
                  <div className="font-mono text-emerald-400 text-xs">{a.id}</div>
                  <div className="font-medium text-slate-200">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.email}</div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-300">{a.totalSales}</td>
                <td className="px-6 py-4 font-mono font-semibold text-amber-400">
                  ₦{a.unpaidCommission.toLocaleString()}
                </td>
                <td className="px-6 py-4 font-mono text-slate-400">
                  ₦{a.totalPaidOut.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono">
                    Approve Payout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}