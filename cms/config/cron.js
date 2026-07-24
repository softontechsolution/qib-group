// cms/config/cron.js

module.exports = {
  // Runs every day at 8:00 AM WAT
  '0 8 * * *': async ({ strapi }) => {
    strapi.log.info('[Cron Job] Checking for expiring motor insurance policies...');

    try {
      // 1. Fetch all active registrations from your actual table
      const registrations = await strapi.entityService.findMany(
        'api::motor-insurance-registration.motor-insurance-registration',
        {
          filters: {
            policyStatus: 'active', // Using your exact field name
          },
        }
      );

      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      for (const reg of registrations) {
        if (!reg.paymentDate) continue;

        // 2. Calculate Expiry Date (Policy lasts exactly 1 year from paymentDate)
        // Robust hybrid date calculation:
        const startDate = new Date(reg.paymentDate || reg.createdAt || Date.now());
        const expiryDate = new Date(startDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        // 3. Check if expiry falls within the next 30 days and hasn't already expired
        if (expiryDate >= today && expiryDate <= thirtyDaysFromNow) {
          strapi.log.info(`[Cron] Policy ${reg.policyNumber || reg.id} is expiring on ${expiryDate.toISOString()}. Queuing reminder...`);

            // Example inside your cron.js or scheduled task runner
            const policyQueue = require('../src/queues/policy.queue');

            // 4. Push to your existing policy processing / notification queue
            // We use your existing queue architecture instead of creating a fake one
            await policyQueue.add('send-renewal-notification', {
            registrationId: reg.id,
            email: reg.email,
            policyNumber: reg.policyNumber,
            expiryDate: expiryDate.toISOString(),
            });
        
        }
      }

      strapi.log.info('[Cron Job] Policy expiration check completed successfully.');
    } catch (err) {
      strapi.log.error('[Cron Job] Error processing policy expirations:', err);
    }
  },
};