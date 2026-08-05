// web/app/(admin)/admin/payments/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import {
  fetchAdminPayments,
  verifyAdminPayment,
} from "@/services/adminService";

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    successCount: 0,
    pendingCount: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminPayments();
    if (data && data.success) {
      setMetrics(data.metrics);
      setTransactions(data.transactions);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Function: Manually verify payment status against Strapi & Paystack gateway
  const handleVerifyPayment = async (reference: string) => {
    setVerifyingId(reference);
    const res = await verifyAdminPayment(reference);
    if (res && res.success) {
      await loadData(); // Reload fresh database telemetry
    }
    setVerifyingId(null);
  };

  // Filter logic based on search and status tabs
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;
    return (
      matchesSearch && txn.status.toLowerCase() === statusFilter.toLowerCase()
    );
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 font-mono text-sm">
        Loading live payment records and Paystack telemetry from Strapi...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payments & Paystack Gateway
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor real-time premium transactions, webhook events, and verify
            payment statuses.
          </p>
        </div>
        <a
          href="https://dashboard.paystack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg border border-slate-700 text-slate-200 flex items-center gap-2 self-start transition-colors"
        >
          Open Paystack Dashboard <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Financial Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">
            TOTAL REVENUE COLLECTED
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ₦{metrics.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            From successful policy transactions
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">
            SUCCESSFUL PAYMENTS
          </span>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {metrics.successCount} Transactions
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Live database records
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">
            PENDING / ABANDONED
          </span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {metrics.pendingCount} Transactions
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Awaiting payment action
          </span>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by customer name, reference, or policy number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "success", "abandoned"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-mono uppercase transition-colors border ${
                statusFilter === status
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <CreditCard className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            No payment transactions found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Transaction & Reference</th>
                  <th className="px-6 py-4">Customer & Policy</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Gateway Response</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-emerald-400 text-xs font-medium">
                        {txn.id}
                      </div>
                      <div
                        className="text-[11px] font-mono text-slate-500 truncate max-w-[160px]"
                        title={txn.reference}
                      >
                        {txn.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">
                        {txn.customerName}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        {txn.policyNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                      ₦{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <PaymentStatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {txn.gatewayResponse}
                      <div className="text-[10px] text-slate-500">
                        {txn.paidAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {txn.status !== "success" && (
                        <button
                          onClick={() => handleVerifyPayment(txn.reference)}
                          disabled={verifyingId === txn.reference}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${verifyingId === txn.reference ? "animate-spin" : ""}`}
                          />
                          Verify
                        </button>
                      )}
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

function PaymentStatusBadge({ status }: { status: string }) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
        <CheckCircle2 className="w-3.5 h-3.5" /> Success
      </span>
    );
  }
  if (status === "abandoned" || status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
        <XCircle className="w-3.5 h-3.5" /> {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
      <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending
    </span>
  );
}
