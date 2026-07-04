module.exports = ({ env }) => ({
  // ... your other plugins like upload, etc.
  
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 465),
        secure: true, // Required for Gmail's port 465 (SSL)
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('DEFAULT_EMAIL_FROM', 'no-reply@qibinsurance.com'),
        defaultReplyTo: env('DEFAULT_EMAIL_REPLY_TO', 'support@qibinsurance.com'),
      },
    },
  },
});