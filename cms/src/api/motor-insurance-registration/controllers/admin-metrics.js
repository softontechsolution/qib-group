// cms/src/api/motor-insurance-registration/controllers/admin-metrics.js

module.exports = {
  async getDashboardStats(ctx) {
    try {
      // 1. Fetch all motor insurance registrations from your actual database table
      const registrations = await strapi.entityService.findMany(
        'api::motor-insurance-registration.motor-insurance-registration',
        {
          populate: ['user'], // Populate related user details if linked
        }
      );

      // 2. Calculate real-time metrics
      let totalRevenue = 0;
      let activePoliciesCount = 0;
      let failedEmailsCount = 0;
      let failedNpfCount = 0;
      let expiringSoonCount = 0;

      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      registrations.forEach((registration) => {
        /** @type {any} */
        const reg = registration;

        // Safe revenue calculation using available financial fields
        const itemAmount = Number(reg.premium || reg.totalAmount || reg.amount || 0);
        if (reg.paymentStatus === 'paid' || itemAmount > 0) {
          totalRevenue += itemAmount;
        }

        // Count active policies
        if (reg.policyStatus === 'active') {
          activePoliciesCount++;

          // Check expiry window (1 year from paymentDate or createdAt)
          const startDate = new Date(reg.paymentDate || reg.createdAt);
          const expiryDate = new Date(startDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);

          if (expiryDate >= today && expiryDate <= thirtyDaysFromNow) {
            expiringSoonCount++;
          }
        }

        // Count failed email dispatches using your exact schema field
        if (reg.emailError) {
          failedEmailsCount++;
        }

        // Count failed NPF portal syncs using your exact schema fields
        if (reg.npfSyncError || reg.npfSyncStatus === 'failed') {
          failedNpfCount++;
        }
      });

      // 3. Return aggregated stats JSON to the Next.js frontend
      return ctx.send({
        success: true,
        stats: {
          totalRegistrations: registrations.length,
          activePolicies: activePoliciesCount,
          totalRevenue,
          failedEmails: failedEmailsCount,
          failedNpfSyncs: failedNpfCount,
          expiringSoon: expiringSoonCount,
        },
        registrations: registrations.map((registration) => {
          /** @type {any} */
          const r = registration;

          // Safely combine firstName and lastName into customerName
          const customerName = [r.firstName, r.lastName].filter(Boolean).join(' ') || r.user?.username || 'Guest Customer';
          const customerEmail = r.email || r.user?.email || 'N/A';
          const amount = Number(r.premium || r.totalAmount || r.amount || 0);

          return {
            id: r.id,
            documentId: r.documentId,
            policyNumber: r.policyNumber || `POL-${r.id}`,
            customerName,
            customerEmail,
            insurer: r.preferredInsurer || 'Leadway Assurance',
            amount,
            paymentStatus: r.paymentStatus || 'PENDING',
            processingStage: r.processingStage || 'DOCUMENT_VERIFICATION',
            policyStatus: r.policyStatus || 'pending',
            emailErrorLog: r.emailError || null,
            npfErrorLog: r.npfSyncError || null,
            createdAt: r.createdAt,
          };
        }),
      });

    } catch (err) {
      strapi.log.error('[Admin API] Failed to fetch dashboard metrics:', err);
      return ctx.internalServerError('Internal server error fetching admin stats');
    }
  },
};