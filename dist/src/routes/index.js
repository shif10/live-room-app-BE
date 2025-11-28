"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = __importDefault(require("./authRoute"));
const room_routes_1 = __importDefault(require("./room.routes"));
const booking_routes_1 = __importDefault(require("./booking.routes"));
const router = (0, express_1.Router)();
router.use("/auth", authRoute_1.default);
router.use("/rooms", room_routes_1.default);
router.use("/booking", booking_routes_1.default);
exports.default = router;
