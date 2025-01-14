import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  file: {
    type: String,
    required: [true, "Please provide a file link"],
  },
  type: {
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

const Banners = mongoose.model("Banner", bannerSchema, "banners");

export default Banners;
