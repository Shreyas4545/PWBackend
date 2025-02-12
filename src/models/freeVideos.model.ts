import mongoose from "mongoose";

const freeVideoSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  videoLink: {
    type: String,
  },
  thumbnailLink: {
    type: String,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const FreeVideos = mongoose.model("FreeVideos", freeVideoSchema, "freeVideos");

export default FreeVideos;
