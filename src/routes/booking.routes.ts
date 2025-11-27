import { Router } from "express";
import {
  bookRoom,
  cancelBooking,
  getBookingsByRoom,
} from "../controllers/booking.controller";
import { authMiddleWare } from "../middleWare/auth.middleware";

const router = Router();

router.post("/book", authMiddleWare, bookRoom);
router.post("/room/cancel", authMiddleWare, cancelBooking);
router.get("/room/:roomId", authMiddleWare, getBookingsByRoom);

export default router;
