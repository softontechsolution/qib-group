"use strict";

const crypto = require("crypto");

module.exports = {
  async handleWebhook(ctx) {
    try {
      // =====================================================
      // STEP 1 — GET RAW BODY
      // =====================================================
      const body = ctx.request.rawBody;

      // =====================================================
      // STEP 2 — GET PAYSTACK SIGNATURE
      // =====================================================
      const signature =
        ctx.request.headers["x-paystack-signature"];

      if (!signature) {
        return ctx.unauthorized("Missing signature");
      }

      // =====================================================
      // STEP 3 — VALIDATE SIGNATURE
      // =====================================================
      const hash = crypto
        .createHmac(
          "sha512",
          process.env.PAYSTACK_SECRET_KEY
        )
        .update(body)
        .digest("hex");

      if (hash !== signature) {
        return ctx.unauthorized("Invalid signature");
      }

      // =====================================================
      // STEP 4 — PARSE EVENT
      // =====================================================
      const event = JSON.parse(body);

      // =====================================================
      // STEP 5 — ONLY HANDLE SUCCESSFUL PAYMENTS
      // =====================================================
      if (event.event !== "charge.success") {
        ctx.body = {
          received: true,
        };
        return;
      }

      const data = event.data;

      // =====================================================
      // STEP 6 — VALIDATE REFERENCE
      // =====================================================
      const reference = data.reference;

      if (!reference?.startsWith("INS-NPF-")) {
        return ctx.badRequest("Invalid reference");
      }

      // =====================================================
      // STEP 7 — VERIFY PAYMENT WITH PAYSTACK
      // =====================================================
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const verifyData = await verifyRes.json();

      if (
        !verifyData.status ||
        verifyData.data.status !== "success"
      ) {
        return ctx.badRequest("Payment verification failed");
      }

      // =====================================================
      // STEP 8 — GET METADATA
      // =====================================================
      const metadata = data.metadata || {};

      const registrationId = metadata.registrationId;

      if (!registrationId) {
        return ctx.badRequest(
          "Missing registration ID"
        );
      }

      // =====================================================
      // STEP 9 — FETCH REGISTRATION
      // =====================================================
      const registration = await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .findOne({
          where: {
            id: registrationId,
          },
        });

      if (!registration) {
        return ctx.notFound(
          "Insurance registration not found"
        );
      }

      // =====================================================
      // STEP 10 — IDEMPOTENCY CHECK
      // Prevent duplicate processing
      // =====================================================
      if (
        registration.status === "completed" ||
        registration.paymentStatus === "paid"
      ) {
        ctx.body = {
          success: true,
          message:
            "Payment already processed previously",
        };

        return;
      }

      // =====================================================
      // STEP 11 — GET SYSTEM COUNTER
      // =====================================================
      const counterService = strapi.service(
        "api::system-counter.system-counter"
      );

      const counterValue =
        await counterService.getNextCounter();

      const counter = String(counterValue).padStart(
        5,
        "0"
      );

      const year = new Date()
        .getFullYear()
        .toString()
        .slice(-2);

      // =====================================================
      // STEP 12 — GENERATE POLICY NUMBER
      // =====================================================
      const policyNumber =
        `NPF/EMPT/QIB/${year}/021${counter}`;

      // =====================================================
      // STEP 13 — GENERATE CERTIFICATE NUMBER
      // =====================================================
      const certificateNumber =
        `WAX${year}/021${counter}`;

      // =====================================================
      // STEP 14 — UPDATE STRAPI
      // =====================================================
      await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .update({
          where: {
            id: registrationId,
          },
          data: {
            paymentStatus: "paid",
            paymentReference: reference,
            status: "processing",
            policyStatus: "active",

            policyNumber,
            certificateNumber,

            paymentDate: new Date(),
          },
        });

      // =====================================================
      // STEP 15 — START PROCESSOR
      // =====================================================
      await strapi
        .service(
          "api::certificate-processor.processor"
        )
        .run(registrationId, {
          policyNumber,
          certificateNumber,
        });

      // =====================================================
      // STEP 16 — SUCCESS RESPONSE
      // =====================================================
      ctx.body = {
        success: true,
        message:
          "Payment verified and processing started",

        policyNumber,
        certificateNumber,
      };
    } catch (error) {
      console.error(
        "PAYSTACK WEBHOOK ERROR:",
        error
      );

      // =====================================================
      // STEP 17 — FAIL SAFE RESPONSE
      // =====================================================
      ctx.throw(500, "Webhook processing failed");
    }
  },
};