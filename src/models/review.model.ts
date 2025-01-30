import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a description"],
  },
  review: {
    type: String,
  },
  rating: {
    type: Number,
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  date: {
    type: Date,
    default: new Date(),
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Reviews = mongoose.model("Reviews", reviewSchema, "reviews");

export default Reviews;
