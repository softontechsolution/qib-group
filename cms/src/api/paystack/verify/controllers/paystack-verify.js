"use strict";

module.exports = {
  async verify(ctx) {
    try {
      const { reference } = ctx.request.body;

      if (!reference) {
        return ctx.badRequest("Missing reference");
      }

      // 1. Verify with Paystack
      const res = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const result = await res.json();

      if (!result.status || result.data.status !== "success") {
        return ctx.badRequest("Payment not successful");
      }

      const metadata = result.data.metadata || {};
      const registrationId = metadata.registrationId;

      if (!registrationId) {
        return ctx.badRequest("Missing registration ID");
      }

      // 2. Run SAME logic as webhook
      const service = strapi.service(
        "api::certificate-processor.processor"
      );

      const registration = await strapi.db
        .query("api::motor-insurance-registration.motor-insurance-registration")
        .findOne({
          where: { id: registrationId },
        });

      if (!registration) {
        return ctx.notFound("Registration not found");
      }

      // 3. Prevent duplicate processing
      if (registration.paymentStatus === "paid") {
        return ctx.send({
          message: "Already processed",
        });
      }

      // 4. Generate policy/certificate
      await service.run(registrationId);

      return ctx.send({
        success: true,
        message: "Policy processing started",
      });
    } catch (err) {
      console.error(err);
      return ctx.internalServerError("Verification failed");
    }
  },
};