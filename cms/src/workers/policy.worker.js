const { Worker } = require("bullmq");
const connection = require("../lib/redis");
const socket = require("../realtime/socket");

// Create the worker with enterprise configuration
const policyWorker = new Worker(
  "policy-processing",
  async (job) => {
    const { registrationId, policyNumber, certificateNumber } = job.data;

    // 1. Safe access to Strapi services at runtime
    if (!global.strapi) {
      throw new Error("Strapi instance not available in worker context");
    }
    const processor = strapi.service("api::certificate-processor.processor");

    try {
      // Log attempt number in case this is a retry
      strapi.log.info(`[Job ${job.id}] Processing policy for Reg: ${registrationId} (Attempt: ${job.attemptsMade})`);

      // STEP 1: Notify frontend
      socket.emitProgress(registrationId, {
        stage: "generating_policy",
        progress: 10,
        message: "Starting policy generation...",
      });

      // STEP 2: Execute the heavy lifting
      await processor.run(registrationId, {
        policyNumber,
        certificateNumber,
      });

      // FINAL: Notify frontend of success
      socket.emitProgress(registrationId, {
        stage: "completed",
        progress: 100,
        message: "Policy completed successfully",
      });

      return { success: true, registrationId };

    } catch (error) {
      // 🚨 ERROR HANDLING: Prevent frontend freeze
      strapi.log.error(`[Job ${job.id}] Failed to process policy for Reg: ${registrationId} - ${error.message}`);

      socket.emitProgress(registrationId, {
        stage: "failed",
        progress: job.attemptsMade >= job.opts.attempts ? 0 : 10, // Drop to 0 if we are out of retries
        message: "We encountered a delay. Retrying your policy generation...",
        error: error.message,
      });

      // CRITICAL: We MUST throw the error again so BullMQ knows the job failed 
      // and can trigger the automatic retry mechanism.
      throw error; 
    }
  },
  { 
    connection,
    concurrency: 5, // Process up to 5 policies simultaneously
    limiter: {
      max: 10,      // Rate limiting: Don't exceed 10 jobs...
      duration: 1000 // ...per second (protects NPF's API from being DDOSed by your server)
    }
  }
);

// =====================================================
// WORKER OBSERVABILITY & LIFECYCLE
// =====================================================

policyWorker.on("completed", (job) => {
  strapi.log.info(`✅ [Job ${job.id}] Successfully generated policy for RegID: ${job.data.registrationId}`);
});

policyWorker.on("failed", (job, err) => {
  // If it fails after all retries, you could trigger an email to the admin/dev team here
  strapi.log.error(`❌ [Job ${job.id}] has permanently failed with error: ${err.message}`);
});

module.exports = policyWorker;