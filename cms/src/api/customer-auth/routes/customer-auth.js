"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/customer-auth/first-login-password",
      handler: "customer-auth.firstLoginPasswordChange",
      config: {
        // This endpoint is public because the customer has not logged in yet.
        // The controller must verify the temporary password before changing anything.
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/customer-auth/vault",
      handler: "customer-auth.vault",
      // Authentication remains enabled by default in Strapi.
    },
  ],
};
