'use strict';

/**
 * login-page service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::login-page.login-page');
