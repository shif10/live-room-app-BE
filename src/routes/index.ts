import { Router } from "express";
import authRoutes from "./authRoute";
import roomsRoute from "./room.routes";
import bookingRoute from "./booking.routes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/rooms", roomsRoute);
router.use("/booking", bookingRoute);

export default router;
