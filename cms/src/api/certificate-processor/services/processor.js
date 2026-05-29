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
          where: {
            id: registrationId,
          },
        });

      if (!registration) {
        throw new Error("Registration not found");
      }

      // =====================================================
      // STEP 2 — PREVENT DUPLICATE PROCESSING
      // =====================================================

      if (registration.status === "completed") {
        return {
          success: true,
          message: "Already processed",
        };
      }

      // =====================================================
      // STEP 3 — GENERATE PDF
      // =====================================================

      const pdfService = strapi.service(
        "api::pdf-generator.certificate"
      );

      const pdfResult =
        await pdfService.generateCertificate({
          registration,
          policyNumber: numbers.policyNumber,
          certificateNumber:
            numbers.certificateNumber,
        });

      // =====================================================
      // STEP 4 — BUILD CERTIFICATE URL
      // =====================================================

      const certificateUrl =
        pdfResult.certificateUrl;

      // =====================================================
      // STEP 5 — UPDATE STRAPI
      // =====================================================

      await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .update({
          where: {
            id: registrationId,
          },
          data: {
            certificateUrl,
            policyStatus: "active",
            status: "issued",
            issuedAt: new Date(),
          },
        });

      // =====================================================
      // STEP 6 — PUSH TO NPF API
      // =====================================================

      try {
        await fetch(
          "https://agency.npfinsurance.com/policy/api",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              CertificateNo:
                numbers.certificateNumber,

              PolicyNo:
                numbers.policyNumber,

              ChassisNo:
                registration.chassisNumber,

              ContactAddress:
                registration.address,

              Email: registration.email,

              GSMNo:
                registration.mobileNumber,

              InsuredName:
                `${registration.firstName} ${registration.lastName}`,

              Premium:
                registration.premium,

              RegistrationNo:
                registration.registrationNumber,

              SumAssured:
                registration.sumAssured,

              TypeOfCover:
                registration.coverType ===
                "Comprehensive"
                  ? "C"
                  : "P",

              VehicleMake:
                registration.vehicleMake,

              VehicleModel:
                registration.vehicleModel,

              VehicleColor:
                registration.vehicleColor,

              VehicleType:
                registration.vehicleUse,

              YearofMake:
                registration.vehicleYear,
            }),
          }
        );
      } catch (npfError) {
        console.error(
          "NPF PUSH FAILED:",
          npfError
        );
      }

      // =====================================================
      // STEP 7 — SEND EMAIL
      // =====================================================

      try {
        const emailService = strapi.service(
          "api::email.certificate-email"
        );

        await emailService.sendCertificate({
          registration,
          policyNumber:
            numbers.policyNumber,

          certificateNumber:
            numbers.certificateNumber,

          certificateUrl,
        });
      } catch (emailError) {
        console.error(
          "EMAIL FAILED:",
          emailError
        );
      }

      // =====================================================
      // STEP 8 — FINAL UPDATE
      // =====================================================

      await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .update({
          where: {
            id: registrationId,
          },
          data: {
            status: "completed",
            processedAt: new Date(),
          },
        });

      // =====================================================
      // STEP 9 — SUCCESS
      // =====================================================

      return {
        success: true,
        certificateUrl,
      };
    } catch (error) {
      console.error(
        "PROCESSOR ERROR:",
        error
      );

      // =====================================================
      // MARK FAILED
      // =====================================================

      await strapi.db
        .query(
          "api::motor-insurance-registration.motor-insurance-registration"
        )
        .update({
          where: {
            id: registrationId,
          },
          data: {
            status: "failed",
          },
        });

      throw error;
    }
  },
};