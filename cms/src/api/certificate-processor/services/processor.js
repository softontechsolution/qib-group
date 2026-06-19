"use strict";

const socket = require("../../../realtime/socket");

/**
 * MAP STRAPI FLOW STATUS (SOURCE OF TRUTH)
 */
function mapFlowStatus(stage) {
  switch (stage) {
    case "paid":
      return "processing";
    case "generating_policy":
    case "generating_certificate":
      return "generating";
    case "finalizing":
      return "processing";
    case "completed":
      return "completed";
    default:
      return "processing";
  }
}

/**
 * CENTRALIZED PROGRESS UPDATE FUNCTION
 */
async function updateProgress(registrationId, stage, percent, message, extra = {}) {
  const flowStatus = mapFlowStatus(stage);

  await strapi.db
    .query("api::motor-insurance-registration.motor-insurance-registration")
    .update({
      where: { id: registrationId },
      data: {
        processingStage: stage,
        processingPercent: percent,
        processingMessage: message,
        flowStatus,
        ...extra,
      },
    });

  socket.emitProgress(registrationId, {
    stage,
    progress: percent,
    message,
    flowStatus,
  });
}

module.exports = {
  async run(registrationId, numbers) {
    try {
      // =====================================================
      // STEP 1: FETCH REGISTRATION
      // =====================================================
      const registration = await strapi.db
        .query("api::motor-insurance-registration.motor-insurance-registration")
        .findOne({
          where: { id: registrationId },
        });

      if (!registration) {
        throw new Error(`Registration ID ${registrationId} not found`);
      }

      await updateProgress(registrationId, "paid", 10, "Registration loaded");

      const { policyNumber, certificateNumber } = numbers;

      // =====================================================
      // STEP 2: IDEMPOTENCY CHECK
      // =====================================================
      if (registration.paymentProcessed === true) {
        strapi.log.info(`[Processor] RegID ${registrationId} is already processed. Skipping.`);
        await updateProgress(registrationId, "completed", 100, "Already processed");
        
        // Return existing data so worker resolves safely
        return { success: true, certificateUrl: registration.certificateUrl }; 
      }

      // =====================================================
      // STEP 3: PDF GENERATION (HARD FAIL IF THIS BREAKS)
      // =====================================================
      await updateProgress(registrationId, "generating_policy", 25, "Preparing policy documents");

      const pdfService = strapi.service("api::pdf-generator.certificate");
      const pdfResult = await pdfService.generateCertificate({
        registration,
        policyNumber,
        certificateNumber,
      });

      const certificateUrl = pdfResult.certificateUrl;

      await updateProgress(registrationId, "generating_certificate", 45, "Certificate generated", { certificateUrl });

      // =====================================================
      // STEP 4: UPDATE STRAPI CORE RECORD
      // =====================================================
      await strapi.db
        .query("api::motor-insurance-registration.motor-insurance-registration")
        .update({
          where: { id: registrationId },
          data: {
            certificateUrl,
            policyNumber,
            certificateNumber,
            paymentProcessed: true,
            policyStatus: "active",
          },
        });

      // =====================================================
      // STEP 5: NPF INTEGRATION (SOFT FAIL WITH RETRY FLAGS)
      // =====================================================
      await updateProgress(registrationId, "finalizing", 70, "Syncing with NPF");

      let npfSyncStatus = "pending"; // Track this for the DB

      try {
        // ENTERPRISE FIX: AbortController prevents hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const npfUrl = process.env.NPF_API_URL || "https://agency.npfinsurance.com/policy/api";

        const response = await fetch(npfUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NPF_API_KEY}` // Usually required
          },
          body: JSON.stringify({
            CertificateNo: certificateNumber,
            PolicyNo: policyNumber,
            ChassisNo: registration.chassisNumber,
            ContactAddress: registration.address,
            Email: registration.email,
            GSMNo: registration.mobileNumber,
            InsuredName: registration.policyHolderFirstName
                ? `${registration.policyHolderFirstName} ${registration.policyHolderLastName}`.trim()
                : registration.companyPolicyHolderName,
            Premium: registration.premium,
            RegistrationNo: registration.registrationNumber,
            SumAssured: registration.sumAssured,
            TypeOfCover: registration.coverType === "Comprehensive" ? "C" : "P",
            VehicleMake: registration.vehicleMake,
            VehicleModel: registration.vehicleModel,
            VehicleColor: registration.vehicleColor,
            VehicleType: registration.vehicleUse,
            YearofMake: registration.vehicleYear,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`NPF API responded with status: ${response.status}`);
        }

        npfSyncStatus = "success";
        await updateProgress(registrationId, "finalizing", 85, "NPF sync completed");

      } catch (npfError) {
        strapi.log.error(`[Processor] NPF Sync Failed for RegID ${registrationId}:`, npfError.message);
        npfSyncStatus = "failed"; // Flag for manual/cron retry later
        
        await updateProgress(registrationId, "finalizing", 80, "NPF sync delayed, finalizing policy...");
      }

      // =====================================================
      // STEP 6: EMAIL DELIVERY (SOFT FAIL)
      // =====================================================
      await updateProgress(registrationId, "finalizing", 90, "Sending certificate email");
      
      let emailStatus = "pending";

      try {
        const emailService = strapi.service("api::email.email");
        await emailService.sendCertificate({
          registration,
          policyNumber,
          certificateNumber,
          certificateUrl,
        });
        emailStatus = "success";
      } catch (emailError) {
        strapi.log.error(`[Processor] Email Failed for RegID ${registrationId}:`, emailError.message);
        emailStatus = "failed";
      }

      // =====================================================
      // STEP 7: FINAL STATE (RECORDING ALL FLAGS)
      // =====================================================
      await updateProgress(
          registrationId,
          "completed",
          100,
          "Policy completed successfully",
          {
            npfSyncStatus, // The new Enum field you just created
            emailStatus,   // The new Enum field you just created
            emailSent: emailStatus === "success", // BACKWARDS COMPATIBILITY: Keeps your old boolean happy!
            processingStage: "completed",
          }
        );

      return {
        success: true,
        certificateUrl,
        policyNumber,
        certificateNumber,
      };

    } catch (error) {
      // If it fails at PDF generation (Hard Fail), we update to 0% and throw for BullMQ to retry
      strapi.log.error(`[Processor] FATAL ERROR for RegID ${registrationId}:`, error);

      await updateProgress(registrationId, "failed", 0, "Processing encountered a critical error");
      throw error; // Let the BullMQ worker catch it and handle the retry logic
    }
  },
};