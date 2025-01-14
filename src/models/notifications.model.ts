import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please provide a message"],
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Notifications = mongoose.model(
  "Notifications",
  notificationSchema,
  "notifications"
);

export default Notifications;
