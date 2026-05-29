"use strict";

/**
 * @param {any} strapi
 */
module.exports = async ({ strapi }) => {
  const existing = await strapi.db
    .query("api::system-counter.system-counter")
    .findOne({ where: { id: 1 } });

  if (!existing) {
    await strapi.db.query("api::system-counter.system-counter").create({
      data: {
        id: 1,
        value: 0,
      },
    });

    strapi.log.info("System counter initialized");
  }
};