"use strict";

/**
 * @param {any} trx
 */
module.exports = {
  async getNextCounter() {
    return await strapi.db.transaction(async (trx) => {
      // Lock the single row (id = 1)
      const counter = await strapi.db
        .query("api::system-counter.system-counter")
        .findOne({
          where: { id: 1 },
          lock: "for update",
          transacting: trx,
        });

      if (!counter) {
        throw new Error("System counter not initialized");
      }

      const nextValue = counter.value + 1;

      await strapi.db
        .query("api::system-counter.system-counter")
        .update({
          where: { id: 1 },
          data: {
            value: nextValue,
          },
          transacting: trx,
        });

      return {
        value: nextValue,
        prefix: counter.prefix,
        certificatePrefix: counter.certificatePrefix,
      };
    });
  },
};