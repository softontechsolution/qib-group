'use strict';

const systemCounterSeed = require("./bootstrap/system-counter-seed");

/**
 * @param {any} strapi
 */
module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await systemCounterSeed({ strapi });
  },
};
