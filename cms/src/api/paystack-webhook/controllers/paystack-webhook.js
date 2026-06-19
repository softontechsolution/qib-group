"use strict";

const crypto = require("crypto");

module.exports = {
  async handleWebhook(ctx) {
    try {

      console.log("========== WEBHOOK HIT ==========");

      console.log(ctx.request.body);
      // =====================================================
      // 1. EXTRACT RAW BODY FOR EXACT SIGNATURE MATCHING
      // =====================================================
      const bodyString = JSON.stringify(ctx.request.body);

      // =====================================================
      // 2. STRICT SIGNATURE VALIDATION
      // =====================================================
      const signature = ctx.request.headers["x-paystack-signature"];

      console.log(

        ctx.request.headers["x-paystack-signature"]

        );

      if (!signature) {
        ctx.log.warn("Paystack Webhook: Missing signature"); // Use Strapi's internal logger
        return ctx.unauthorized("Missing signature");
      }

      const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(bodyString)
        .digest("hex");

      if (hash !== signature) {
        ctx.log.error("Paystack Webhook: Invalid signature detected");
        return ctx.unauthorized("Invalid signature");
      }

      // =====================================================
      // 3. PARSE EVENT & EARLY EXIT FOR NON-SUCCESS
      // =====================================================
      const event = JSON.parse(bodyString);

      if (event.event !== "charge.success") {
        // Return 200 OK immediately for events we don't care about so Paystack doesn't retry
        return ctx.send({ received: true }); 
      }

      const data = event.data;
      const reference = data.reference;
      const registrationId = data.metadata?.registrationId;

      if (!reference?.startsWith("INS-NPF-") || !registrationId) {
        ctx.log.warn(`Invalid Paystack Payload: Ref: ${reference}, RegID: ${registrationId}`);
        return ctx.badRequest("Invalid reference or metadata");
      }

      // =====================================================
      // 4. FETCH REGISTRATION & IDEMPOTENCY CHECK
      // =====================================================
      const registration = await strapi.db
        .query("api::motor-insurance-registration.motor-insurance-registration")
        .findOne({
          where: { id: registrationId },
        });

      if (!registration) {
        return ctx.notFound("Registration not found");
      }

      // Protect against duplicate webhooks (Idempotency)
      if (["paid", "processing", "completed"].includes(registration.flowStatus)) {
        ctx.log.info(`Webhook ignored: Registration ${registrationId} already processed.`);
        return ctx.send({ success: true, message: "Already processed" });
      }

      // =====================================================
      // 5. GENERATE POLICY NUMBERS
      // =====================================================
      const counterService = strapi.service("api::system-counter.system-counter");
      const counterValue = await counterService.getNextCounter();
      
      const counter = String(counterValue).padStart(5, "0");
      const year = new Date().getFullYear().toString().slice(-2);

      const policyNumber = `NPF/EMPT/QIB/${year}/021${counter}`;
      const certificateNumber = `WAX${year}/021${counter}`;

      // =====================================================
      // 6. ATOMIC-STYLE STATE UPDATE
      // =====================================================
      await strapi.db.query("api::motor-insurance-registration.motor-insurance-registration").update({
        where: { id: registrationId },
        data: {
          paymentStatus: "paid",
          paymentReference: reference,
          processingStage: "paid",
          flowStatus: "paid", // Locks out subsequent duplicate webhooks
          policyNumber,
          certificateNumber,
          paymentDate: new Date(),
        },
      });

      console.log("========== WEBHOOK ==========");

        console.log(event.event);



        console.log(

        "REGISTRATION:",

        registrationId

        );



        console.log(

        "ADDING JOB TO QUEUE"

        );
      // =====================================================
      // 7. DELEGATE HEAVY LIFTING TO QUEUE
      // =====================================================
      const queue = require("../../../queues/policy.queue");

      await queue.add("generate-policy", {
        registrationId,
        policyNumber,
        certificateNumber,
      });

      ctx.log.info(`Payment successful for RegID: ${registrationId}. Policy generation queued.`);

      // =====================================================
      // 8. ACKNOWLEDGE SUCCESS
      // =====================================================
      return ctx.send({
        success: true,
        message: "Payment confirmed. Processing started.",
      });

    } catch (error) {
      // Enterprise systems never leak stack traces to external services
      ctx.log.error("PAYSTACK WEBHOOK ERROR:", error);
      return ctx.internalServerError("Webhook processing failed");
    }
  },
};