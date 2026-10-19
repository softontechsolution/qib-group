"use strict";

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
      strapi.log.info(
        `[Worker Diagnostic] Bootstrap PID: ${process.pid}; ` +
          `global.strapi available: ${Boolean(global.strapi)}; ` +
          `same instance: ${global.strapi === strapi}`,
      );

      // Preserve the existing Strapi instance assignment.
      global.strapi = strapi;

      strapi.log.info(
        `[Worker Diagnostic] Starting policy worker in PID ${process.pid}`,
      );

      try {
        require("./workers/policy.worker");
        strapi.log.info(
          `[Worker Diagnostic] Worker module loaded in PID ${process.pid}`,
        );
      } catch (error) {
        strapi.log.error(
          `[Worker Diagnostic] Worker startup failed in PID ${process.pid}: ${error.stack || error.message}`,
        );
      }
    }, 2000);
  },
};
