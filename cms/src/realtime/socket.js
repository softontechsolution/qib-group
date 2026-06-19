let io;

function init(server) {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("join-policy", (registrationId) => {
      socket.join(String(registrationId));
    });
  });
}

function emitProgress(registrationId, payload) {
  if (!io) return;

  io.to(String(registrationId)).emit("policy-progress", {
    registrationId,
    ...payload,
  });
}

module.exports = {
  init,
  emitProgress,
};