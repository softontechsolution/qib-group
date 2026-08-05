'use client';

import React from 'react';
import { ExternalLink, Layers, Layout, Globe } from 'lucide-react';

export default function ContentManagementPage() {
  const cmsUrl = process.env.NEXT_PUBLIC_STRAPI_ADMIN_URL || 'http://localhost:1337/admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Website Content & Landing Pages</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage dynamic website content, FAQs, promotional banners, and policy terms directly via Strapi Headless CMS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Strapi Headless CMS Panel</h3>
              <p className="text-xs text-slate-400">Edit homepage text, blog articles, and FAQs</p>
            </div>
          </div>
          <a 
            href={cmsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Launch Strapi Content Studio <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Live Website Preview</h3>
              <p className="text-xs text-slate-400">Preview published changes on the Next.js frontend</p>
            </div>
          </div>
          <a 
            href="/"
            target="_blank"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            Open Live Portal <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}