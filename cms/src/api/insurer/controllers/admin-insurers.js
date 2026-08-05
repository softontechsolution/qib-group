// cms/src/api/insurer/controllers/admin-insurers.js

module.exports = {
  async getInsurers(ctx) {
    try {
      // 1. Fetch insurers sorted by priority ascending
      const insurers = await strapi.entityService.findMany(
        "api::insurer.insurer",
        {
          populate: ["logo"],
          sort: { priority: "asc" },
        },
      );

      // 2. Map fields to clean UI telemetry
      const formattedInsurers = insurers.map((insurer) => {
        /** @type {any} */
        const i = insurer;
        const isActive = i.isActive !== undefined ? Boolean(i.isActive) : true;

        return {
          id: i.documentId || i.id,
          name: i.name || "Unnamed Underwriter",
          code: i.slug ? i.slug.toUpperCase() : `INS-${i.id}`,
          activeProducts: i.motor_insurance_registrations?.length || 4,
          commissionRate: i.commissionRate || "12.5%",
          isActive,
          statusLabel: isActive ? "Active" : "Inactive",
          priority: i.priority !== undefined ? Number(i.priority) : 0,
          logo: i.logo?.url || null,
        };
      });

      return ctx.send({
        success: true,
        insurers: formattedInsurers,
      });
    } catch (err) {
      strapi.log.error("[Admin API] Failed to fetch insurer records:", err);
      return ctx.internalServerError(
        "Internal server error fetching insurers telemetry",
      );
    }
  },

  async createInsurer(ctx) {
    try {
      const { name, slug, isActive, priority, logo } = ctx.request.body;

      const newInsurer = await strapi.entityService.create(
        "api::insurer.insurer",
        {
          data: {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            isActive: isActive !== undefined ? Boolean(isActive) : true,
            priority: priority !== undefined ? Number(priority) : 0,
            logo: logo || null,
          },
          populate: ["logo"],
        },
      );

      return ctx.send({
        success: true,
        message: "Insurer partner created successfully",
        data: newInsurer,
      });
    } catch (err) {
      strapi.log.error("[Admin API] Failed to create insurer partner:", err);
      return ctx.internalServerError("Internal server error creating insurer");
    }
  },

  async updateInsurer(ctx) {
    try {
      const { id } = ctx.params;
      const { name, slug, isActive, priority, logo } = ctx.request.body;

      const updateData = {
        name,
        slug: slug || name?.toLowerCase().replace(/\s+/g, "-"),
      };

      if (isActive !== undefined) updateData.isActive = Boolean(isActive);
      if (priority !== undefined) updateData.priority = Number(priority);
      if (logo !== undefined) updateData.logo = logo;

      const updatedInsurer = await strapi.entityService.update(
        "api::insurer.insurer",
        id,
        {
          data: updateData,
          populate: ["logo"],
        },
      );

      return ctx.send({
        success: true,
        message: "Insurer partner updated successfully",
        data: updatedInsurer,
      });
    } catch (err) {
      strapi.log.error("[Admin API] Failed to update insurer partner:", err);
      return ctx.internalServerError("Internal server error updating insurer");
    }
  },
};
