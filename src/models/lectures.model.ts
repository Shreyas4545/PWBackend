import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  subjectId: {
    type: mongoose.Types.ObjectId,
    ref: "Subjects",
  },
  notes: {
    type: [
      {
        name: String,
        link: String,
      },
    ],
  },
  test: {
    type: [
      {
        name: String,
        link: String,
      },
    ],
  },
  video: {
    type: [
      {
        name: String,
        link: String,
      },
    ],
  },
  dpp: {
    type: [
      {
        name: String,
        link: String,
      },
    ],
  },
  assignment: {
    type: [
      {
        name: String,
        link: String,
      },
    ],
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
