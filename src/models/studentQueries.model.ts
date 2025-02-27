import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  image: {
    type: String,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
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

const Queries = mongoose.model("Queries", querySchema, "queries");

export default Queries;
