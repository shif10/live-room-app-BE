import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  startNotified: { type: Boolean, default: false }, 
  endNotified: { type: Boolean, default: false },
}, { timestamps: true });

export default model("Booking", bookingSchema);
