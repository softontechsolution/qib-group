"use strict";

module.exports = {
  async run(registrationId, numbers) {
    try {
      // =====================================================
      // STEP 1 — FETCH REGISTRATION
      // =====================================================

      const registration = await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .findOne({
          where: { id: registrationId },
        });

      if (!registration) {
        throw new Error("Registration not found");
      }

      const policyNumber = numbers.policyNumber;
      const certificateNumber = numbers.certificateNumber;

      // =====================================================
      // STEP 2 — IDEMPOTENCY GUARD (IMPORTANT FIX)
      // =====================================================

      if (registration.paymentProcessed === true) {
        return {
          success: true,
          message: "Already fully processed",
          certificateUrl: registration.certificateUrl,
        };
      }

      // =====================================================
      // STEP 3 — GENERATE PDF (UPDATED SERVICE CALL)
      // =====================================================

      const pdfService = strapi.service(
        "api::pdf-generator.certificate"
      );

      const pdfResult =
        await pdfService.generateCertificate({
          registration,
          policyNumber,
          certificateNumber,
        });

      const certificateUrl = pdfResult.certificateUrl;

      // =====================================================
      // STEP 4 — UPDATE STRAPI (CORE STATE UPDATE)
      // =====================================================

      await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .update({
          where: { id: registrationId },
          data: {
            certificateUrl,
            policyNumber,
            certificateNumber,
            policyStatus: "active",
            paymentProcessed: true,
            paymentDate: new Date(),
          },
        });

      // =====================================================
      // STEP 5 — PUSH TO NPF API (UNCHANGED BUT SAFE)
      // =====================================================

      try {
        await fetch(
          "https://agency.npfinsurance.com/policy/api",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              CertificateNo: certificateNumber,
              PolicyNo: policyNumber,

              ChassisNo: registration.chassisNumber,
              ContactAddress: registration.address,

              Email: registration.email,
              GSMNo: registration.mobileNumber,

              InsuredName:
                registration.policyHolderFirstName
                  ? `${registration.policyHolderFirstName} ${registration.policyHolderMiddleName || ""} ${registration.policyHolderLastName || ""}`.trim()
                  : registration.companyPolicyHolderName ||
                    registration.companyName,

              Premium: registration.premium,

              RegistrationNo:
                registration.registrationNumber,

              SumAssured: registration.sumAssured,

              TypeOfCover:
                registration.coverType === "Comprehensive"
                  ? "C"
                  : "P",

              VehicleMake: registration.vehicleMake,
              VehicleModel: registration.vehicleModel,
              VehicleColor: registration.vehicleColor,
              VehicleType: registration.vehicleUse,

              YearofMake: registration.vehicleYear,
            }),
          }
        );
      } catch (npfError) {
        console.error("NPF PUSH FAILED:", npfError);
      }

      // =====================================================
      // STEP 6 — SEND EMAIL (UPDATED SERVICE PATH FIX)
      // =====================================================

      try {
        const emailService = strapi.service(
          "api::email.email"
        );

        await emailService.sendCertificate({
          registration,
          policyNumber,
          certificateNumber,
          certificateUrl,
        });
      } catch (emailError) {
        console.error("EMAIL FAILED:", emailError);
      }

      // =====================================================
      // STEP 7 — FINAL UPDATE (EMAIL STATUS)
      // =====================================================

      await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .update({
          where: { id: registrationId },
          data: {
            emailSent: true,
          },
        });

      // =====================================================
      // STEP 8 — RESPONSE
      // =====================================================

      return {
        success: true,
        certificateUrl,
        policyNumber,
        certificateNumber,
      };

    } catch (error) {
      console.error("PROCESSOR ERROR:", error);

      // =====================================================
      // SAFE FAILURE STATE
      // =====================================================

      await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .update({
          where: { id: registrationId },
          data: {
            policyStatus: "failed",
          },
        });

      throw error;
    }
  },
};