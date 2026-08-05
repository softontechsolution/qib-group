// web/app/(admin)/admin/insurers/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Building2, Plus, Edit3, X } from "lucide-react";
import {
  fetchAdminInsurers,
  uploadMediaToStrapi,
  createAdminInsurer,
  updateAdminInsurer,
} from "@/services/adminService";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function InsurersPage() {
  const [insurers, setInsurers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Create form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState<number>(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Edit form state
  const [selectedInsurer, setSelectedInsurer] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editPriority, setEditPriority] = useState<number>(0);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminInsurers();
    if (data && data.insurers) {
      setInsurers(data.insurers);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInsurer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSubmitting(true);

    let logoMediaId = null;
    if (logoFile) {
      logoMediaId = await uploadMediaToStrapi(logoFile);
    }

    const res = await createAdminInsurer({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      isActive,
      priority: Number(priority),
      logo: logoMediaId,
    });

    if (res && res.success) {
      setName("");
      setSlug("");
      setIsActive(true);
      setPriority(0);
      setLogoFile(null);
      setIsCreateModalOpen(false);
      await loadData();
    }
    setSubmitting(false);
  };

  const handleOpenEditModal = (insurer: any) => {
    setSelectedInsurer(insurer);
    setEditName(insurer.name);
    setEditSlug(insurer.code.toLowerCase());
    setEditIsActive(insurer.isActive);
    setEditPriority(insurer.priority);
    setEditLogoFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateInsurer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInsurer || !editName) return;
    setSubmitting(true);

    let logoMediaId = undefined;
    if (editLogoFile) {
      logoMediaId = await uploadMediaToStrapi(editLogoFile);
    }

    const res = await updateAdminInsurer(selectedInsurer.id, {
      name: editName,
      slug: editSlug,
      isActive: editIsActive,
      priority: Number(editPriority),
      ...(logoMediaId !== undefined ? { logo: logoMediaId } : {}),
    });

    if (res && res.success) {
      setIsEditModalOpen(false);
      setSelectedInsurer(null);
      setEditLogoFile(null);
      await loadData();
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 font-mono text-sm">
        Loading partner insurers and underwriters from Strapi database...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Partner Insurers & Underwriters
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage partner insurance underwriters, product tariffs, and
            agreement commission rates.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Insurer Partner
        </button>
      </div>

      {/* Insurers Grid */}
      {insurers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-sm">
          <Building2 className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          No insurer partners found in the database. Add your first partner
          above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insurers.map((i) => (
            <div
              key={i.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center w-12 h-12 overflow-hidden text-emerald-400">
                    {i.logo ? (
                      <img
                        src={`${STRAPI_URL}${i.logo}`}
                        alt={i.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      Rank #{i.priority}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono border ${
                        i.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {i.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{i.name}</h3>
                  <p className="text-xs font-mono text-slate-500">
                    CODE: {i.code}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block">PRODUCTS</span>
                    <span className="text-slate-200 font-semibold">
                      {i.activeProducts} Policy Types
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">COMMISSION</span>
                    <span className="text-amber-400 font-semibold">
                      {i.commissionRate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <button
                  onClick={() => handleOpenEditModal(i)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Insurer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Insurer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                Add New Partner Insurer
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInsurer} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-mono">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custodian Insurance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">
                  Corporate Slug / Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. custodian-ng"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-mono">
                    Display Priority
                  </label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-xs text-slate-200 font-mono">
                      Is Active
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">
                  Insurer Logo Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-slate-950 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "Uploading & Saving..."
                    : "Save Insurer Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Insurer Modal */}
      {isEditModalOpen && selectedInsurer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                Edit Partner: {selectedInsurer.name}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateInsurer} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-mono">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">
                  Corporate Slug / Code
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-mono">
                    Display Priority
                  </label>
                  <input
                    type="number"
                    value={editPriority}
                    onChange={(e) => setEditPriority(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-xs text-slate-200 font-mono">
                      Is Active
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">
                  Replace Logo Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditLogoFile(e.target.files?.[0] || null)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-slate-950 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
