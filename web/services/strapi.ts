import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:1337/api"
});

export const getHomepage = async () => {
  const res = await API.get("/homepage?populate=*");
  return res.data.data;
};

export const getBusinesses = async () => {
  const res = await API.get("/businesses?populate=*");
  return res.data.data;
};

export const getProjects = async () => {
  const res = await API.get("/projects?populate=*");
  return res.data.data;
};

export const submitContact = async (payload: Record<string, string>) => {
  const res = await API.post("/contacts", {
    data: payload
  });
  return res.data;
};

export const getNews = async () => {
  const res = await API.get("/news?populate=*");
  return res.data.data;
};

export const getAboutPage = async () => {
  const res = await API.get("/about-page");
  return res.data.data;
};

export const getTeamMembers = async () => {
  const res = await API.get("/team-members?populate=*");
  return res.data.data;
};

export const getInsurancePage = async () => {
  const res = await API.get("/insurance-page");
  return res.data.data;
};

export const getInsuranceSlides = async () => {
  const res = await API.get("/insurance-slides?populate=*");
  return res.data.data;
};

export const getInsuranceFeatures = async () => {
  const res = await API.get("/insurance-features");
  return res.data.data;
};

export const getInsurancePolicies = async () => {
  const res = await API.get("/insurance-policies");
  return res.data.data;
};

export const getTestimonials = async () => {
  const res = await API.get("/testimonials");
  return res.data.data;
};

export const getInsuranceBenefits = async () => {
  const res = await API.get("/insurance-benefits");
  return res.data.data;
};

export const getLoginPage = async () => {
  const res = await API.get("/login-page?populate=*");
  return res.data.data;
};

export const getLoginSlides = async () => {
  const res = await API.get("/login-slides?populate=*");
  return res.data.data;
};

export const getAboutSlides = async () => {
  const res = await API.get("/about-slides?populate=*");
  return res.data.data;
};

export const getStrategicPartners = async () => {
  const res = await API.get("/strategic-partners?populate=*");
  return res.data.data;
};

export const getCEOProfile = async () => {
  const res = await API.get("/ceo-profile?populate=*");
  return res.data.data;
};

export const getAboutGallery = async () => {
  const res = await API.get("/about-galleries?populate=*");
  return res.data.data;
};

export const getHeroSlides = async () => {
  const res = await API.get("/hero-slides?populate=*");
  return res.data.data;
};

export async function submitMotorInsurance(payload: Record<string, unknown>) {
  const d =
    (payload.data as Record<string, string | number | null>) ||
    payload;

  const cleanEmail = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

  const cleanData = {
    // customer
    firstName: d.firstName ?? "",
    lastName: d.lastName ?? "",
    mobileNumber: d.mobileNumber ?? "",
    email: cleanEmail(d.email),
    state: d.state ?? "",
    lga: d.lga ?? "",
    address: d.address ?? "",
    nin: d.nin ?? "",

    // vehicle
    vehicleMake: d.vehicleMake ?? "",
    vehicleModel: d.vehicleModel ?? "",
    registrationNumber: d.registrationNumber ?? "",
    chassisNumber: d.chassisNumber ?? "",
    engineNumber: d.engineNumber ?? "",
    vehicleState: d.vehicleState ?? "",
    vehicleLga: d.vehicleLga ?? "",
    plateFirst: d.plateFirst ?? "",
    plateMiddle: d.plateMiddle ?? "",
    plateLast: d.plateLast ?? "",
    vehicleColor: d.vehicleColor ?? "",
    engineCapacity: d.engineCapacity ?? "",

    // insurance
    classOfInsurance: d.classOfInsurance ?? "",
    coverType: d.coverType ?? "",
    vehicleUse: d.vehicleUse ?? "",
    preferredInsurer: d.preferredInsurer ?? "",
    policyType: d.policyType ?? "",
    policyHolderFirstName: d.policyHolderFirstName ?? "",
    policyHolderMiddleName: d.policyHolderMiddleName ?? "",
    policyHolderLastName: d.policyHolderLastName ?? "",
    policyPhone: d.policyPhone ?? "",
    policyEmail: cleanEmail(d.policyEmail),
    policyCompanyName: d.policyCompanyName ?? "",
    policyAddress: d.policyAddress ?? "",

    companyPolicyHolderName: d.companyPolicyHolderName ?? "",
    companyPhone: d.policyType === "company" ? d.companyPhone ?? "" : null,
    companyEmail: d.policyType === "company" ? cleanEmail(d.companyEmail) : null,
    companyName: d.policyType === "company" ? d.companyName ?? "" : null,
    companyAddress: d.policyType === "company" ? d.companyAddress ?? "" : null,
    premium: d.premium ?? null,
    sumAssured: d.sumAssured ?? null,

    // dates
    dateOfBirth: d.dateOfBirth || null,
    companyIssueDate: d.companyIssueDate || null,

    // status
    paymentStatus: "pending",
    policyStatus: "draft",
  };

  console.log("FINAL CLEAN DATA:", cleanData);

  const res = await fetch(
    "http://localhost:1337/api/motor-insurance-registrations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: cleanData,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    console.error("Strapi error:", result);
    throw new Error(
      result?.error?.message || "Failed to submit registration"
    );
  }

  return result;
}

export async function getNextPolicyCounter() {
  const res = await fetch(
    "http://localhost:1337/api/system-counter/next"
  );

  const data = await res.json();
  return data.value;
}

export const getInsurers = async () => {
  const res = await API.get("/insurers?populate=*");
  return res.data.data;
};

/**
 * Submits a claims package containing text meta-data and file binaries to Strapi
 * @param formData - Prepared multipart/form-data container
 */
export const submitClaim = async (formData: FormData) => {
  const res = await API.post("/claims", formData);
  return res.data;
};

/**
 * Fetches all motor insurance registrations linked to a specific user ID
 */
export const getUserPolicies = async (userId: string | number) => {
  const res = await API.get(`/motor-insurance-registrations?filters[user][id][$eq]=${userId}&populate=*`);
  return res.data.data;
};

/**
 * Fetches all claims lodged by a specific user ID
 */
export const getUserClaims = async (userId: string | number) => {
  const res = await API.get(`/claims?filters[user][id][$eq]=${userId}&populate=*`);
  return res.data.data;
};