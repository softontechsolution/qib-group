'use client';

import React, { useEffect, useState } from 'react';
import { MailWarning, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { fetchAdminDashboardData, retryEmailDispatch } from '@/services/adminService';

export default function EmailLogsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<any>(null);
  const [message, setMessage] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchAdminDashboardData();
    if (data && data.registrations) {
      // Filter only records that have an email error log
      const failedEmails = data.registrations.filter((r: any) => r.emailErrorLog);
      setRegistrations(failedEmails);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleRetry = async (id: any) => {
    setRetryingId(id);
    setMessage('');
    try {
      const res = await retryEmailDispatch(id);
      setMessage(res.message || 'Email re-queued successfully.');
      await loadLogs(); // Refresh list
    } catch (err) {
      setMessage('Failed to retry email dispatch.');
    } finally {
      setRetryingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-400 font-mono text-sm">Loading email error logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-emerald-400 flex items-center gap-1 mb-2 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Email Dispatch Failure Logs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review policy certificates or notifications that failed to deliver and re-queue them.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg font-mono">
          {message}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {registrations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            No email delivery errors found. All dispatches successful!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Policy / Reg ID</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Error Details</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="text-emerald-400 font-semibold">{reg.policyNumber}</div>
                      <div className="text-slate-500">ID: {reg.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{reg.customerName}</div>
                      <div className="text-xs text-slate-400">{reg.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-rose-400 max-w-xs truncate" title={reg.emailErrorLog}>
                      {reg.emailErrorLog || 'Unknown email error'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRetry(reg.id)}
                        disabled={retryingId === reg.id}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${retryingId === reg.id ? 'animate-spin' : ''}`} />
                        Retry Email
                      </button>
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