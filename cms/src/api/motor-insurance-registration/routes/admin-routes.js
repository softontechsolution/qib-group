// cms/src/api/motor-insurance-registration/routes/admin-routes.js

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/dashboard-stats",
      handler: "admin-metrics.getDashboardStats",
      config: {
        auth: false, // Set to true if you want to require admin JWT authentication later
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/admin/customers",
      handler: "admin-customers.getCustomers",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/admin/agents",
      handler: "admin-agents.getAgents",
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: "GET",
      path: "/admin/policies",
      handler: "admin-policies.getPolicies",
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: "PUT",
      path: "/admin/policies/:id",
      handler: "admin-policies.updatePolicy",
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: "GET",
      path: "/admin/payments",
      handler: "admin-payments.getPayments",
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: "POST",
      path: "/admin/payments/verify/:reference",
      handler: "admin-payments.verifyPayment",
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
