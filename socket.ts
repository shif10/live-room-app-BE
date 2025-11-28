import jwt from "jsonwebtoken";
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          "http://localhost:5173",
        ];
  
        // allow all Amplify subdomains
        if (origin && origin.endsWith(".amplifyapp.com")) {
          return callback(null, true);
        }
  
        // allow localhost or no-origin (mobile/native/testing)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
  
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
  });
  

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication Error"));
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;

      next();
    } catch (error) {}
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
