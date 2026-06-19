module.exports = {
  routes: [
    {
      method: "POST",
      path: "/paystack/verify",
      handler: "paystack-verify.verify",
      config: {
        auth: false,
      },
    },
  ],
};