import mongoose from "mongoose";

const testSeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  status: {
    type: String,
  },
  price: {
    type: Number,
  },
  sortBy: {
    type: Number,
  },
  isEnabled: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const testSeries = mongoose.model("testSeries", testSeriesSchema, "testseries");

export default testSeries;
