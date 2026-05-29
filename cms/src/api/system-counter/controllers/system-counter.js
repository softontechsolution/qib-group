// @ts-nocheck
'use strict';

module.exports = {
  async next(ctx) {
    const value = await strapi
      .service('api::system-counter.system-counter')
      .getNextCounter();

    ctx.send({ value });
  },
};