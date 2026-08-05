"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitClaim } from "@/services/strapi";

// =====================================================
// DICTIONARIES & TS INTERFACES
// =====================================================
const FORM_MAPPING: Record<string, { label: string; downloadUrl: string }> = {
  "Comprehensive": {
    label: "Comprehensive Claim Form",
    downloadUrl: "/forms/comprehensive_claim_template.pdf"
  },
  "Third Party Only": {
    label: "Third Party Property Damage Claim Form",
    downloadUrl: "/forms/third_party_claim_template.pdf"
  },
  "Third Party Fire & Theft": {
    label: "Fire & Theft Incident Report Form",
    downloadUrl: "/forms/fire_theft_claim_template.pdf"
  }
};

interface InsuranceUser {
  id: string | number;
  email: string;
  policyNumber: string;
}

interface LodgeClaimPageProps {
  mockUser?: InsuranceUser | null;
}

// =====================================================
// MAIN ENTRY POINT: LODGE CLAIM PAGE
// =====================================================
export default function LodgeClaimPage({ mockUser = null }: LodgeClaimPageProps) {
  const [selectedCover, setSelectedCover] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [email, setEmail] = useState("");
  const [claimFormFile, setClaimFormFile] = useState<File | null>(null);
  const [evidencePhotos, setEvidencePhotos] = useState<File[]>([]);

  // UI Loading & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    if (mockUser) {
        setEmail(mockUser.email || "");
        setPolicyNumber(mockUser.policyNumber || "");
    }
  }, [mockUser]);

  // =====================================================
  // STRAPI SUBMISSION ROUTINE
  // =====================================================
  const handleSubmitClaim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // --- FRONTEND VALIDATION SCRIPT ---
    if (!policyNumber.trim()) {
      setSubmitStatus({ type: 'error', message: "Policy Number is required." });
      setIsSubmitting(false);
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setSubmitStatus({ type: 'error', message: "Please enter a valid email address." });
      setIsSubmitting(false);
      return;
    }
    if (!claimFormFile) {
      setSubmitStatus({ type: 'error', message: "Please attach your completed claim form document." });
      setIsSubmitting(false);
      return;
    }

    // --- ASSEMBLE MULTIPART FORMDATA ---
    const formData = new FormData();
    
    // Strapi text context wrapper
    formData.append("data", JSON.stringify({
      email: email.trim(),
      policyNumber: policyNumber.trim().toUpperCase(),
      coverType: selectedCover || "Not Specified",
      status: "pending",
      user: mockUser ? mockUser.id : null
    }));
    
    // Media assignments mapping directly to Strapi attributes
    formData.append("files.claimForm", claimFormFile);
    evidencePhotos.forEach((photo) => {
      formData.append("files.evidence", photo);
    });

    // --- FIRE THE REFACTOR ROUTINE ---
    try {
      // Execute using your central Axios config instance
      await submitClaim(formData);

      setSubmitStatus({ 
        type: 'success', 
        message: "Your documentation has been dispatched cleanly to our processing desk!" 
      });

      // Reset mutable forms
      if (!mockUser) {
        setPolicyNumber("");
        setEmail("");
      }
      setSelectedCover("");
      setClaimFormFile(null);
      setEvidencePhotos([]);

      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => { (input as HTMLInputElement).value = ''; });

    } catch (err: any) {
      console.error("Centralized Submission Failed:", err);
      
      // Target specific Axios error structures gracefully if they return from the backend
      const errorMessage = err.response?.data?.error?.message || err.message || "An unresolved network event interrupted submission.";
      setSubmitStatus({ 
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Flex column layout ensures the imported Footer stays pinned to the bottom 
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 2. RENDER IMPORTED NAVBAR */}
      <Navbar />

      {/* Main Container Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-black">
          
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Lodge an Insurance Claim
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Download your required document templates or submit your filled evidence directly below.
          </p>
          <hr className="my-6 border-gray-200" />

          {/* DYNAMIC VALIDATION AND STATUS BANNER */}
          {submitStatus.type && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {submitStatus.type === 'success' ? '🚀 ' : '⚠️ '} {submitStatus.message}
            </div>
          )}

          {/* SECTION 1: DOWNLOAD ENGINE */}
          <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-3">1. Need to Download a Form?</h3>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              Select Cover Type to Get Your PDF Template:
            </label>
            <select 
              value={selectedCover} 
              onChange={(e) => setSelectedCover(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-3 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0096c7] focus:border-transparent transition-all"
            >
              <option value="">-- Choose Cover Type --</option>
              {Object.keys(FORM_MAPPING).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {selectedCover && FORM_MAPPING[selectedCover] && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <a 
                  href={FORM_MAPPING[selectedCover].downloadUrl} 
                  download
                  className="inline-flex items-center text-sm text-[#0096c7] font-bold hover:underline gap-1"
                >
                  📥 Click here to download: {FORM_MAPPING[selectedCover].label}
                </a>
              </div>
            )}
          </div>

          {/* SECTION 2: FILE & TEXT SUBMISSION FORM */}
          <form onSubmit={handleSubmitClaim} className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">2. Submit Your Claim Documentation</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">Policy Number *</label>
                <input 
                  type="text" 
                  value={policyNumber} 
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="e.g. NPF/EMPT/QIB/26/02100011"
                  disabled={!!mockUser || isSubmitting}
                  className="w-full p-3 text-sm rounded-lg border border-gray-300 bg-white disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0096c7] transition-all"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">Email Address *</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={!!mockUser || isSubmitting}
                  className="w-full p-3 text-sm rounded-lg border border-gray-300 bg-white disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0096c7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                Upload Filled & Signed Claim Form (PDF or Scan) *
              </label>
              <input 
                type="file" 
                accept=".pdf,image/*"
                disabled={isSubmitting}
                onChange={(e) => setClaimFormFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                Upload Supporting Photo Evidence (Damages, Accident Scene)
              </label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                disabled={isSubmitting}
                onChange={(e) => {
                    if (e.target.files) {
                      setEvidencePhotos(Array.from(e.target.files));
                    }
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0096c7] text-white font-bold rounded-xl hover:bg-black hover:text-white transition-all transform active:scale-[0.99] shadow-md shadow-sky-100"
            >
              {isSubmitting ? "Processing Claim Records..." : "Submit Claim Files"}
            </button>
          </form>

        </div>
      </main>

      {/* 3. RENDER IMPORTED FOOTER */}
      <Footer />

    </div>
  );
}