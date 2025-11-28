"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { authMiddleWare } from "../middleWare/auth.middleWare"
const rooms_controller_1 = require("../controllers/rooms.controller");
const auth_middleware_1 = require("../middleWare/auth.middleware");
const upload_middleware_1 = require("../middleWare/upload.middleware");
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.authMiddleWare, upload_middleware_1.upload.single("image"), rooms_controller_1.createRoom);
router.get("/list", auth_middleware_1.authMiddleWare, rooms_controller_1.getRooms);
router.put("/:id", auth_middleware_1.authMiddleWare, upload_middleware_1.upload.single("image"), rooms_controller_1.updateRoom);
router.delete("/:id", auth_middleware_1.authMiddleWare, rooms_controller_1.deleteRoom);
exports.default = router;
