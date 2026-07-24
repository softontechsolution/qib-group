'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, Phone, MoreVertical, Trash2, Edit } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Amina Bello',
      email: 'amina.bello@example.com',
      phone: '+234 803 123 4567',
      registeredAt: '2026-07-20',
      activePolicies: 2,
      totalSpent: '₦135,000',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Chidi Okonkwo',
      email: 'chidi.o@example.com',
      phone: '+234 802 987 6543',
      registeredAt: '2026-06-14',
      activePolicies: 1,
      totalSpent: '₦120,000',
      status: 'Active',
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Management & Registrations</h1>
          <p className="text-slate-400 text-sm mt-1">
            View customer registrations, inspect policy ownership, and manage account privileges.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Registered On</th>
              <th className="px-6 py-4">Active Policies</th>
              <th className="px-6 py-4">Total Premium</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40">
                <td className="px-6 py-4 font-medium text-slate-200">{c.name}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                  <div>{c.email}</div>
                  <div className="text-slate-500">{c.phone}</div>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-400">{c.registeredAt}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono">
                    {c.activePolicies} Active
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-300">{c.totalSpent}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-200 p-1">
                    <MoreVertical className="w-4 h-4" />
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