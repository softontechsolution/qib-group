"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, DollarSign, Clock, CheckCircle } from "lucide-react";

interface CommissionRecord {
  id: number;
  attributes: {
    agentId: string;
    amount: number;
    policyNumber: string;
    payoutStatus: "pending" | "settled";
    createdAt: string;
  };
}

export function AgentCommissionsSection({ agentId }: { agentId: string }) {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
        const response = await fetch(
          `${strapiUrl}/api/commissions?filters[agentId][$eq]=${agentId}&sort=createdAt:desc`
        );

        if (!response.ok) throw new Error("Failed to fetch commission ledger.");
        const json = await response.json();
        setCommissions(json.data || []);
      } catch (err: any) {
        setError(err.message || "An unexpected network error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (agentId) fetchCommissions();
  }, [agentId]);

  const balances = useMemo(() => {
    return commissions.reduce(
      (acc, item) => {
        const amount = item.attributes.amount || 0;
        if (item.attributes.payoutStatus === "settled") {
          acc.settled += amount;
        } else {
          acc.pending += amount;
        }
        return acc;
      },
      { pending: 0, settled: 0 }
    );
  }, [commissions]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val);
  };

  if (loading) {
    return (
      <div className="flex p-8 items-center justify-center gap-2 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm mt-6">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        <span className="text-sm">Updating earnings balance...</span>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Agent Earnings Terminal</h2>
        <p className="text-xs text-slate-500">Real-time performance metrics and policy sale commission tracking.</p>
      </div>

      {error && <div className="mb-4 text-xs text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">⚠️ {error}</div>}

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Payout</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(balances.pending)}</div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Settled</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(balances.settled)}</div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Lifetime Gross</span>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-1 text-xl font-bold text-white">{formatCurrency(balances.pending + balances.settled)}</div>
        </div>
      </div>

      {/* Mini Ledger */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden text-sm">
        <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-wider">
          Recent Commission History
        </div>
        {commissions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No policy sales attributed to your Agent ID yet.</div>
        ) : (
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {commissions.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div>
                  <div className="font-medium text-slate-900">{item.attributes.policyNumber}</div>
                  <div className="text-xs text-slate-400">{new Date(item.attributes.createdAt).toLocaleDateString("en-GB")}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">{formatCurrency(item.attributes.amount)}</span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide border ${
                    item.attributes.payoutStatus === "settled" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    {item.attributes.payoutStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}