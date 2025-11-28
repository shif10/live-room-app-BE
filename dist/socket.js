"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
        var _a;
        const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            return next(new Error("Authentication Error"));
        }
        try {
            const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.user = user;
            next();
        }
        catch (error) { }
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
