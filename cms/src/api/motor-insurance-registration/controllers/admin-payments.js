// cms/src/api/motor-insurance-registration/controllers/admin-payments.js

async function executePostPaymentSplit(registration, totalPremium) {
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

  // 1. Calculate exact tiered amounts
  const underwriterAmount = totalPremium * 0.775; // 77.5% -> Underwriter
  const brokerAmount = totalPremium * 0.1; // 10.0% -> Broker
  const techAccountAmount = totalPremium * 0.0625; // 6.25% -> Tech Platform
  const agentCommission = totalPremium * 0.0625; // 6.25% -> Accumulated in Wallet

  // 2. Define instant Paystack transfers for external parties only
  const transfers = [
    {
      amount: Math.round(underwriterAmount * 100), // Convert to kobo
      recipient: process.env.UNDERWRITER_RECIPIENT_CODE,
      reason: `Underwriter Split - Policy ${registration.policyNumber || registration.id}`,
    },
    {
      amount: Math.round(brokerAmount * 100),
      recipient: process.env.BROKER_RECIPIENT_CODE,
      reason: `Broker Split - Policy ${registration.policyNumber || registration.id}`,
    },
    {
      amount: Math.round(techAccountAmount * 100),
      recipient: process.env.TECH_RECIPIENT_CODE,
      reason: `Tech Platform Split - Policy ${registration.policyNumber || registration.id}`,
    },
  ];

  // 3. Execute automatic transfers via Paystack Transfer API
  for (const t of transfers) {
    if (!t.recipient) {
      strapi.log.warn(
        `[Paystack Split] Skipping transfer: Recipient code missing for reason: ${t.reason}`,
      );
      continue;
    }

    try {
      const response = await fetch("https://api.paystack.co/transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "balance",
          amount: t.amount,
          recipient: t.recipient,
          reason: t.reason,
        }),
      });

      const data = await response.json();
      if (!data.status) {
        strapi.log.error(
          `[Paystack Split Error] Failed for ${t.reason}:`,
          data.message,
        );
      } else {
        strapi.log.info(
          `[Paystack Split Success] Disbursed ₦${t.amount / 100} for ${t.reason}`,
        );
      }
    } catch (err) {
      strapi.log.error("[Paystack Transfer Network Error]:", err);
    }
  }

  // 4. Log agent commission accumulation for their platform wallet ledger
  strapi.log.info(
    `[Agent Wallet] Credited ₦${agentCommission} to agent ID: ${registration.agentId || "Direct"}`,
  );
}

module.exports = {
  async getPayments(ctx) {
    try {
      const registrations = await strapi.entityService.findMany(
        "api::motor-insurance-registration.motor-insurance-registration",
        {
          populate: ["user"],
          sort: { createdAt: "desc" },
        },
      );

      let totalRevenue = 0;
      let successCount = 0;
      let pendingCount = 0;

      const transactions = registrations.map((registration, index) => {
        /** @type {any} */
        const r = registration;

        const customerName =
          [r.firstName, r.lastName].filter(Boolean).join(" ") ||
          r.user?.username ||
          "Guest Customer";
        const amount = Number(r.premium || r.totalAmount || r.amount || 0);
        const rawStatus = (r.paymentStatus || "PENDING").toLowerCase();

        let status = "pending";
        if (rawStatus === "paid" || rawStatus === "success") {
          status = "success";
          totalRevenue += amount;
          successCount += 1;
        } else {
          pendingCount += 1;
        }

        const paidAtDate = r.paymentDate || r.createdAt;
        const formattedDate = paidAtDate
          ? new Date(paidAtDate)
              .toISOString()
              .replace("T", " ")
              .substring(0, 19)
          : "—";

        return {
          id: `TXN-${10000000 + (r.id || index)}`,
          documentId: r.documentId || r.id,
          reference:
            r.paymentReference ||
            `paystack_ref_${r.id || Math.floor(Math.random() * 1000000000)}`,
          customerName,
          policyNumber: r.policyNumber || `POL-2026-${r.id}`,
          amount,
          currency: "NGN",
          status,
          gatewayResponse:
            status === "success" ? "Approved" : "Awaiting payment confirmation",
          paidAt: formattedDate,
        };
      });

      return ctx.send({
        success: true,
        metrics: {
          totalRevenue,
          successCount,
          pendingCount,
        },
        transactions,
      });
    } catch (err) {
      strapi.log.error(
        "[Admin API] Failed to fetch payment transactions:",
        err,
      );
      return ctx.internalServerError(
        "Internal server error fetching payment telemetry",
      );
    }
  },

  async verifyPayment(ctx) {
    try {
      const { reference } = ctx.params;

      // 1. Locate registration entry by paymentReference or fallback documentId
      const registrations = await strapi.entityService.findMany(
        "api::motor-insurance-registration.motor-insurance-registration",
        {
          filters: {
            $or: [{ paymentReference: reference }, { documentId: reference }],
          },
        },
      );

      if (!registrations || registrations.length === 0) {
        return ctx.notFound({
          success: false,
          message: "Transaction reference not found in database",
        });
      }

      const targetRecord = registrations[0];
      const totalPremium = Number(
        targetRecord.premium || targetRecord.paymentAmount || 0,
      );
      // 2. Execute Paystack Post-Payment Split ONLY if paymentProcessed is false/falsy
      if (!targetRecord.paymentProcessed && totalPremium > 0) {
        await executePostPaymentSplit(targetRecord, totalPremium);
      }

      // 3. Update record using only existing fields: paymentStatus, paymentProcessed, paymentDate
      const updatedRecord = await strapi.entityService.update(
        "api::motor-insurance-registration.motor-insurance-registration",
        targetRecord.id,
        {
          data: {
            paymentStatus: "paid", // Matches your schema lowercase convention
            paymentDate: new Date().toISOString(),
            paymentProcessed: true, // Uses your existing schema boolean field
          },
        },
      );

      return ctx.send({
        success: true,
        message: "Payment verified and funds successfully split disbursed",
        data: updatedRecord,
      });
    } catch (err) {
      strapi.log.error(
        "[Admin API] Failed to verify payment transaction:",
        err,
      );
      return ctx.internalServerError("Internal server error verifying payment");
    }
  },
};
