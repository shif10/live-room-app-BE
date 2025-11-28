"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Room", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
    startNotified: { type: Boolean, default: false },
    endNotified: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Booking", bookingSchema);
