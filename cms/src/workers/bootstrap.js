const { Worker } = require("bullmq");
const connection = require("../lib/redis");
const socket = require("../realtime/socket");

// IMPORTANT: import Strapi properly
const strapiFactory = require("@strapi/strapi");

async function startWorker() {
  const app = await strapiFactory().load();

  global.strapi = app;

  console.log("Worker connected to Strapi");

  require("./policy.worker");
}

startWorker();
startWorker().catch((err) => {
  console.error("Worker bootstrap failed:", err);
});