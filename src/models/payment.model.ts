import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
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
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
});

const Payment = mongoose.model("Payment", paymentSchema, "payments");

export default Payment;
