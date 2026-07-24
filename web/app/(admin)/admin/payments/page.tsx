'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  DollarSign, 
  ExternalLink 
} from 'lucide-react';

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Mock Paystack transactions linked to motor insurance registrations
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-88210948',
      reference: 'paystack_ref_9928310492',
      customerName: 'Amina Bello',
      policyNumber: 'POL-2026-8801',
      amount: 15000,
      currency: 'NGN',
      status: 'success',
      gatewayResponse: 'Approved',
      paidAt: '2026-07-20 14:22:10',
    },
    {
      id: 'TXN-77419203',
      reference: 'paystack_ref_1182934810',
      customerName: 'Chidi Okonkwo',
      policyNumber: 'POL-2026-7742',
      amount: 120000,
      currency: 'NGN',
      status: 'success',
      gatewayResponse: 'Approved',
      paidAt: '2025-08-10 09:15:40',
    },
    {
      id: 'TXN-66129482',
      reference: 'paystack_ref_5548190234',
      customerName: 'Emeka Obi',
      policyNumber: 'POL-2026-5510',
      amount: 25000,
      currency: 'NGN',
      status: 'abandoned',
      gatewayResponse: 'User closed popup window',
      paidAt: '—',
    },
  ]);

  // Function: Manually verify payment status against Paystack API
  const handleVerifyPayment = async (reference: string) => {
    setVerifyingId(reference);
    try {
      // In production, this calls your backend endpoint: GET /api/payments/verify/:reference
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated network delay

      // Update local state to show verified success
      setTransactions((prev) =>
        prev.map((txn) =>
          txn.reference === reference
            ? { ...txn, status: 'success', gatewayResponse: 'Manually Verified via Paystack' }
            : txn
        )
      );
    } catch (err) {
      console.error('Payment verification failed:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  // Filter logic based on search and status tabs
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = 
      txn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && txn.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments & Paystack Gateway</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor real-time premium transactions, webhook events, and verify payment statuses.
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
          <span className="text-xs font-mono text-slate-400">TOTAL REVENUE COLLECTED</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₦160,000</div>
          <span className="text-[11px] text-slate-500 mt-1 block">From successful policy transactions</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">SUCCESSFUL PAYMENTS</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">2 Transactions</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">100% Webhook delivery rate</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">PENDING / ABANDONED</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">1 Transaction</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting user action</span>
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
          {['ALL', 'success', 'abandoned'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-mono uppercase transition-colors border ${
                statusFilter === status 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
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
                <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-emerald-400 text-xs font-medium">{txn.id}</div>
                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-[160px]" title={txn.reference}>
                      {txn.reference}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{txn.customerName}</div>
                    <div className="text-xs font-mono text-slate-400">{txn.policyNumber}</div>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                    ₦{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <PaymentStatusBadge status={txn.status} />
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    {txn.gatewayResponse}
                    <div className="text-[10px] text-slate-500">{txn.paidAt}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {txn.status !== 'success' && (
                      <button
                        onClick={() => handleVerifyPayment(txn.reference)}
                        disabled={verifyingId === txn.reference}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${verifyingId === txn.reference ? 'animate-spin' : ''}`} />
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
        <CheckCircle2 className="w-3.5 h-3.5" /> Success
      </span>
    );
  }
  if (status === 'abandoned' || status === 'failed') {
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