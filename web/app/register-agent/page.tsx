"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterAgentPage() {
  const router = useRouter();
  
  // 1. Update the initial state
const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  middleName: "", // Optional
  email: "",
  username: "",
  phoneNumber: "",
  agentType: "agent",
  password: "",
});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");

  // Helper to generate a highly visible, unique Agent Identification Code
  const generateAgentId = () => {
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    const prefix = formData.agentType === "broker" ? "BKR" : "AGT";
    return `QIB-${prefix}-${randomChars}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const uniqueAgentId = generateAgentId();
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanUsername = formData.username.trim().toLowerCase();

    console.log(`[Agent Registration] Initiating process for: ${cleanEmail}`);
    console.log(`[Agent Registration] Generated Agent ID: ${uniqueAgentId}`);

    try {
      const payload = {
        username: cleanUsername,
        email: cleanEmail,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        phoneNumber: formData.phoneNumber,
        agentType: formData.agentType,
        agentId: uniqueAgentId,
      };

      console.log(`[Agent Registration] Sending payload to custom Strapi backend...`, {
        ...payload, 
        password: "[REDACTED]" // Keeps the password out of your console logs for security
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/agent/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(`[Agent Registration] Server Response Status: ${res.status}`);

      if (!res.ok) {
        console.error(`[Agent Registration] Server rejected request:`, data);
        // Extracts the error message sent from our custom backend controller
        throw new Error(data?.error?.message || data?.message || "Registration failed. Please check your details.");
      }

      console.log(`[Agent Registration] Success! Backend confirmed creation and email dispatch.`);
      setSuccessId(uniqueAgentId);

    } catch (err: any) {
      console.error(`[Agent Registration] FATAL ERROR Caught:`, err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      console.log(`[Agent Registration] Execution finished. Clearing loading state.`);
      setIsLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 shadow-xl text-center">
          <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full mb-4 text-2xl">🎉</div>
          <h2 className="text-2xl font-black text-gray-900">Application Approved!</h2>
          <p className="text-sm text-gray-500 mt-2">
            Your agent portal profile has been compiled successfully. Use your credentials to log in.
          </p>
          
          <div className="my-6 p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Your Unique Agent ID</span>
            <span className="text-xl font-mono font-black text-white select-all">{successId}</span>
          </div>

          <p className="text-xs text-red-500 mb-6">
            ⚠️ Write this down! You must include this Agent ID on client policies to route commissions to your account.
          </p>

          <Link href="/login" className="block w-full text-center py-3 bg-[#0096c7] text-white font-bold rounded-xl hover:bg-black transition">
            Proceed to Login Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8 text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/">
          <Image src="/QIB-2-CROPED-trans.png" alt="QIB Group" width={160} height={48} priority className="h-10 w-auto mb-6" />
        </Link>
        <h2 className="text-center text-3xl font-black tracking-tight text-gray-900">Partner Network Signup</h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Earn competitive commissions by placing coverage for your corporate or personal clients.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
              ❌ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none" />
                </div>
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Middle Name</label>
                  <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none" />
                </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Desired Username</label>
                <input type="text" name="username" required value={formData.username} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none" placeholder="johndoebroker" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Business Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none" placeholder="agent@company.com" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Line</label>
                <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none" placeholder="+234..." />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Intermediary Classification</label>
              <select name="agentType" value={formData.agentType} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none font-medium">
                <option value="agent">Independent Sales Rep (Retail Sales)</option>
                <option value="broker">Certified Corporate Rep (Commercial Accounts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Access Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0096c7] outline-none" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-[#0096c7] hover:bg-black text-white font-bold rounded-xl transition duration-200 flex items-center justify-center text-sm shadow-md">
              {isLoading ? "Validating Credentials..." : "Register & Generate Agent ID"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already registered as an intermediary?{" "}
            <Link href="/login" className="font-bold text-[#0096c7] hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}