// web/app/(admin)/admin/customers/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Users, MoreVertical, CheckCircle2, ShieldAlert } from "lucide-react";
import { fetchAdminCustomers } from "@/services/adminService";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchAdminCustomers();
      if (data && data.customers) {
        setCustomers(data.customers);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 font-mono text-sm">
        Loading customer registry from Strapi CMS database...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Customer Management & Registrations
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          View live customer registrations, inspect policy ownership, and
          monitor account statuses.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            No customer registration records found in the database.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Registered On</th>
                <th className="px-6 py-4">Active Policies</th>
                <th className="px-6 py-4">Total Premium</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    <div>{c.email}</div>
                    <div className="text-slate-500">{c.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    {c.registeredAt}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono">
                      {c.activePolicies} Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-300">
                    {c.totalSpent}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium uppercase ${
                        c.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
