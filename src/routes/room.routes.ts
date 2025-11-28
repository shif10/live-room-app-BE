import { Router } from "express";
// import { authMiddleWare } from "../middleWare/auth.middleWare"
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from "../controllers/rooms.controller";
import { authMiddleWare } from "../middleWare/auth.middleware";
import { upload } from "../middleWare/upload.middleware";
const router = Router();

router.post("/create", authMiddleWare, upload.single("image"), createRoom);
router.get("/list", authMiddleWare, getRooms);
router.get("/:id", authMiddleWare, getRoom);
router.put("/:id", authMiddleWare, upload.single("image"), updateRoom);
router.delete("/:id", authMiddleWare, deleteRoom);

export default router;
