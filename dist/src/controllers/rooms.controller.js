"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.getRooms = exports.createRoom = void 0;
const socket_1 = require("../../socket");
const Room_1 = __importDefault(require("../models/Room"));
const createRoom = async (req, res) => {
    var _a;
    try {
        const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
        const room = await Room_1.default.create(Object.assign(Object.assign({}, req.body), { imageUrl }));
        const io = (0, socket_1.getIO)();
        io.emit("room-created", room);
        res.status(200).json({ success: true, room });
    }
    catch (error) {
        console.log(error, "the");
        res.status(500).json({ success: false });
    }
};
exports.createRoom = createRoom;
const getRooms = async (req, res) => {
    const rooms = await Room_1.default.find();
    res.json({ success: true, rooms });
};
exports.getRooms = getRooms;
const updateRoom = async (req, res) => {
    var _a;
    try {
        let updateData = Object.assign({}, req.body);
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.location) {
            updateData.imageUrl = req.file.location;
        }
        const room = await Room_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true });
        const io = (0, socket_1.getIO)();
        io.emit("room-updated", room);
        res.json(room);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating room" });
    }
};
exports.updateRoom = updateRoom;
const deleteRoom = async (req, res) => {
    try {
        await Room_1.default.findByIdAndDelete(req.params.id);
        const io = (0, socket_1.getIO)();
        io.emit("room-deleted", { roomId: req.params.id });
        res.json({ message: "Room deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting room" });
    }
};
exports.deleteRoom = deleteRoom;
