'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  CreditCard,
  FileText,
  Activity,
  Mail, 
  FileCheck2, 
  BellRing, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

// Updated Navigation Hubs for frontend/app/(admin)/layout.tsx
const navItems = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Customers & Registrations', href: '/admin/customers', icon: Users },
  { name: 'Agents & Commissions', href: '/admin/agents', icon: UserCheck },
  { name: 'Policies & Stages', href: '/admin/policies', icon: ShieldCheck },
  { name: 'Insurers', href: '/admin/insurers', icon: Building2 },
  { name: 'Payments & Paystack', href: '/admin/payments', icon: CreditCard },
  { name: 'Website Content', href: '/admin/content', icon: FileText },
  { name: 'System Logs & Queues', href: '/admin/logs/emails', icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-200 ease-in-out flex flex-col justify-between
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <span className="font-extrabold text-xl tracking-wider text-emerald-400">
              QIB GROUP <span className="text-xs text-slate-400 font-normal">ADMIN</span>
            </span>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-rose-400 text-sm font-medium transition-colors rounded-lg hover:bg-rose-500/10">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-slate-300" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Live Queue Monitoring
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}