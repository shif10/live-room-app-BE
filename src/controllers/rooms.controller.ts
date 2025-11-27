import { getIO } from "../../socket";
import Room from "../models/Room";

export const createRoom = async (req, res) => {
  try {

    const imageUrl=req.file?.location
    const room = await Room.create({...req.body,imageUrl});
    const io = getIO();
    io.emit("room-created", room)
    res.status(200).json({ success: true, room });
  } catch (error) {
    console.log(error,"the");
    res.status(500).json({ success: false });
  }
};


export const getRooms = async (req, res) => {
  
    const rooms = await Room.find();
    
    res.json({ success: true, rooms });
  };

  export const updateRoom = async (req, res) => {
    try {
      let updateData = { ...req.body };

      if (req.file?.location) {
        updateData.imageUrl = req.file.location;
      }
     
      const room = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true });
      const io=getIO()
      io.emit("room-updated",room)
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Error updating room" });
    }
  };


  export const deleteRoom = async (req, res) => {
    try {
      await Room.findByIdAndDelete(req.params.id);
      const io = getIO();
      io.emit("room-deleted",{roomId:req.params.id})
      res.json({ message: "Room deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting room" });
    }
  };