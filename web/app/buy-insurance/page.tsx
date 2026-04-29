"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { submitMotorInsurance } from "@/services/strapi";

export default function SignupPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [policyType, setPolicyType] = useState<"individual" | "company">(
  "individual"
);

  const [formData, setFormData] = useState({
    classOfInsurance: "",
    coverType: "",
    vehicleUse: "",
    preferredInsurer: "",

    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    state: "",
    lga: "",
    address: "",

    vehicleState: "",
    vehicleLga: "",
    plateFirst: "",
    plateMiddle: "",
    plateLast: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleColor: "",
    engineCapacity: "",
    chassisNumber: "",
    engineNumber: "",

    policyType: "individual",

    policyHolderFirstName: "",
    policyHolderMiddleName: "",
    policyHolderLastName: "",
    policyPhone: "",
    policyEmail: "",
    policyCompanyName: "",
    nin: "",
    issueDate: "",
    policyAddress: "",

    companyPolicyHolderName: "",
    companyPhone: "",
    companyEmail: "",
    companyName: "",
    companyIssueDate: "",
    companyAddress: "",
  });

  const insurers = [
    {
      name: "AIICO Insurance",
      logo: "/insurers/aiico.png",
    },
    {
      name: "Leadway Assurance",
      logo: "/insurers/leadway.png",
    },
    {
      name: "AXA Mansard",
      logo: "/insurers/axa.png",
    },
    {
      name: "NEM Insurance",
      logo: "/insurers/nem.png",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Submitting registration:", formData);

  // next step:
  // send formData to Strapi API
    setLoading(true);

    try {
      await submitMotorInsurance({
        ...formData,
        policyType,
        // 🔥 sanitize required fields
      companyEmail: formData.companyEmail?.trim() || null,
      policyEmail: formData.policyEmail?.trim() || null,
      });

      setSuccess("Registration submitted successfully.");
    } catch (error) {
      const err = error as { message?: string };
      console.error("Submission error:", err);
      setSuccess(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
};
  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* MOBILE SIDEBAR OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
     <aside
        className={`fixed md:sticky md:top-0 z-50 md:z-auto top-0 left-0 h-screen w-72 bg-gray-950 border-r border-white/5 p-8 flex flex-col transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
        {/* Close button mobile */}
        <button
          className="md:hidden mb-8 self-end"
          onClick={() => setMenuOpen(false)}
        >
          <X />
        </button>

        {/* Logo desktop */}
        <div className="hidden md:block mb-12">
          <Image
            src="/QIB-2-CROPED-trans.png"
            alt="QIB Group"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="space-y-6 text-gray-400">
          <Link href="/" className="block hover:text-[#0096c7] transition">
            Dashboard
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Insurance Plans
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Claims
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Support
          </Link>
          <Link href="#" className="block hover:text-[#0096c7] transition">
            Contact
          </Link>
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <section className="flex-1 flex flex-col w-full">
        {/* TOP HEADER */}
        <div className="p-6 border-b border-white/5">
          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-start justify-between">
            {/* left menu button */}
            <button onClick={() => setMenuOpen(true)}>
              <Menu />
            </button>

            {/* right logo + login */}
            <div className="flex flex-col items-end gap-4">
              <Image
                src="/QIB-2-CROPED-trans.png"
                alt="QIB Group"
                width={120}
                height={40}
                className="object-contain"
              />

              <Link
                href="/login"
                className="px-5 py-2 border border-[#0096c7] text-[#0096c7] rounded-xl"
              >
                Login
              </Link>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden md:flex justify-end">
            <Link
              href="/login"
              className="px-6 py-3 border border-[#0096c7] text-[#0096c7] rounded-xl hover:bg-[#0096c7] hover:text-white transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* FORM */}
       <div className="flex-1 flex items-start  px-4 md:px-12 pt-6 md:pt-10 pb-10">
            <div className="w-full max-w-6xl">
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Account</span>
                        <span>Company</span>
                        <span>Finish</span>
                        <span>Review</span>
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-[#0096c7] transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                    </div>
                {/* Title */}
                <div className="mb-6 text-left">
                <h3 className="font-bold">
                    Buy Motor Vehicle Insurance
                </h3>
                </div>

                {/* Form Card */}
                <div className="bg-gray-950 border border-white/5 rounded-3xl p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* STEP 1 */}
                    {step === 1 && (
                    <>
                        {/* Class of Insurance */}
                        <div>
                        <label className="text-sm text-gray-400">Class of Insurance</label>
                        <select
                          name="classOfInsurance"
                          value={formData.classOfInsurance}
                          onChange={handleChange}
                          className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]"
                        >
                          <option value="">Select Insurance Class</option>
                          <option value="Motor Vehicle">Motor Vehicle</option>
                          <option value="Aviation">Aviation</option>
                          <option value="Marine">Marine</option>
                          <option value="Builder Liability">Builder Liability</option>
                        </select>
                        </div>

                        {/* Cover Type */}
                        <div>
                        <label className="text-sm text-gray-400">Cover Type</label>
                        <select
                          name="coverType"
                          value={formData.coverType}
                          onChange={handleChange}
                          className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]"
                        >
                          <option value="">Select Insurance Type</option>
                          <option value="Third Party Only">Third Party Only</option>
                          <option value="Third Party Fire and Theft">Third Party Fire and Theft</option>
                          <option value="Comprehensive">Comprehensive</option>
                          <option value="Third Party Trucks">Third Party Trucks</option>
                        </select>
                        </div>

                        {/* Vehicle Use */}
                        <div>
                        <label className="text-sm text-gray-400">Vehicle Use</label>
                        <select
                            name="vehicleUse"
                            value={formData.vehicleUse}
                            onChange={handleChange}
                            className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]"
                          >
                            <option value="">Select Vehicle Use</option>
                            <option value="Private Motor">Private Motor</option>
                            <option value="Motor Cycle">Motor Cycle</option>
                            <option value="Special Types">Special Types</option>
                            <option value="Motor Trade">Motor Trade</option>
                            <option value="Tricycle">Tricycle</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Fare Paying Passenger Bus">Fare Paying Passenger Bus</option>
                          </select>
                        </div>
                    </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <div>
                        <h2 className="text-xl md:text-2xl font-semibold mb-6">
                          Do you have a preferred insurer?
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
                          {insurers.map((insurer) => (
                            <button
                              key={insurer.name}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  preferredInsurer: insurer.name,
                                  policyCompanyName: insurer.name,
                                  companyName: insurer.name,
                                });
                                nextStep();
                              }}
                              className={`p-6 border rounded-2xl transition-all hover:border-[#0096c7]
                              ${
                                formData.preferredInsurer === insurer.name
                                  ? "border-[#0096c7] bg-[#0096c7]/10"
                                  : "border-white/10"
                              }`}
                            >
                              <div className="flex flex-col items-center text-center gap-4">
                                <div className="relative h-14 w-full">
                                  <Image
                                    src={insurer.logo}
                                    alt={insurer.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>

                                <span className="text-sm md:text-base">
                                  {insurer.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                     {step === 3 && (
                        <div className="space-y-10">
                          {/* PERSONAL DETAILS */}
                          <div>
                            <h2 className="text-xl md:text-2xl font-semibold mb-6">
                              Personal Details
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                              <input
                              type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                              type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                              type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="Mobile Number"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                              type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email (This is your username)"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                              type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                              type="text"
                                name="lga"
                                value={formData.lga}
                                onChange={handleChange}
                                placeholder="LGA"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                rows={4}
                                className="md:col-span-2 w-full p-4 bg-black border border-white/10 rounded-2xl resize-none"
                              />
                            </div>
                          </div>

                          {/* VEHICLE DETAILS */}
                            <div>
                              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                                Vehicle Details
                              </h2>

                              <div className="grid md:grid-cols-2 gap-6">
                                <input
                                type="text"
                                  name="vehicleState"
                                  value={formData.vehicleState}
                                    onChange={handleChange}
                                  placeholder="State"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                type="text"
                                  name="vehicleLga"
                                  value={formData.vehicleLga}
                                    onChange={handleChange}
                                  placeholder="LGA"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />
                              </div>

                              {/* Registration Number */}
                              <div className="mt-8">
                                <p className="text-sm text-gray-400 mb-4">
                                  Registration Number (Select the local government and enter the
                                  other characters in the other fields)
                                </p>

                                <div className="grid grid-cols-3 gap-4">
                                  <input
                                  type="text"
                                    name="plateFirst"
                                    value={formData.plateFirst}
                                    onChange={handleChange}
                                    placeholder="BWR"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-center uppercase"
                                  />

                                  <input
                                  type="text"
                                    name="plateMiddle"
                                    value={formData.plateMiddle}
                                    onChange={handleChange}
                                    placeholder="123"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-center"
                                  />

                                  <input
                                  type="text"
                                    name="plateLast"
                                    value={formData.plateLast}
                                    onChange={handleChange}
                                    placeholder="AB"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-center uppercase"
                                  />
                                </div>
                              </div>

                              {/* Remaining fields */}
                              <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <input
                                type="text"
                                  name="chassisNumber"
                                  value={formData.chassisNumber}
                                  onChange={handleChange}
                                  placeholder="Chassis Number"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                type="text"
                                  name="engineNumber"
                                  value={formData.engineNumber}
                                  onChange={handleChange}
                                  placeholder="Engine Number"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                type="text"
                                  name="vehicleColor"
                                  value={formData.vehicleColor}
                                  onChange={handleChange}
                                  placeholder="Vehicle Color"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                type="text"
                                  name="vehicleMake"
                                  value={formData.vehicleMake}
                                  onChange={handleChange}
                                  placeholder="Vehicle Make"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                type="text"
                                  name="vehicleModel"
                                  value={formData.vehicleModel}
                                  onChange={handleChange}
                                  placeholder="Vehicle Model"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                type="text"
                                  name="engineCapacity"
                                  value={formData.engineCapacity}
                                  onChange={handleChange}
                                  placeholder="Engine Capacity"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />
                              </div>
                            </div>

                          {/* POLICY DETAILS */}
                            <div>
                              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                                Policy Details
                              </h2>

                              {/* Tabs */}
                              <div className="flex gap-4 mb-8">
                                <button
                                  type="button"
                                  onClick={() => setPolicyType("individual")}
                                  className={`px-6 py-3 rounded-xl transition ${
                                    policyType === "individual"
                                      ? "bg-[#0096c7] text-white"
                                      : "bg-black border border-white/10"
                                  }`}
                                >
                                  Individual
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setPolicyType("company")}
                                  className={`px-6 py-3 rounded-xl transition ${
                                    policyType === "company"
                                      ? "bg-[#0096c7] text-white"
                                      : "bg-black border border-white/10"
                                  }`}
                                >
                                  Company
                                </button>
                              </div>

                              {/* INDIVIDUAL FORM */}
                              {policyType === "individual" && (
                                <div className="grid md:grid-cols-2 gap-6">
                                  <input
                                    type="text"
                                    name="policyHolderFirstName"
                                    value={formData.policyHolderFirstName}
                                    onChange={handleChange}
                                    placeholder="Policy Holder First Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="text"
                                    name="policyHolderMiddleName"
                                    value={formData.policyHolderMiddleName}
                                    onChange={handleChange}
                                    placeholder="Policy Holder Middle Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="text"
                                    name="policyHolderLastName"
                                    value={formData.policyHolderLastName}
                                    onChange={handleChange}
                                    placeholder="Policy Holder Last Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="text"
                                    name="policyPhone"
                                    value={formData.policyPhone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="email"
                                    name="policyEmail"
                                    value={formData.policyEmail}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="text"
                                    name="policyCompanyName"
                                    value={formData.preferredInsurer}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="text"
                                    name="nin"
                                    value={formData.nin}
                                    onChange={handleChange}
                                    placeholder="NIN (Optional)"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    type="date"
                                    name="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <textarea
                                    name="policyAddress"
                                    value={formData.policyAddress}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Address"
                                    className="md:col-span-2 w-full p-4 bg-black border border-white/10 rounded-2xl resize-none"
                                  />
                                </div>
                              )}

                              {/* COMPANY FORM */}
                              {policyType === "company" && (
                                <div className="grid md:grid-cols-2 gap-6">
                                  <input
                                  type="text"
                                    name="companyPolicyHolderName"
                                    value={formData.companyPolicyHolderName}
                                    onChange={handleChange}
                                    placeholder="Policy Holder Company Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="text"
                                    name="companyPhone"
                                    value={formData.companyPhone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="email"
                                    name="companyEmail"
                                    value={formData.companyEmail}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                  type="text"
                                    name="companyName"
                                    value={formData.preferredInsurer}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    type="date"
                                    name="companyIssueDate"
                                    value={formData.companyIssueDate}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <textarea
                                    name="companyAddress"
                                    value={formData.companyAddress}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Address"
                                    className="md:col-span-2 w-full p-4 bg-black border border-white/10 rounded-2xl resize-none"
                                  />
                                </div>
                              )}
                            </div>
                        </div>
                      )}

                    {/* STEP 4 */}
                      {step === 4 && (
                      <div className="space-y-10">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            Review Your Information
                          </h2>
                          <p className="text-gray-600">
                            Please confirm your details before submitting.
                          </p>
                        </div>

                        {/* Insurance Info */}
                        <div className="p-6 border rounded-2xl bg-gray-50">
                          <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">Insurance Information</h3>

                          <div className="grid md:grid-cols-2 gap-4 text-black">
                            <p><strong>Class:</strong> {formData.classOfInsurance}</p>
                            <p><strong>Cover:</strong> {formData.coverType}</p>
                            <p><strong>Vehicle Use:</strong> {formData.vehicleUse}</p>
                            <p><strong>Preferred Insurer:</strong> {formData.preferredInsurer}</p>
                          </div>
                        </div>

                        {/* Personal Info */}
                        <div className="p-6 border rounded-2xl bg-gray-50">
                          <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">Personal Information</h3>

                          <div className="grid md:grid-cols-2 gap-4 text-black">
                            <p><strong>First Name:</strong> {formData.firstName}</p>
                            <p><strong>Last Name:</strong> {formData.lastName}</p>
                            <p><strong>Phone:</strong> {formData.mobileNumber}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>State:</strong> {formData.state}</p>
                            <p><strong>LGA:</strong> {formData.lga}</p>
                            <p className="md:col-span-2">
                              <strong>Address:</strong> {formData.address}
                            </p>
                          </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="p-6 border rounded-2xl bg-gray-50">
                          <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">Vehicle Information</h3>

                          <div className="grid md:grid-cols-2 gap-4 text-black">
                            <p><strong>Vehicle Make:</strong> {formData.vehicleMake}</p>
                            <p><strong>Vehicle Model:</strong> {formData.vehicleModel}</p>
                            <p><strong>Color:</strong> {formData.vehicleColor}</p>
                            <p><strong>Engine Capacity:</strong> {formData.engineCapacity}</p>
                            <p><strong>Chassis No:</strong> {formData.chassisNumber}</p>
                            <p><strong>Engine No:</strong> {formData.engineNumber}</p>
                            <p>
                              <strong>Plate Number:</strong>{" "}
                              {formData.plateFirst} {formData.plateMiddle} {formData.plateLast}
                            </p>
                          </div>
                        </div>

                        {/* POLICY INFO */}
                        <div className="p-6 border rounded-2xl bg-gray-50">
                          <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">Policy Information</h3>

                          {policyType === "individual" ? (
                            <div className="grid md:grid-cols-2 gap-4 text-black">
                              <p><strong>Policy Type:</strong> Individual</p>
                              <p><strong>Preferred Insurer:</strong> {formData.preferredInsurer}</p>

                              <p><strong>First Name:</strong> {formData.policyHolderFirstName}</p>
                              <p><strong>Middle Name:</strong> {formData.policyHolderMiddleName}</p>

                              <p><strong>Last Name:</strong> {formData.policyHolderLastName}</p>
                              <p><strong>Phone:</strong> {formData.policyPhone}</p>

                              <p><strong>Email:</strong> {formData.policyEmail}</p>
                              <p><strong>NIN:</strong> {formData.nin || "Not provided"}</p>

                              <p><strong>Issue Date:</strong> {formData.issueDate}</p>

                              <p className="md:col-span-2">
                                <strong>Address:</strong> {formData.policyAddress}
                              </p>
                            </div>
                          ) : (
                            <div className="grid md:grid-cols-2 gap-4 text-black">
                              <p><strong>Policy Type:</strong> Company</p>
                              <p><strong>Preferred Insurer:</strong> {formData.preferredInsurer}</p>

                              <p><strong>Company Holder:</strong> {formData.companyPolicyHolderName}</p>
                              <p><strong>Phone:</strong> {formData.companyPhone}</p>

                              <p><strong>Email:</strong> {formData.companyEmail}</p>
                              <p><strong>Issue Date:</strong> {formData.companyIssueDate}</p>

                              <p className="md:col-span-2">
                                <strong>Address:</strong> {formData.companyAddress}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* NAV BUTTONS */}
                    <div className="flex justify-between pt-10">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-3 border rounded-xl"
                        >
                          Previous
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type={step === 4 ? "submit" : "button"}
                        onClick={step < 4 ? nextStep : undefined}
                        className="px-8 py-3 bg-[#0096c7] text-white rounded-xl"
                      >
                        {step === 4
                          ? loading
                            ? "Submitting..."
                            : "Submit Registration"
                          : "Next"}
                      </button>
                      {success && (
                        <p className="mt-6 text-green-600 font-medium">
                          {success}
                        </p>
                      )}
                    </div>

                    </form>
                </div>
            </div>
            </div>
      </section>
    </main>
  );
}