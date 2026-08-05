"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/admin-tools/reissue/:id",
      handler: "admin-tools.reissueCertificate",
      config: {
        auth: false,
      },
    },
  ],
};