module.exports = ({ env }) => ({
  // ... your other plugins like upload, etc.
  
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'sandbox.smtp.mailtrap.io'),
        port: env.int('SMTP_PORT', 2525),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: 'no-reply@qibinsurance.com',
        defaultReplyTo: 'support@qibinsurance.com',
      },
    },
  },
});