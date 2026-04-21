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