// cms/src/api/insurer/routes/admin-routes.js

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/insurers",
      handler: "admin-insurers.getInsurers",
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: "POST",
      path: "/admin/insurers",
      handler: "admin-insurers.createInsurer",
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: "PUT",
      path: "/admin/insurers/:id",
      handler: "admin-insurers.updateInsurer",
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
