module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/system-counter/next',
      handler: 'system-counter.next',
      config: {
        auth: false,
      },
    },
  ],
};