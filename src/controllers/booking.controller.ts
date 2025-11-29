import Booking from "../models/Booking";
import User from "../models/User";
import { getIO } from "../../socket";
import Room from "../models/Room";

export const bookRoom = async (req, res) => {
  try {
    const { roomId, userId, startTime, endTime } = req.body;
    const io = getIO();
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }


    const conflict = await Booking.findOne({
      roomId,
      startTime: { $lt: endTime }, 
      endTime: { $gt: startTime },
      status: "booked",
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Room already booked in this time slot",
      });
    }


    const booking = await Booking.create({
      roomId,
      userId,
      startTime: new Date(startTime), 
      endTime: new Date(endTime),
    });
   
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