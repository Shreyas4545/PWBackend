import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  subject_id: {
    type: mongoose.Types.ObjectId,
    ref: "Subjects",
  },
  notes: {
    type: String,
  },
  description: {
    type: String,
  },
  video: {
    type: [String],
  },
  file: {
    type: String,
  },
  captions: {
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
});

const Lectures = mongoose.model("Lectures", lectureSchema, "lectures");

export default Lectures;
