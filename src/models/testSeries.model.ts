import mongoose from "mongoose";

const testSeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  status: {
    type: String,
  },
  description: {
    type: String,
  },
  actualPrice: {
    type: Number,
  },
  discountedPrice: {
    type: Number,
  },
  whatYoullGet: {
    type: [String],
  },
  sortBy: {
    type: Number,
  },
  isEnabled: {
    type: Boolean,
  },
  isPaid: {
    type: Boolean,
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

const testSeries = mongoose.model("testSeries", testSeriesSchema, "testseries");

export default testSeries;
