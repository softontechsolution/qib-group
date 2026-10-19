'use strict';

const systemCounterSeed = require("./bootstrap/system-counter-seed");
const socket = require("./realtime/socket");

/**
 * @param {any} strapi
 */
module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    // 1. Run seeds
    await systemCounterSeed({ strapi });

    // 2. Initialize your modular socket and pass the whole strapi instance
    socket.init(strapi);

    // 🔥 FORCE THE WORKER TO INITIALIZE AND START LISTENING TO REDIS
    // ⏳ Give Strapi 2 seconds to fully open the database and settle down before starting workers
    setTimeout(() => {
      strapi.log.info("🚀 Strapi is fully stable. Booting background workers...");
      
      // 1. THE FIX: Attach strapi to the global Node context
      // This allows your unmodified worker file to access 'strapi' magically
      global.strapi = strapi;
      
      // 2. Boot the worker exactly as you originally had it.
      // No wrappers, no functions, no TypeScript callable errors.
      require("./workers/policy.worker");
    }, 2000);
  },
};