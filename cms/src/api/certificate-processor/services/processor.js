"use strict";

const socket = require("../../../realtime/socket");

/**
 * MAP STRAPI FLOW STATUS
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
    case "failed":
      return "failed";
    default:
      return "processing";
  }
}

module.exports = {
  async run(registrationId, numbers) {
    const { policyNumber, certificateNumber } = numbers;

    // Resolve the exact database row to find the current documentId safely
    const baseRecord = await strapi.db
      .query("api::motor-insurance-registration.motor-insurance-registration")
      .findOne({ where: { id: registrationId } });

    if (!baseRecord) {
      throw new Error(`Registration ID ${registrationId} not found in database`);
    }

    const currentDocumentId = baseRecord.documentId;

    // Progress updater helper targeting the active draft
    const updateProgress = async (id, stage, percent, message, extra = {}) => {
      const flowStatus = mapFlowStatus(stage);

      await strapi.documents("api::motor-insurance-registration.motor-insurance-registration").update({
        documentId: currentDocumentId,
        status: "draft", // Keeps progress visible to the polling frontend
        data: {
          processingStage: stage,
          processingPercent: percent,
          processingMessage: message,
          flowStatus,
          ...extra,
        },
      });

      socket.emitProgress(id, { stage, progress: percent, message, flowStatus });
    };

    try {
      strapi.log.info(`[Processor] Starting process for RegID: ${registrationId} (${currentDocumentId})`);

      // =====================================================
      // STEP 1: FETCH REGISTRATION
      // =====================================================
      const registration = await strapi.documents("api::motor-insurance-registration.motor-insurance-registration").findOne({
        documentId: currentDocumentId,
        status: "draft",
      });

      await updateProgress(registrationId, "paid", 10, "Registration loaded");

      // =====================================================
      // STEP 2: IDEMPOTENCY CHECK
      // =====================================================
      if (registration.paymentProcessed === true) {
        strapi.log.info(`[Processor] RegID ${registrationId} is already processed. Skipping.`);
        await updateProgress(registrationId, "completed", 100, "Already processed");
        return { success: true, certificateUrl: registration.certificateUrl }; 
      }

      // =====================================================
      // STEP 3: PDF GENERATION
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
      await strapi.documents("api::motor-insurance-registration.motor-insurance-registration").update({
        documentId: currentDocumentId,
        status: "draft", 
        data: {
          certificateUrl,
          policyNumber,
          certificateNumber,
          paymentProcessed: true,
          policyStatus: "active",
        },
      });

      // =====================================================
      // STEP 5: NPF INTEGRATION
      // =====================================================
      await updateProgress(registrationId, "finalizing", 70, "Syncing with NPF");

      let npfSyncStatus = "pending";

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const npfUrl = process.env.NPF_API_URL || "https://agency.npfinsurance.com/policy/api";

        const response = await fetch(npfUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NPF_API_KEY}`
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
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`NPF API responded with status: ${response.status}`);
        }

        npfSyncStatus = "success";
        await updateProgress(registrationId, "finalizing", 85, "NPF sync completed", { 
          npfSyncStatus, 
          npfSyncError: null 
        });

      } catch (npfError) {
        strapi.log.error(`[Processor] NPF Sync Failed for RegID ${registrationId}: ${npfError.message}`);
        npfSyncStatus = "failed";
        await updateProgress(registrationId, "finalizing", 80, "NPF sync delayed, finalizing policy...", { 
          npfSyncStatus, 
          npfSyncError: npfError.message 
        });
      }

      // =====================================================
      // STEP 6: EMAIL DELIVERY (WITH STRICT TIMEOUT)
      // =====================================================
      await updateProgress(registrationId, "finalizing", 90, "Sending certificate email");
      
      let emailStatus = "pending";

      try {
        const emailService = strapi.service("api::email.certificate-email");
        
        const emailPromise = emailService.sendCertificate({
          registration,
          policyNumber,
          certificateNumber,
          certificateUrl,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Email server connection timed out")), 10000)
        );

        await Promise.race([emailPromise, timeoutPromise]);
        
        emailStatus = "success";
        await updateProgress(registrationId, "finalizing", 95, "Email sent", { 
          emailStatus, 
          emailSent: true, 
          emailError: null 
        });
      } catch (emailError) {
        strapi.log.error(`[Processor] Email Failed for RegID ${registrationId}: ${emailError.message}`);
        emailStatus = "failed";
        await updateProgress(registrationId, "finalizing", 95, "Email delivery failed", { 
          emailStatus, 
          emailSent: false, 
          emailError: emailError.message 
        });
      }

      // =====================================================
      // STEP 6.5: CREATE CUSTOMER VAULT ACCOUNT
      // =====================================================
      await updateProgress(registrationId, "finalizing", 98, "Setting up your account vault...");
      
      let customerAccountId = null;

      try {
        // 1. Check if user already exists
        const existingUser = await strapi.db.query("plugin::users-permissions.user").findOne({
          where: { email: registration.email }
        });

        if (existingUser) {
          customerAccountId = existingUser.id;
        } else {
          // 2. Fetch the default 'Authenticated' role ID
          const authRole = await strapi.db.query("plugin::users-permissions.role").findOne({
            where: { type: "authenticated" }
          });

          // 3. Generate a secure temporary password
          const crypto = require("crypto");
          const tempPassword = crypto.randomBytes(6).toString("hex");

          // 4. Create the User with Custom Fields
          const newUser = await strapi.entityService.create("plugin::users-permissions.user", {
            data: {
              username: registration.email,
              email: registration.email,
              password: tempPassword,
              confirmed: true,
              role: authRole ? authRole.id : null,
              // 👇 NEW: Passing the custom fields!
              // We grab the values directly from the 'registration' object 
              // that we fetched from the database in Step 1.
              firstName: registration.policyHolderFirstName,
              lastName: registration.policyHolderLastName,
              phoneNumber: registration.mobileNumber
            }
          });
          
          customerAccountId = newUser.id;
          strapi.log.info(`[Vault] Created new user account for ${registration.email}`);
          
          // 👇 NEW: Send the Welcome Email
          try {
            const emailService = strapi.service("api::email.certificate-email");
            const loginUrl = process.env.FRONTEND_LOGIN_URL || "http://localhost:3000/login";
            
            const welcomeEmailPromise = emailService.sendWelcomeEmail({
              email: registration.email,
              firstName: registration.policyHolderFirstName || "Valued Customer",
              tempPassword,
              loginUrl
            });

            // 5-second timeout so the UI doesn't hang if SMTP is slow
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Welcome email timed out")), 5000)
            );

            await Promise.race([welcomeEmailPromise, timeoutPromise]);
          } catch (welcomeEmailErr) {
            strapi.log.error(`[Vault] Welcome email failed for ${registration.email}: ${welcomeEmailErr.message}`);

            // 👇 FIX: Explicitly save the welcome email error string to Strapi
            await strapi.documents("api::motor-insurance-registration.motor-insurance-registration").update({
              documentId: currentDocumentId,
              status: "draft",
              data: {
                emailError: `Welcome Email Failed: ${welcomeEmailErr.message}`
              }
            });
            // Do not throw! The user still needs to see their success screen.
          }
        }

        // 5. Link the registration to the user account
        if (customerAccountId && currentDocumentId) {
          await strapi.documents("api::motor-insurance-registration.motor-insurance-registration").update({
            documentId: currentDocumentId,
            data: { user: customerAccountId }
          });
        }
      } catch (vaultError) {
        strapi.log.error(`[Vault Error] Failed to create account for RegID ${registrationId}: ${vaultError.message}`);
        // We do NOT throw here. If account creation fails, we still want to give them their policy!
      }

      // =====================================================
      // STEP 7: FINAL STATE & REVELATION
      // =====================================================
      await updateProgress(
        registrationId,
        "completed",
        100,
        "Policy completed successfully",
        {
          npfSyncStatus, 
          emailStatus,   
          emailSent: emailStatus === "success",
          certificateUrl, // 👈 CRITICAL: We pass the URL back to the frontend socket here
        }
      );

      await strapi.documents("api::motor-insurance-registration.motor-insurance-registration").publish({
        documentId: currentDocumentId,
      });

      return {
        success: true,
        certificateUrl,
        policyNumber,
        certificateNumber,
      };

    } catch (error) {
      strapi.log.error(`[Processor] FATAL ERROR for RegID ${registrationId}:`, error.message);
      await updateProgress(registrationId, "failed", 0, `Error: ${error.message}`);
      throw error; 
    }
  },
};