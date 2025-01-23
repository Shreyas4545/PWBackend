import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please provide a message"],
  },
  to: {
    type: String,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
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
