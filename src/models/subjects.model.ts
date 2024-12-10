import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  course_id: {
    type: mongoose.Types.ObjectId,
    ref: "Subjects",
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
