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

export const submitContact = async (payload: any) => {
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