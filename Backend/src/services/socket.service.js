import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join room by user ID
    socket.on("join-room", (userId) => {
      socket.join(userId);
    });

    // Join staff room
    socket.on("join-staff-room", () => {
      socket.join("staff-room");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
