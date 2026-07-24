'use client';

import React from 'react';
import { Building2, Plus, CheckCircle, Shield } from 'lucide-react';

export default function InsurersPage() {
  const insurers = [
    { name: 'Leadway Assurance', code: 'LAD-NG', activeProducts: 4, commissionRate: '12.5%', status: 'Active' },
    { name: 'AIICO Insurance', code: 'AIICO-NG', activeProducts: 6, commissionRate: '10.0%', status: 'Active' },
    { name: 'Cornerstone Insurance', code: 'CST-NG', activeProducts: 3, commissionRate: '15.0%', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partner Insurers & Underwriters</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage partner insurance underwriters, product tariffs, and agreement commission rates.
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Insurer Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insurers.map((i) => (
          <div key={i.code} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-emerald-400">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono">
                {i.status}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">{i.name}</h3>
              <p className="text-xs font-mono text-slate-500">CODE: {i.code}</p>
            </div>
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">PRODUCTS</span>
                <span className="text-slate-200 font-semibold">{i.activeProducts} Policy Types</span>
              </div>
              <div>
                <span className="text-slate-500 block">COMMISSION</span>
                <span className="text-amber-400 font-semibold">{i.commissionRate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}