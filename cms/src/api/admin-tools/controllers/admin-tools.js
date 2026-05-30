"use strict";

module.exports = {
  async reissueCertificate(ctx) {
    const { id } = ctx.params;

    const result = await strapi
      .service("api::admin-tools.admin-tools")
      .reissue(id);

    ctx.body = result;
  },
};