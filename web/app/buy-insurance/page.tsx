"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Lock, Building2, Menu, X } from "lucide-react";

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
const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-[#0096c7] transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
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
                <form className="space-y-6">

                    {/* STEP 1 */}
                    {step === 1 && (
                    <>
                        {/* Class of Insurance */}
                        <div>
                        <label className="text-sm text-gray-400">Class of Insurance</label>
                        <select className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]">
                            <option value="">Select Insurance Class</option>
                            <option value="motor vehicle">Motor Vehicle</option>
                            <option value="aviation">Aviation</option>
                            <option value="marine">Marine</option>
                            <option value="builder liability">Builder Liability</option>
                        </select>
                        </div>

                        {/* Cover Type */}
                        <div>
                        <label className="text-sm text-gray-400">Cover Type</label>
                        <select className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]">
                            <option value="">Select Insurance Type</option>
                            <option value="third party only">Third Party Only</option>
                            <option value="third party fire and theft">Third Party, Fire and Theft</option>
                            <option value="comprehensive">Comprehensive</option>
                            <option value="third party trucks">Third Part Trucks</option>
                        </select>
                        </div>

                        {/* Vehicle Use */}
                        <div>
                        <label className="text-sm text-gray-400">Vehicle Use</label>
                        <select className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-[#0096c7]">
                            <option value="">Select Vehicle Use</option>
                            <option value="private motor">Private Motor</option>
                            <option value="motor cycle (power Bike/official ride)">Motor Cycle (Power Bike/Official Ride)</option>
                            <option value="special types (ambulance/hearses)">Special Types (Ambulance/Hearses)</option>
                            <option value="motor trade (road/premises risks)">Motor Trade (Road/Premises Risks)</option>
                            <option value="tricycle (keke napep)">Tricycle (Keke Napep)</option>
                            <option value="commercial (own good/ staff bus)">Commercial (Own Good/ Staff Bus)</option>
                            <option value="fare paying passenger bus">Fare Paying Passenger Bus</option>
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
                                <img
                                  src={insurer.logo}
                                  alt={insurer.name}
                                  className="h-14 object-contain"
                                />

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
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="Mobile Number"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email (This is your username)"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                              />

                              <input
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
                                  name="vehicleState"
                                  placeholder="State"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                  name="vehicleLga"
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
                                    name="bwr"
                                    placeholder="BWR"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-center uppercase"
                                  />

                                  <input
                                    name="plateMiddle"
                                    placeholder="123"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-center"
                                  />

                                  <input
                                    name="plateLast"
                                    placeholder="AB"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl text-center uppercase"
                                  />
                                </div>
                              </div>

                              {/* Remaining fields */}
                              <div className="grid md:grid-cols-3 gap-6 mt-8">
                                <input
                                  name="chassisNumber"
                                  placeholder="Chassis Number"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                  name="engineNumber"
                                  placeholder="Engine Number"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                  name="vehicleColor"
                                  placeholder="Vehicle Color"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                  name="vehicleMake"
                                  placeholder="Vehicle Make"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                  name="vehicleModel"
                                  placeholder="Vehicle Model"
                                  className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                />

                                <input
                                  name="engineCapacity"
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
                                    name="policyHolderFirstName"
                                    placeholder="Policy Holder First Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="policyHolderMiddleName"
                                    placeholder="Policy Holder Middle Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="policyHolderLastName"
                                    placeholder="Policy Holder Last Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="policyPhone"
                                    placeholder="Phone Number"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="policyEmail"
                                    placeholder="Email"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="policyCompanyName"
                                    placeholder="Company Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="nin"
                                    placeholder="NIN (Optional)"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    type="date"
                                    name="issueDate"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <textarea
                                    name="policyAddress"
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
                                    name="companyPolicyHolderName"
                                    placeholder="Policy Holder Company Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="companyPhone"
                                    placeholder="Phone Number"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="companyEmail"
                                    placeholder="Email"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    name="companyName"
                                    placeholder="Company Name"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <input
                                    type="date"
                                    name="companyIssueDate"
                                    className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                                  />

                                  <textarea
                                    name="companyAddress"
                                    rows={4}
                                    placeholder="Address"
                                    className="md:col-span-2 w-full p-4 bg-black border border-white/10 rounded-2xl resize-none"
                                  />
                                </div>
                              )}
                            </div>
                        </div>
                      )}

                    {/* NAV BUTTONS */}
                    <div className="flex justify-between pt-4">
                        {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-3 border border-white/10 rounded-xl"
                        >
                            Back
                        </button>
                        ) : (
                        <div />
                        )}

                        {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-3 bg-[#0096c7] rounded-xl"
                        >
                            Next
                        </button>
                        ) : (
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#0096c7] rounded-xl"
                        >
                            Submit
                        </button>
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