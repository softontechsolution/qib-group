module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/agent/register',
      handler: 'agent.registerAgent',
      config: {
        auth: false, // Anyone can hit this route to register
      },
    },
  ],
};