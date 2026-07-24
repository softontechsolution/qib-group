'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function EmailLogsPage() {
  const [retryingId, setRetryingId] = useState<number | null>(null);

  // Mock initial logs data (Will connect to Strapi API)
  const [logs, setLogs] = useState([
    {
      id: 101,
      recipient: 'agent.joshua@qibgroup.com',
      subject: 'Action Required: Confirm your QIB Agent Account',
      status: 'failed',
      attempts: 3,
      error: 'SMTP Connection Timeout (Port 587)',
      timestamp: '2026-07-24 12:45:10',
    },
    {
      id: 102,
      recipient: 'policy.holder@gmail.com',
      subject: 'Policy Renewal Reminder - POL-9921',
      status: 'success',
      attempts: 1,
      error: null,
      timestamp: '2026-07-24 11:20:00',
    },
  ]);

  const handleRetry = async (logId: number) => {
    setRetryingId(logId);
    try {
      // Call Strapi Custom Admin Retry Controller
      const res = await fetch(`/api/admin/retry-email/${logId}`, { method: 'POST' });
      
      // Update local UI status on trigger
      setLogs((prev) =>
        prev.map((item) =>
          item.id === logId ? { ...item, status: 'pending', attempts: item.attempts + 1 } : item
        )
      );
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Dispatch Logs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor email delivery state and manually re-queue failed messages.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Recipient & Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attempts</th>
                <th className="px-6 py-4">Error Stack</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{log.recipient}</div>
                    <div className="text-xs text-slate-400">{log.subject}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{log.attempts}</td>
                  <td className="px-6 py-4 text-xs font-mono text-rose-400 max-w-xs truncate">
                    {log.error || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.status === 'failed' && (
                      <button
                        onClick={() => handleRetry(log.id)}
                        disabled={retryingId === log.id}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${retryingId === log.id ? 'animate-spin' : ''}`} />
                        Retry
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

function StatusBadge({ status }: { status: string }) {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle className="w-3.5 h-3.5" /> Delivered
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <XCircle className="w-3.5 h-3.5" /> Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <Clock className="w-3.5 h-3.5 animate-pulse" /> Re-queued
    </span>
  );
}