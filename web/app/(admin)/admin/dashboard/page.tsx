'use client';

import React from 'react';
import { 
  Users, 
  ShieldAlert, 
  MailWarning, 
  RefreshCw, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Control Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor system integrations, dispatch health, and policy lifecycles.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Policies"
          value="1,428"
          subtitle="42 Expiring in 30 days"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Expiring Reminders"
          value="12 Pending"
          subtitle="Scheduled via Cron"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Failed Email Dispatches"
          value="5 Failed"
          subtitle="Requires retry"
          icon={MailWarning}
          color="rose"
        />
        <StatCard
          title="Failed NPF Syncs"
          value="2 Failed"
          subtitle="Requires API resync"
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* Health Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Failed Dispatches Requiring Action</h2>
            <span className="text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded">
              Attention Needed
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Background workers have encountered retriable errors for email delivery or NPF portal registration.
          </p>
          <div className="flex gap-3">
            <a 
              href="/admin/logs/emails" 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Review Email Queue
            </a>
            <a 
              href="/admin/logs/npf" 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Review NPF Queue
            </a>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-2">Automated Policy Expiry Engine</h2>
          <p className="text-sm text-slate-400 mb-6">
            Daily cron queries active policies expiring in less than 30 days and queues renewal notifications automatically.
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <div className="text-emerald-400">✓ Next Run: Today at 08:00 AM WAT</div>
            <div className="text-slate-500">Targeting: status = 'active' AND expirationDate &lt;= +30d</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colorMap: any = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
    </div>
  );
}