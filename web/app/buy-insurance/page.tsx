"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { submitMotorInsurance, getInsurers } from "@/services/strapi";
import { initializePaystackPayment } from "@/services/paystack";

const nigeriaData: Record<string, string[]> = {
  Abia: ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano"],
  Adamawa: ["Demsa", "Fufore", "Ganye", "Girei", "Guyuk"],
  AkwaIbom: ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Etim Ekpo"],
  Anambra: ["Aguata", "Awka North", "Awka South", "Dunukofia", "Idemili North"],
  Bauchi: ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo"],
  Bayelsa: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia"],
  Benue: ["Ado", "Agatu", "Apa", "Buruku", "Gboko"],
  Borno: ["Askira/Uba", "Bama", "Bayo", "Biu", "Chibok"],
  CrossRiver: ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra"],
  Delta: ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East"],
  Ebonyi: ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North"],
  Edo: ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East"],
  Ekiti: ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West"],
  Enugu: ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South"],
  FCT: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "AMAC"],
  Gombe: ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye"],
  Imo: ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North"],
  Jigawa: ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji"],
  Kaduna: ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara"],
  Kano: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi"],
  Katsina: ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa"],
  Kebbi: ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo"],
  Kogi: ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Idah", "Ibaji", "Ayingba", "Lokoja"],
  Kwara: ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun"],
  Lagos: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa"],
  Nasarawa: ["Akwanga", "Awe", "Doma", "Karu", "Keana"],
  Niger: ["Agaie", "Agwara", "Bida", "Borgu", "Bosso"],
  Ogun: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Ewekoro", "Ifo"],
  Ondo: ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West"],
  Osun: ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire"],
  Oyo: ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda"],
  Plateau: ["Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South"],
  Rivers: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru"],
  Sokoto: ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo"],
  Taraba: ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol"],
  Yobe: ["Bade", "Bursari", "Damaturu", "Fika", "Fune"],
  Zamfara: ["Anka", "Bakura", "Birnin Magaji", "Bukkuyum", "Bungudu"],
};

export default function SignupPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [policyType, setPolicyType] = useState<"individual" | "company">("individual");
  const [insurers, setInsurers] = useState<any[]>([]);
  const [loadingInsurers, setLoadingInsurers] = useState(false);

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
      sumAssured: "",

      policyHolderFirstName: "",
      policyHolderMiddleName: "",
      policyHolderLastName: "",
      policyPhone: "",
      policyEmail: "",
      nin: "",
      dateOfBirth: "",
      policyAddress: "",

      companyPolicyHolderName: "",
      companyPhone: "",
      companyEmail: "",
      companyName: "",
      companyIssueDate: "",
      companyAddress: "",
    });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const nextStep = () => {
    if (step === 1 && !canProceedStep1) return;
    if (step === 2 && !canProceedStep2) return;
    if (step === 3 && !canProceedStep3) return;

    setStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  // PREMIUM LOGIC
  const getPremium = () => {
    const vehicleUse = formData.vehicleUse?.trim();

    if (formData.coverType === "Third Party Only") {
      const map: Record<string, number> = {
        "Private Motor": 15000,
        Commercial: 20000,
        Trucks: 100000,
        Tricycle: 5000,
        "Mini Truck": 100000,
        "Special Types": 20000,
      };

      return map[vehicleUse] ?? 0;
    }

    if (formData.coverType === "Comprehensive") {
      const value = Number(formData.sumAssured);
      return value > 0 ? value * 0.05 : 0;
    }

    return 0;
  };

  // STEP VALIDATION
  const canProceedStep1 =
    formData.classOfInsurance.trim() !== "" &&
    formData.coverType.trim() !== "" &&
    formData.vehicleUse.trim() !== "";

  const canProceedStep2 = Boolean(formData.preferredInsurer);

  const canProceedStep3 =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.mobileNumber.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.lga.trim() !== "" &&
    formData.address.trim() !== "" &&
    formData.vehicleMake.trim() !== "" &&
    formData.vehicleModel.trim() !== "" &&
    formData.vehicleColor.trim() !== "" &&
    formData.chassisNumber.trim() !== "" &&
    formData.engineNumber.trim() !== "" &&
    formData.plateFirst.trim() !== "" &&
    formData.plateMiddle.trim() !== "" &&
    formData.plateLast.trim() !== "" &&
    formData.sumAssured !== "";

  const canSubmit = true; // review step is always allowed

// SUBMITTING FORM DATA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.policyEmail) {
      setSuccess("Please fill all required email fields");
      setLoading(false);
      return;
    }

    setLoading(true);

    console.log("FORM DATA BEFORE SUBMIT:", formData);
    const registrationNumber =
      `${formData.plateFirst}-${formData.plateMiddle}-${formData.plateLast}`;

    const premium = getPremium();
    const reference = `INS-NPF-${new Date().getFullYear()}-${Date.now()}`;

    try {
      // ✅ CREATE POLICY (Strapi)
      const saved = await submitMotorInsurance({
        data: {
          ...formData,
          policyType,
          premium,
          registrationNumber,

          paymentStatus: "pending",
          policyStatus: "draft",
          certificateGenerated: false,
          npfSynced: false,
        },
      });

      
      const registration = saved.data;

      // ✅ PAYSTACK INIT
      initializePaystackPayment({
        email: formData.email,
        amount: premium * 100, // Paystack expects kobo
        reference,

        metadata: {
          registrationId: registration.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.mobileNumber,

          vehicle_make: formData.vehicleMake,
          vehicle_model: formData.vehicleModel,
          vehicle_plate: registrationNumber,

          class_of_insurance: formData.classOfInsurance,
          cover_type: formData.coverType,
          vehicle_use: formData.vehicleUse,
          insurer: formData.preferredInsurer,

          policy_type: policyType,
          custom_fields: [
            {
              display_name: "Premium",
              value: `₦${premium.toLocaleString()}`,
            },
          ],
        },

        onSuccess: async (response) => {
          const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

          if (!STRAPI_URL) {
            throw new Error("STRAPI URL is not defined");
          }
          await fetch(
            `${STRAPI_URL}/api/motor-insurance-registrations/${registration.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                data: {
                  paystackReference: response.reference,
                  paymentStatus: "paid",
                },
              }),
            }
          );

          setSuccess("Payment successful. Processing policy...");
        },

        onClose: () => {
          console.log("Payment cancelled");
        },
      });
    } catch (err: any) {
      setSuccess(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  //INSURER 
  useEffect(() => {
      const loadInsurers = async () => {
        try {
          setLoadingInsurers(true);

          const res = await getInsurers();

          // ✅ FIX: Strapi returns { data: [...] }
          const insurersData = Array.isArray(res)
            ? res
            : res?.data || [];

          const normalized = insurersData.map((item: any) => ({
            id: item.id,
            name: item.name,
            logo: item.logo,
            isActive: item.isActive,
            priority: item.priority,
          }));

          console.log("INSURERS RAW RESPONSE:", res);

          setInsurers(normalized);
        } catch (err) {
          console.error("Failed to load insurers:", err);
          setInsurers([]);
        } finally {
          setLoadingInsurers(false);
        }
      };

      loadInsurers();
    }, []);

  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky md:top-0 z-50 top-0 left-0 h-screen w-72 bg-gray-950 border-r border-white/5 p-8 flex flex-col transform transition-transform duration-300
        ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <button
          className="md:hidden mb-8 self-end"
          onClick={() => setMenuOpen(false)}
        >
          <X />
        </button>

        <div className="hidden md:block mb-12">
          <Image
            src="/QIB-2-CROPED-trans.png"
            alt="QIB Group"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>

        <nav className="space-y-6 text-gray-400">
          <Link
            href="/"
            className="block hover:text-[#0096c7]"
          >
            Dashboard
          </Link>

          <Link
            href="#"
            className="block hover:text-[#0096c7]"
          >
            Insurance Plans
          </Link>

          <Link
            href="#"
            className="block hover:text-[#0096c7]"
          >
            Claims
          </Link>

          <Link
            href="#"
            className="block hover:text-[#0096c7]"
          >
            Support
          </Link>
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <section className="flex-1 flex flex-col w-full">
        {/* HEADER */}
        <div className="p-6 border-b border-white/5">
          <div className="md:hidden flex items-start justify-between">
            <button onClick={() => setMenuOpen(true)}>
              <Menu />
            </button>

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
        <div className="flex-1 px-4 md:px-12 pt-6 md:pt-10 pb-10">
          <div className="w-full max-w-6xl">
            {/* PROGRESS */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Insurance</span>
                <span>Insurer</span>
                <span>Details</span>
                <span>Review</span>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0096c7] transition-all duration-300"
                  style={{
                    width: `${(step / 4) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* TITLE */}
            <div className="mb-6">
              <h3 className="font-bold">
                Buy Motor Vehicle Insurance
              </h3>
            </div>

            {/* CARD */}
            <div className="bg-gray-950 border border-white/5 rounded-3xl p-6 md:p-10">
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <div>
                      <label className="text-sm text-gray-400">
                        Class of Insurance
                      </label>

                      <select
                        name="classOfInsurance"
                        value={formData.classOfInsurance}
                        onChange={handleChange}
                        className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl"
                      >
                        <option value="">
                          Select Insurance Class
                        </option>

                        <option value="Motor Vehicle">
                          Motor Vehicle
                        </option>

                        <option value="Aviation">
                          Aviation
                        </option>

                        <option value="Marine">
                          Marine
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">
                        Cover Type
                      </label>

                      <select
                        name="coverType"
                        value={formData.coverType}
                        onChange={handleChange}
                        className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl"
                      >
                        <option value="">
                          Select Insurance Type
                        </option>

                        <option value="Third Party Only">
                          Third Party Only
                        </option>

                        <option value="Third Party Fire and Theft">
                          Third Party Fire and Theft
                        </option>

                        <option value="Comprehensive">
                          Comprehensive
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">
                        Vehicle Use/Type
                      </label>

                      <select
                        name="vehicleUse"
                        value={formData.vehicleUse}
                        onChange={handleChange}
                        className="w-full mt-2 p-4 bg-black border border-white/10 rounded-2xl"
                      >
                        <option value="">
                          Select Vehicle Type
                        </option>

                        <option value="Private Motor">
                          Private Motor
                        </option>

                        <option value="Commercial">
                          Commercial
                        </option>
                        <option value="Trucks">Trucks</option>
                        <option value="Tricycle">Tricycle</option>
                        <option value="Mini Truck">Mini Truck</option>
                        <option value="Special Types">Special Types (Ambulances/Hearses)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">
                      Select Preferred Insurer
                    </h2>

                    {loadingInsurers ? (
                        <p className="text-gray-400">Loading insurers...</p>
                      ) : insurers.length === 0 ? (
                        <p className="text-red-400">No insurers available</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-5">
                          {insurers.map((insurer) => {
                            const logoUrl = insurer.logo?.url
                              ? `http://localhost:1337${insurer.logo.url}`
                              : null;

                            return (
                              <button
                                key={insurer.id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    preferredInsurer: insurer.name,
                                  });

                                  nextStep();
                                }}
                                className={`p-6 border rounded-2xl transition-all
                                  ${
                                    formData.preferredInsurer === insurer.name
                                      ? "border-[#0096c7] bg-[#0096c7]/10"
                                      : "border-white/10"
                                  }`}
                              >
                                <div className="flex flex-col items-center gap-4">
                                  {logoUrl && (
                                    <div className="relative h-14 w-full">
                                      <Image
                                        src={logoUrl}
                                        alt={insurer.name}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                  )}

                                  <span>{insurer.name}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
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

                        {/* STATE */}
                        <select
                          name="state"
                          value={formData.state}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              state: e.target.value,
                              lga: "",
                            });
                          }}
                          className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                        >
                          <option value="">Select State</option>

                          {Object.keys(nigeriaData).map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>

                        {/* LGA */}
                        <select
                          name="lga"
                          value={formData.lga}
                          onChange={handleChange}
                          disabled={!formData.state}
                          className="w-full p-4 bg-black border border-white/10 rounded-2xl disabled:opacity-50"
                        >
                          <option value="">Select LGA</option>

                          {formData.state &&
                            nigeriaData[formData.state]?.map((lga) => (
                              <option key={lga} value={lga}>
                                {lga}
                              </option>
                            ))}
                        </select>

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

                            {/* STATE */}
                            <select
                              name="vehicleState"
                              value={formData.vehicleState}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  vehicleState: e.target.value,
                                  vehicleLga: "",
                                });
                              }}
                              className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                            >
                              <option value="">Select State</option>

                              {Object.keys(nigeriaData).map((vehicleState) => (
                                <option key={vehicleState} value={vehicleState}>
                                  {vehicleState}
                                </option>
                              ))}
                            </select>

                            {/* LGA */}
                            <select
                              name="vehicleLga"
                              value={formData.vehicleLga}
                              onChange={handleChange}
                              disabled={!formData.state}
                              className="w-full p-4 bg-black border border-white/10 rounded-2xl disabled:opacity-50"
                            >
                              <option value="">Select LGA</option>

                              {formData.vehicleState &&
                                nigeriaData[formData.vehicleState]?.map((vehicleLga) => (
                                  <option key={vehicleLga} value={vehicleLga}>
                                    {vehicleLga}
                                  </option>
                                ))}
                            </select>
                      </div>

                      {/* REGISTRATION NUMBER */}
                      <div className="mt-8">
                        <p className="text-sm text-gray-400 mb-4">
                          Registration Number (Enter the local government and enter the other characters in the other fields)
                        </p>

                        <div className="grid grid-cols-3 gap-4">
                          <input
                            type="text"
                            name="plateFirst"
                            value={formData.plateFirst}
                            onChange={handleChange}
                            placeholder="ABC"
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
                            placeholder="AA"
                            className="w-full p-4 bg-black border border-white/10 rounded-2xl text-center uppercase"
                          />
                        </div>
                      </div>

                      {/* VEHICLE EXTRA DETAILS */}
                      <div className="grid md:grid-cols-3 gap-6 mt-8">

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
                          name="vehicleColor"
                          value={formData.vehicleColor}
                          onChange={handleChange}
                          placeholder="Vehicle Color"
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

                        {/* NEW FIELD */}
                        <input
                          type="number"
                          name="sumAssured"
                          value={formData.sumAssured}
                          onChange={handleChange}
                          placeholder="Vehicle Value / Sum Assured (₦)"
                          className="w-full p-4 bg-black border border-white/10 rounded-2xl md:col-span-3"
                        />
                      </div>
                    </div>

                    {/* POLICY DETAILS */}
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-6">
                        Policy Details
                      </h2>

                      <div className="flex gap-4 mb-8">
                        <button
                          type="button"
                          onClick={() => setPolicyType("individual")}
                          className={`px-6 py-3 rounded-xl transition ${
                            policyType === "individual"
                              ? "bg-[#0096c7]"
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
                              ? "bg-[#0096c7]"
                              : "bg-black border border-white/10"
                          }`}
                        >
                          Company
                        </button>
                      </div>

                      {/* INDIVIDUAL */}
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
                            type="text"
                            name="nin"
                            value={formData.nin}
                            onChange={handleChange}
                            placeholder="NIN"
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
                            placeholder="Issurance Company Name" 
                            className="w-full p-4 bg-black border border-white/10 rounded-2xl" 
                          />

                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full p-4 bg-black border border-white/10 rounded-2xl"
                          />

                          <textarea 
                            name="policyAddress" 
                            value={formData.policyAddress} 
                            onChange={handleChange} rows={4} 
                            placeholder="Policy Holder Address" 
                            className="md:col-span-2 w-full p-4 bg-black border border-white/10 rounded-2xl resize-none" 
                          />

                        </div>
                      )}
                      {/* COMPANY FORM */} 
                      {policyType === "company" && ( 
                        <div className="grid md:grid-cols-2 gap-6">

                          <input type="text" 
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
                            placeholder="Company Address" 
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
                      <h2 className="text-2xl font-bold mb-2"> Review Your Information </h2> 
                      <p className="text-gray-600"> Please confirm your details before submitting. </p> 
                    </div>

                    {/* INSURANCE INFO */}
                    <div className="p-6 border rounded-2xl bg-gray-50">
                      <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">
                        Insurance Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 text-black">
                        <p>
                          <strong>Class:</strong> {formData.classOfInsurance}
                        </p>

                        <p>
                          <strong>Cover Type:</strong> {formData.coverType}
                        </p>

                        <p>
                          <strong>Vehicle Use:</strong> {formData.vehicleUse}
                        </p>

                        <p>
                          <strong>Preferred Insurer:</strong>{" "}
                          {formData.preferredInsurer}
                        </p>
                      </div>
                    </div>

                    {/* PERSONAL INFO */} 
                    <div className="p-6 border rounded-2xl bg-gray-50"> 
                      <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">Personal Information</h3>
                       <div className="grid md:grid-cols-2 gap-4 text-black"> 
                        <p><strong>First Name:</strong> {formData.firstName}</p> 
                        <p><strong>Last Name:</strong> {formData.lastName}</p> 
                        <p><strong>Phone:</strong> {formData.mobileNumber}</p> 
                        <p><strong>Email:</strong> {formData.email}</p> 
                        <p><strong>State:</strong> {formData.state}</p> 
                        <p><strong>LGA:</strong> {formData.lga}</p> 
                        <p className="md:col-span-2"> <strong>Address:</strong> {formData.address} </p> 
                      </div> 
                    </div>

                    {/* VEHICLE INFO */}
                    <div className="p-6 border rounded-2xl bg-gray-50">
                      <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">
                        Vehicle Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 text-black">

                        <p>
                          <strong>Vehicle Make:</strong>{" "}
                          {formData.vehicleMake}
                        </p>

                        <p>
                          <strong>Vehicle Model:</strong>{" "}
                          {formData.vehicleModel}
                        </p>

                        <p>
                          <strong>Vehicle Color:</strong>{" "}
                          {formData.vehicleColor}
                        </p>

                        <p>
                          <strong>Engine Capacity:</strong>{" "}
                          {formData.engineCapacity}
                        </p>

                        <p>
                          <strong>Chassis Number:</strong>{" "}
                          {formData.chassisNumber}
                        </p>

                        <p>
                          <strong>Engine Number:</strong>{" "}
                          {formData.engineNumber}
                        </p>

                        <p>
                          <strong>Plate Number:</strong>{" "}
                          {formData.plateFirst}
                          {formData.plateMiddle}
                          {formData.plateLast}
                        </p>

                        <p>
                          <strong>Vehicle Value:</strong> ₦
                          {Number(
                            formData.sumAssured || 0
                          ).toLocaleString()}
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
                          <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p> 
                          <p className="md:col-span-2"> <strong>Address:</strong> {formData.policyAddress} </p> 
                        </div> ) : ( 
                          <div className="grid md:grid-cols-2 gap-4 text-black"> 
                            <p><strong>Policy Type:</strong> Company</p> 
                            <p><strong>Preferred Insurer:</strong> {formData.preferredInsurer}</p> 
                            <p><strong>Company Holder:</strong> {formData.companyPolicyHolderName}</p> 
                            <p><strong>Phone:</strong> {formData.companyPhone}</p> 
                            <p><strong>Email:</strong> {formData.companyEmail}</p> 
                            <p><strong>Issue Date:</strong> {formData.companyIssueDate}</p> 
                            <p className="md:col-span-2"> <strong>Address:</strong> {formData.companyAddress} </p> 
                          </div> 
                        )} 
                    </div>

                    {/* PAYMENT SUMMARY */}
                    <div className="p-6 border rounded-2xl bg-gray-50">
                      <h3 className="font-semibold text-lg mb-4 text-[#0096c7]">
                        Payment Summary
                      </h3>

                      <div className="space-y-4 text-black">

                        <p>
                          <strong>Cover Type:</strong>{" "}
                          {formData.coverType}
                        </p>

                        <p>
                          <strong>Vehicle Type:</strong>{" "}
                          {formData.vehicleUse}
                        </p>

                        <p className="text-xl font-bold text-[#0096c7]">
                          Premium: ₦
                          {getPremium().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP VALIDATION MESSAGES */}
                {step === 1 && !canProceedStep1 && (
                  <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-xl mt-4">
                    Please complete insurance selection to continue
                  </p>
                )}

                {step === 2 && !canProceedStep2 && (
                  <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-xl mt-4">
                    Please select a preferred insurer to continue
                  </p>
                )}

                {step === 3 && !canProceedStep3 && (
                  <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-xl mt-4">
                    Please fill all required fields before continuing
                  </p>
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
                    disabled={
                      loading ||
                      (step === 1 && !canProceedStep1) ||
                      (step === 2 && !canProceedStep2) ||
                      (step === 3 && !canProceedStep3)
                    }
                    className={`px-8 py-3 rounded-xl text-white transition
                      ${
                        loading ||
                        (step === 1 && !canProceedStep1) ||
                        (step === 2 && !canProceedStep2) ||
                        (step === 3 && !canProceedStep3)
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-[#0096c7] hover:bg-[#007aa8]"
                      }`}
                  >
                    {step === 4
                      ? loading
                        ? "Submitting..."
                        : "Proceed to Payment"
                      : "Next"}
                  </button>
                </div>

                {success && (
                  <p className="mt-6 text-green-500 font-medium">
                    {success}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}