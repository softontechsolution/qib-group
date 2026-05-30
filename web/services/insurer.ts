export const getInsurers = async () => {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/insurers?populate=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch insurers");

  return res.json();
};