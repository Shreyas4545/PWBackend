import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  subjectId: {
    type: mongoose.Types.ObjectId,
    ref: "Subjects",
  },
  notes: {
    type: [String],
  },
  test: {
    type: [String],
  },
  video: {
    type: [String],
  },
  dpp: {
    type: [String],
  },
  assignment: {
    type: [String],
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
