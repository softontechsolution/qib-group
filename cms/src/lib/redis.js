"use strict";

/**
 * REDIS CONNECTION CONFIGURATION
 * * Instead of exporting a live client instance, we export the raw configuration object.
 * This allows BullMQ to safely spawn independent connection pools for Queues and Workers,
 * avoiding socket-blocking collisions and ensuring clean multi-threaded execution.
 */
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  
  // CRITICAL FOR BULLMQ: Workers require this to be explicitly null to allow 
  // blocking connection listeners (BRPOPLPUSH) to operate without throwing errors.
  maxRetriesPerRequest: null,
};

module.exports = redisConfig;