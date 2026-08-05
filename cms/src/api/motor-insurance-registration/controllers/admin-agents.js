// cms/src/api/motor-insurance-registration/controllers/admin-agents.js

module.exports = {
  async getAgents(ctx) {
    try {
      // 1. Fetch all registrations from the Strapi database
      const registrations = await strapi.entityService.findMany(
        "api::motor-insurance-registration.motor-insurance-registration",
        {
          populate: ["user"],
        },
      );

      // 2. Aggregate sales and commission metrics grouped by agentId
      const agentMap = {};

      registrations.forEach((registration) => {
        /** @type {any} */
        const reg = registration;
        const agentId = reg.agentId || "AG-DIRECT";
        const amount = Number(
          reg.premium || reg.totalAmount || reg.amount || 0,
        );

        if (!agentMap[agentId]) {
          agentMap[agentId] = {
            id: agentId,
            name:
              reg.agentName ||
              (agentId === "AG-DIRECT"
                ? "Direct Online Lead"
                : `Agent ${agentId}`),
            email: reg.agentEmail || "support@qibgroup.com",
            totalSalesNum: 0,
            salesCount: 0,
            totalCommissionNum: 0,
          };
        }

        // Only accumulate revenue from valid or paid transactions
        if (reg.paymentStatus === "paid" || amount > 0) {
          agentMap[agentId].totalSalesNum += amount;
          agentMap[agentId].salesCount += 1;

          // Tiered Commission Calculation:
          // 1. Subtract 77.5% for the insurer (leaving 22.5%)
          const remainingAfterInsurer = amount * 0.225;
          // 2. Subtract 10% from the remaining 22.5% (leaving a 12.5% pool)
          const remainingPool = remainingAfterInsurer - amount * 0.1;
          // 3. Agent commission is 50% of the remaining 12.5% pool (effective 6.25% of total premium)
          const agentCommission = remainingPool * 0.5;

          agentMap[agentId].totalCommissionNum += agentCommission;
        }
      });

      let totalAccrued = 0;
      let pendingPayouts = 0;

      // 3. Compute commission rates for each agent group using the new formula
      const agentsList = Object.values(agentMap).map((agent) => {
        const commission = agent.totalCommissionNum;
        totalAccrued += commission;
        pendingPayouts += commission * 0.5; // Estimated pending portion

        return {
          id: agent.id,
          name: agent.name,
          email: agent.email,
          totalSales: `₦${agent.totalSalesNum.toLocaleString()}`,
          commissionRate: "6.25%",
          unpaidCommission: Math.round(commission * 0.5),
          totalPaidOut: Math.round(commission * 0.5),
          status: "Active",
        };
      });

      // 4. Return aggregated agent data and KPI summary to Next.js
      return ctx.send({
        success: true,
        stats: {
          totalAccrued,
          pendingPayouts,
          activeAgentsCount: agentsList.length,
        },
        agents: agentsList,
      });
    } catch (err) {
      strapi.log.error("[Admin API] Failed to fetch agent metrics:", err);
      return ctx.internalServerError(
        "Internal server error fetching agents telemetry",
      );
    }
  },
};
