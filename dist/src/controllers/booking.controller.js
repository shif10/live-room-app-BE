"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsByRoom = exports.cancelBooking = exports.bookRoom = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const User_1 = __importDefault(require("../models/User"));
const socket_1 = require("../../socket");
const Room_1 = __importDefault(require("../models/Room"));
const bookRoom = async (req, res) => {
    try {
        const { roomId, userId, startTime, endTime } = req.body;
        const io = (0, socket_1.getIO)();
        // Fix: Missing await
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Check for time conflict
        const conflict = await Booking_1.default.findOne({
            roomId,
            startTime: { $lt: endTime }, // starts before end
            endTime: { $gt: startTime }, // ends after start
            status: "booked",
        });
        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Room already booked in this time slot",
            });
        }
        // Create booking
        const booking = await Booking_1.default.create(req.body);
        // 1️⃣ Check if booking starts now or in past → set room occupied immediately
        const now = new Date();
        if (new Date(startTime) <= now && now < new Date(endTime)) {
            const updatedRoom = await Room_1.default.findByIdAndUpdate(roomId, { status: "occupied" }, { new: true });
            if (updatedRoom) {
                io.emit("room-updated", { roomId: updatedRoom._id });
            }
        }
        // Send email
        // await sendEmail(
        //   user.email,
        //   "Room Booked Successfully",
        //   `<p>Your room booking is confirmed.</p>`
        // );
        // Emit socket event
        io.emit("booking-created", booking);
        res.json({ success: true, booking });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
exports.bookRoom = bookRoom;
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const updated = await Booking_1.default.findByIdAndUpdate(bookingId, { status: "cancelled" }, { new: true });
        const io = (0, socket_1.getIO)();
        io.emit("booking-cancelled", { bookingId });
        res.json({ success: true, booking: updated });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
exports.cancelBooking = cancelBooking;
const getBookingsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const now = new Date();
        const bookings = await Booking_1.default.find({
            roomId,
            startTime: { $gte: now },
        }).sort({ startTime: 1 });
        res.json({ success: true, bookings });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
exports.getBookingsByRoom = getBookingsByRoom;
