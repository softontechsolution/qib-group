'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/paystack/webhook',
      handler: 'paystack-webhook.handleWebhook',
      config: {
        auth: false,
      },
    },
  ],
};