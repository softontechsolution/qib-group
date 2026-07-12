'use strict';

/**
 * claim service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::claim.claim');
