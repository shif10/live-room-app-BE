
import mongoose, { model, Schema } from "mongoose";


const roomSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: false },  
    capacity: { type: Number, required: true },
    status: {
        type: String,
        enum: ["available", "occupied", "reserved", "maintenance"],
        default: "available",
      },
      currentBooking: { 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        until: Date,
      },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, 
  }, { timestamps: true });


export default model("Room",roomSchema)