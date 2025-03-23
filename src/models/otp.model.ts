import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
  },
  email: {
    type: String,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
});

const OTP = mongoose.model("OTP", otpSchema, "otp");

export default OTP;
