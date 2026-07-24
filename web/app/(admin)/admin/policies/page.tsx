'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Edit3, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Send,
  Building,
  DollarSign
} from 'lucide-react';

// Processing Stages pipeline definition
const PROCESSING_STAGES = [
  { key: 'DOCUMENT_VERIFICATION', label: '1. Doc Verification' },
  { key: 'NPF_PORTAL_SYNC', label: '2. NPF Clearance' },
  { key: 'UNDERWRITER_APPROVAL', label: '3. Insurer Approval' },
  { key: 'POLICY_ISSUED', label: '4. Certificate Issued' },
];

export default function PolicyManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock policy dataset matching your backend
  const [policies, setPolicies] = useState([
    {
      id: 'POL-2026-8801',
      customerName: 'Amina Bello',
      customerEmail: 'amina.bello@example.com',
      agentName: 'Joshua Emmanuel (AG-042)',
      insurer: 'Leadway Assurance',
      type: 'Third-Party Motor',
      premium: 15000,
      agentCommission: 1500, // 10%
      paymentStatus: 'PAID',
      processingStage: 'NPF_PORTAL_SYNC',
      npfStatus: 'PENDING',
      startDate: '2026-07-20',
      expiryDate: '2027-07-19',
      daysToExpiry: 360,
    },
    {
      id: 'POL-2026-7742',
      customerName: 'Chidi Okonkwo',
      customerEmail: 'chidi.o@example.com',
      agentName: 'Direct Registration',
      insurer: 'AIICO Insurance',
      type: 'Comprehensive Auto',
      premium: 120000,
      agentCommission: 0,
      paymentStatus: 'PAID',
      processingStage: 'POLICY_ISSUED',
      npfStatus: 'VERIFIED',
      startDate: '2025-08-10',
      expiryDate: '2026-08-09',
      daysToExpiry: 16, // Expiring soon!
    }
  ]);

  const handleStageAdvance = (policyId: string, nextStage: string) => {
    setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, processingStage: nextStage } : p));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Policy Records & Stage Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor policy lifecycle, edit parameters, update underwriters, and trigger renewal reminders.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Policy ID, Customer, Agent or Insurer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" /> Filter Stage
        </button>
      </div>

      {/* Policy Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Policy & Customer</th>
                <th className="px-6 py-4">Insurer & Premium</th>
                <th className="px-6 py-4">Processing Stage</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Expiry Window</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-emerald-400 font-medium text-xs">{p.id}</div>
                    <div className="font-medium text-slate-200">{p.customerName}</div>
                    <div className="text-xs text-slate-500">{p.agentName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300 font-medium">{p.insurer}</div>
                    <div className="text-xs text-slate-400 font-mono">₦{p.premium.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StageBadge stage={p.processingStage} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono">{p.expiryDate}</div>
                    {p.daysToExpiry <= 30 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                        <Clock className="w-3 h-3" /> Expiring in {p.daysToExpiry}d
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Active ({p.daysToExpiry}d left)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => { setSelectedPolicy(p); setIsEditModalOpen(true); }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 inline-flex items-center text-xs gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Policy Record Modal */}
      {isEditModalOpen && selectedPolicy && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Update Policy Record: {selectedPolicy.id}</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-slate-400 font-mono">Underwriting Insurer</label>
                <select className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200">
                  <option value="Leadway Assurance">Leadway Assurance</option>
                  <option value="AIICO Insurance">AIICO Insurance</option>
                  <option value="Cornerstone Insurance">Cornerstone Insurance</option>
                  <option value="Custodian Investment">Custodian Investment</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">Current Processing Stage</label>
                <select 
                  value={selectedPolicy.processingStage}
                  onChange={(e) => setSelectedPolicy({...selectedPolicy, processingStage: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  {PROCESSING_STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">Policy Expiry Date</label>
                <input 
                  type="date" 
                  value={selectedPolicy.expiryDate} 
                  onChange={(e) => setSelectedPolicy({...selectedPolicy, expiryDate: e.target.value})}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setPolicies(prev => prev.map(item => item.id === selectedPolicy.id ? selectedPolicy : item));
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-slate-950 rounded-lg"
              >
                Save Record Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const map: any = {
    DOCUMENT_VERIFICATION: { label: 'Doc Verification', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    NPF_PORTAL_SYNC: { label: 'NPF Sync', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    UNDERWRITER_APPROVAL: { label: 'Underwriter Review', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    POLICY_ISSUED: { label: 'Certificate Issued', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };
  const config = map[stage] || { label: stage, color: 'bg-slate-800 text-slate-400' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${config.color}`}>
      {config.label}
    </span>
  );
}