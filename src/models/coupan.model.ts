import mongoose from "mongoose";

const coupanSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please provide a code"],
  },
  discountPer: {
    type: Number,
  },
  discountAmount: {
    type: Number,
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
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
});

const Coupan = mongoose.model("Coupan", coupanSchema, "coupans");

export default Coupan;
