const socket =
require("./realtime/socket");

module.exports = {
  register(){},

  bootstrap({
    strapi,
  }) {
    socket.init(
      strapi.server.httpServer
    );
  },
};