import mongoose from "mongoose";

const testSeriesPaymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
  },
  testSeriesId: {
    type: mongoose.Types.ObjectId,
    ref: "testSeries",
  },
});

const testSeriesPayment = mongoose.model(
  "testSeriesPayment",
  testSeriesPaymentSchema,
  "testSeriesPayment"
);

export default testSeriesPayment;
