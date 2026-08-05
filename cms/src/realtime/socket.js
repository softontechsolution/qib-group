let io;

function init(strapi) {
  const { Server } = require("socket.io");

  // Initialize Socket.io with robust CORS for local and production
  io = new Server(strapi.server.httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        process.env.FRONTEND_URL
      ].filter(Boolean), // Automatically ignores undefined .env variables
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    },
  });

  // Attach io to global strapi object just in case other services need it
  strapi.io = io;

  io.on("connection", (socket) => {
    strapi.log.info(`[Socket.io] Connected: ${socket.id}`);

    // Listen for frontend joining a specific policy room
    socket.on("join-policy", (registrationId) => {
      const roomName = String(registrationId);
      socket.join(roomName);
      strapi.log.info(`[Socket.io] Socket ${socket.id} joined room: ${roomName}`);
    });

    socket.on("disconnect", () => {
      strapi.log.info(`[Socket.io] Disconnected: ${socket.id}`);
    });
  });
}

function emitProgress(registrationId, payload) {
  if (!io) {
    console.warn("[Socket.io] io instance not initialized");
    return;
  }

  // Emits to the specific room your frontend joined
  io.to(String(registrationId)).emit("policy-progress", {
    registrationId,
    ...payload,
  });
}

module.exports = {
  init,
  emitProgress,
};