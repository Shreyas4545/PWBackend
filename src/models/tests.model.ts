import mongoose from "mongoose";

const testsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  testDescription: {
    type: String,
  },
  testStatus: {
    type: String,
  },
  status: {
    type: String,
  },
  testSeriesId: {
    type: mongoose.Types.ObjectId,
    ref: "testSeries",
  },
  noOfQuestions: {
    type: Number,
  },
  totalMarks: {
    type: Number,
  },
  totalDuration: {
    type: String,
  },
  sortingOrder: {
    type: Boolean,
  },
  allowPdfMaterialDownload: {
    type: Boolean,
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date(),
  },
  testMaterial: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const tests = mongoose.model("testsSchema", testsSchema, "testsschema");

export default tests;