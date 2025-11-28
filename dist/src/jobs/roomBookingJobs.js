"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const Booking_1 = __importDefault(require("../models/Booking"));
const socket_1 = require("../../socket");
const Room_1 = __importDefault(require("../models/Room"));
const moment_1 = __importDefault(require("moment"));
node_cron_1.default.schedule("* * * * *", async () => {
    const now = new Date();
    const oneMinuteAgo = (0, moment_1.default)(now).subtract(1, "minutes").toDate();
    const io = (0, socket_1.getIO)();
    try {
        const startBookings = await Booking_1.default.find({
            status: "booked",
            startTime: { $lte: now },
            endTime: { $gt: now }
        });
        for (const booking of startBookings) {
            const room = await Room_1.default.findByIdAndUpdate(booking.roomId, { status: "occupied" }, { new: true });
            if (room)
                io.emit("room-updated", room);
        }
        const endingBookings = await Booking_1.default.find({
            status: "booked",
            endTime: { $lte: now, $gt: oneMinuteAgo }
        });
        for (const booking of endingBookings) {
            const room = await Room_1.default.findByIdAndUpdate(booking.roomId, { status: "available" }, { new: true });
            if (room)
                io.emit("room-updated", room);
        }
    }
    catch (error) {
        console.error("Cron job error:", error);
    }
});
