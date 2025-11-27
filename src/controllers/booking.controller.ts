import Booking from "../models/Booking";
import User from "../models/User";
import { getIO } from "../../socket";
import Room from "../models/Room";

export const bookRoom = async (req, res) => {
  try {
    const { roomId, userId, startTime, endTime } = req.body;
    const io = getIO();
    // Fix: Missing await
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check for time conflict
    const conflict = await Booking.findOne({
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
    const booking = await Booking.create(req.body);
    // 1️⃣ Check if booking starts now or in past → set room occupied immediately
    const now = new Date();
    if (new Date(startTime) <= now && now < new Date(endTime)) {
      const updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        { status: "occupied" },
        { new: true }
      );
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

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );

    const io = getIO();
    io.emit("booking-cancelled", { bookingId });

    res.json({ success: true, booking: updated });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


export const getBookingsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const now = new Date(); 

    const bookings = await Booking.find({
      roomId,
      startTime: { $gte: now },
    }).sort({ startTime: 1 }); 

    res.json({ success: true, bookings });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};