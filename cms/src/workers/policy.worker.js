const { Worker } = require("bullmq");
const connection = require("../lib/redis");
const socket = require("../realtime/socket");

// Create the worker with enterprise configuration
const policyWorker = new Worker(
  "policy-processing",
  async (job) => {
    const { registrationId, policyNumber, certificateNumber } = job.data;

    // 1. Explicitly pull from global context to prevent ReferenceErrors
    let strapiInstance = global.strapi;
    
    // 🛡️ FIX: If Strapi is still booting up during a server restart, 
    // wait for up to 10 seconds for the global instance to become ready.
    if (!strapiInstance) {
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        strapiInstance = global.strapi;
        if (strapiInstance) break;
      }
    }
    
    if (!strapiInstance) {
      throw new Error("Strapi instance not available in worker context yet");
    }

    const processor = strapiInstance.service("api::certificate-processor.processor");

    try {
      // Safe logging check
      if (strapiInstance.log) {
        strapiInstance.log.info(`[Job ${job.id}] Processing policy for Reg: ${registrationId} (Attempt: ${job.attemptsMade})`);
      } else {
        console.log(`[Job ${job.id}] Processing policy for Reg: ${registrationId} (Attempt: ${job.attemptsMade})`);
      }

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
      // Prevent frontend freeze on error
      if (strapiInstance.log) {
        strapiInstance.log.error(`[Job ${job.id}] Failed to process policy for Reg: ${registrationId} - ${error.message}`);
      } else {
        console.error(`[Job ${job.id}] Failed to process policy for Reg: ${registrationId} - ${error.message}`);
      }

      // 🛑 NEW: Update the database instantly so the frontend HTTP polling detects the failure
      try {
        const regRecord = await strapiInstance.db
          .query("api::motor-insurance-registration.motor-insurance-registration")
          .findOne({ where: { id: registrationId } });

        if (regRecord && regRecord.documentId) {
          await strapiInstance.documents("api::motor-insurance-registration.motor-insurance-registration").update({
            documentId: regRecord.documentId,
            status: "draft",
            data: {
              processingStage: "failed",
              processingPercent: 0,
              processingMessage: error.message,
              flowStatus: "failed" // Triggers your frontend cancel/back option
            }
          });
        }
      } catch (dbUpdateError) {
        console.error("Failed to write failure state to DB:", dbUpdateError.message);
      }

      socket.emitProgress(registrationId, {
        stage: "failed",
        progress: job.attemptsMade >= job.opts.attempts ? 0 : 10,
        message: "We encountered a delay. Retrying your policy generation...",
        error: error.message,
      });

      throw error; 
    }
  },
  { 
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000
    }
  }
);

// =====================================================
// WORKER OBSERVABILITY & LIFECYCLE
// =====================================================

// Using standard console logs here guarantees no lifecycle-level ReferenceErrors
policyWorker.on("completed", (job) => {
  console.log(`✅ [Job ${job.id}] Successfully generated policy for RegID: ${job.data?.registrationId}`);
});

policyWorker.on("failed", (job, err) => {
  console.error(`❌ [Job ${job.id}] Worker Error - Job failed:`, err.message);
});

module.exports = policyWorker;