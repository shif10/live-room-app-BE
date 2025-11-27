import cron from "node-cron";
import Booking from "../models/Booking";
import { getIO } from "../../socket";
import Room from "../models/Room";
import moment from "moment";

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const oneMinuteAgo = moment(now).subtract(1, "minutes").toDate();
  const io = getIO();

  try {
  
    const startBookings = await Booking.find({
      status: "booked",
      startTime: { $lte: now },
      endTime: { $gt: now }
    });

    for (const booking of startBookings) {
      const room = await Room.findByIdAndUpdate(
        booking.roomId,
        { status: "occupied" },
        { new: true }
      );
      if (room) io.emit("room-updated", room);
    }

   
    const endingBookings = await Booking.find({
      status: "booked",
      endTime: { $lte: now, $gt: oneMinuteAgo }
    });

    for (const booking of endingBookings) {
      const room = await Room.findByIdAndUpdate(
        booking.roomId,
        { status: "available" },
        { new: true }
      );
      if (room) io.emit("room-updated", room);
    }

  } catch (error) {
    console.error("Cron job error:", error);
  }
});
