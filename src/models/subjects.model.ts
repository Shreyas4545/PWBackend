import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Courses",
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

const Subjects = mongoose.model("Subjects", subjectSchema, "subjects");

export default Subjects;
