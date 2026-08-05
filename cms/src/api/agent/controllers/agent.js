const crypto = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = {
  async registerAgent(ctx) {
    const reqId = crypto.randomBytes(2).toString('hex');
    strapi.log.info(`[Agent Registration | ${reqId}] Initiating backend process...`);

    try {
      // 1. Destructure the new name fields
      const { email, username, password, firstName, lastName, middleName, phoneNumber, agentType, agentId } = ctx.request.body;

      // 1. Check existing
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { $or: [{ email }, { username }] }
      });

      if (existingUser) {
        return ctx.badRequest('An account with this email or username already exists.');
      }

      // 2. Get the default 'Authenticated' role ID
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      // 3. IMPORTANT: Use the User Permissions Service to ADD the user
      // This automatically triggers the bcrypt password hashing!
      const userService = strapi.plugin('users-permissions').service('user');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await strapi.db.query('plugin::users-permissions.user').create({
        data: {
            email,
            username,
            password: hashedPassword,
            role: role.id,
            confirmed: false,
            confirmationToken: crypto.randomBytes(20).toString('hex'),
            provider: 'local',
            firstName,
            lastName,
            middleName,
            phoneNumber,
            agentType,
            agentId,
            isAgent: true,
            commissionBalance: 0,
        }
      });

      strapi.log.info(`[Agent Registration | ${reqId}] User created via Service (ID: ${newUser.id}).`);

      // 4. Update Email Template with the new First Name
      // Cast the config result to a string so TypeScript knows it has the .endsWith() method
      const rawUrl = strapi.config.get('server.url') || 'http://localhost:1337';

     // This template literal approach is robust and avoids needing .endsWith() entirely
     const confirmLink = `${rawUrl.toString().replace(/\/$/, "")}/api/auth/email-confirmation?confirmation=${newUser.confirmationToken}`;
      
      const emailHtml = `
        <h2>Welcome to the QIB Partner Network, ${firstName}!</h2>
        <p>Your application as a ${agentType} has been received.</p>
        <p><strong>Your Unique Agent ID is: ${agentId}</strong></p>
        <br>
        <p>To activate your account, click the link below:</p>
        <a href="${confirmLink}" style="display: inline-block; background-color: #0096c7; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
              Verify My Account
        </a>
      `;

      await strapi.plugin('email').service('email').send({
        to: email,
        subject: 'Action Required: Confirm your QIB Agent Account',
        html: emailHtml,
      });

      strapi.log.info(`[Agent Registration | ${reqId}] Process complete.`);
      return ctx.send({ message: 'Registration successful.' });

    } catch (err) {
      strapi.log.error(`[Agent Registration | ${reqId}] FATAL ERROR:`, err);
      return ctx.internalServerError('Registration failed.');
    }
  }
};