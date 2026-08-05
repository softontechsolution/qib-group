// cms/src/api/motor-insurance-registration/controllers/admin-customers.js

module.exports = {
  async getCustomers(ctx) {
    try {
      // 1. Fetch all registrations from Strapi database with user relations populated
      const registrations = await strapi.entityService.findMany(
        "api::motor-insurance-registration.motor-insurance-registration",
        {
          populate: ["user"],
        },
      );

      // 2. Map and format records into clean customer profiles
      const formattedCustomers = registrations.map((registration) => {
        /** @type {any} */
        const r = registration;

        const name =
          [r.firstName, r.lastName].filter(Boolean).join(" ") ||
          r.user?.username ||
          "Guest Customer";
        const email = r.email || r.user?.email || "N/A";
        const phone = r.phone || r.phoneNumber || "N/A";
        const registeredAt = r.createdAt ? r.createdAt.split("T")[0] : "N/A";
        const activePolicies = r.policyStatus === "active" ? 1 : 0;
        const totalSpent = Number(r.premium || r.totalAmount || r.amount || 0);

        return {
          id: r.id,
          documentId: r.documentId,
          name,
          email,
          phone,
          registeredAt,
          activePolicies,
          totalSpent: `₦${totalSpent.toLocaleString()}`,
          status: r.policyStatus === "active" ? "Active" : "Pending",
        };
      });

      // 3. Return payload to Next.js
      return ctx.send({
        success: true,
        customers: formattedCustomers,
      });
    } catch (err) {
      strapi.log.error("[Admin API] Failed to fetch customer records:", err);
      return ctx.internalServerError(
        "Internal server error fetching customers",
      );
    }
  },
};
