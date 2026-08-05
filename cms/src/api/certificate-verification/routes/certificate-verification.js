module.exports = {
  routes: [
    {
      method: "GET",
      path: "/certificate/verify/:certificateNumber",
      handler: "certificate-verification.verify",
      config: {
        auth: false,
      },
    },
  ],
};