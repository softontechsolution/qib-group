"use strict";

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    // Only generate if not already provided
    if (!data.paymentReference) {
      data.paymentReference = `INS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Ensure default status
    if (!data.paymentStatus) {
      data.paymentStatus = "pending";
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // 1. CONDITION: Check if the policy payment is completed
    const isPaid = result.paymentStatus === "paid";

    // 2. CONDITION: Ensure an agent ID is actually linked to this policy
    const hasAgent = result.agentId && result.agentId.trim() !== "";

    if (isPaid && hasAgent) {
      try {
        const policyIdentifier = result.registrationNumber || `POL-${result.id}`;

        // 3. SAFETY LAYER: Verify a ledger entry doesn't already exist for this transaction
        const existingCommission = await strapi.entityService.findMany("api::commission.commission", {
          filters: { policyNumber: policyIdentifier },
        });

        if (existingCommission && existingCommission.length > 0) {
          // Commission has already been recorded for this specific purchase, stop execution
          return;
        }

        // 4. THE CALCULATION: Set your commission rate (e.g., 10% of the premium)
        const COMMISSION_RATE = 0.10; 
        const premiumAmount = Number(result.premium) || 0;
        const calculatedCommission = premiumAmount * COMMISSION_RATE;

        if (calculatedCommission <= 0) return;

        // 5. THE ACTION: Write the secure accounting record to your Commission collection
        await strapi.entityService.create("api::commission.commission", {
          data: {
            agentId: result.agentId,
            amount: calculatedCommission,
            policyNumber: policyIdentifier,
            payoutStatus: "pending", 
            publishedAt: new Date(),
          },
        });

        strapi.log.info(`Commission of ₦${calculatedCommission} logged for Agent: ${result.agentId}`);
      } catch (error) {
        strapi.log.error("Failed to automatically compute and store agent commission entry:", error);
      }
    }
  },
};