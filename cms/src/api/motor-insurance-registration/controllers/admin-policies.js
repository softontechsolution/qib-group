// cms/src/api/motor-insurance-registration/controllers/admin-policies.js

module.exports = {
  async getPolicies(ctx) {
    try {
      // 1. Fetch all registration records from the database with user relations
      const registrations = await strapi.entityService.findMany(
        "api::motor-insurance-registration.motor-insurance-registration",
        {
          populate: ["user"],
        },
      );

      const today = new Date();

      // 2. Map and format records into rich policy telemetry structures
      const formattedPolicies = registrations.map((registration) => {
        /** @type {any} */
        const r = registration;

        const customerName =
          [r.firstName, r.lastName].filter(Boolean).join(" ") ||
          r.user?.username ||
          "Guest Customer";
        const customerEmail = r.email || r.user?.email || "N/A";
        const agentName =
          r.agentName ||
          (r.agentId ? `Agent ${r.agentId}` : "Direct Registration");
        const insurer = r.preferredInsurer || "Leadway Assurance";
        const type = r.classOfInsurance || "Third-Party Motor";
        const premium = Number(r.premium || r.totalAmount || r.amount || 0);
        const paymentStatus = (r.paymentStatus || "PENDING").toUpperCase();
        const processingStage = r.processingStage || "DOCUMENT_VERIFICATION";
        const npfStatus = (r.npfSyncStatus || "PENDING").toUpperCase();

        // Calculate expiry window metrics (1 year from paymentDate or createdAt)
        const startDateObj = new Date(r.paymentDate || r.createdAt);
        const expiryDateObj = new Date(startDateObj);
        expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 1);

        const startDate = startDateObj.toISOString().split("T")[0];
        const expiryDate = expiryDateObj.toISOString().split("T")[0];

        const diffTime = expiryDateObj.getTime() - today.getTime();
        const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          id: r.documentId || r.id, // Use documentId for modern Strapi v5 mutations
          numericId: r.id,
          policyNumber: r.policyNumber || `POL-2026-${r.id}`,
          customerName,
          customerEmail,
          agentName,
          insurer,
          type,
          premium,
          paymentStatus,
          processingStage,
          npfStatus,
          startDate,
          expiryDate,
          daysToExpiry: daysToExpiry > 0 ? daysToExpiry : 0,
        };
      });

      return ctx.send({
        success: true,
        policies: formattedPolicies,
      });
    } catch (err) {
      strapi.log.error("[Admin API] Failed to fetch policy records:", err);
      return ctx.internalServerError(
        "Internal server error fetching policy telemetry",
      );
    }
  },

  async updatePolicy(ctx) {
    try {
      const { id } = ctx.params;
      const { preferredInsurer, processingStage, expiryDate } =
        ctx.request.body;

      // Update the policy entity in Strapi database
      const updatedRecord = await strapi.entityService.update(
        "api::motor-insurance-registration.motor-insurance-registration",
        id,
        {
          data: {
            preferredInsurer,
            processingStage,
          },
        },
      );

      return ctx.send({
        success: true,
        message: "Policy record updated successfully",
        data: updatedRecord,
      });
    } catch (err) {
      strapi.log.error("[Admin API] Failed to update policy record:", err);
      return ctx.internalServerError("Internal server error updating policy");
    }
  },
};
