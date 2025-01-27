import mongoose from "mongoose";

const LiveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects",
    default: null,
  },
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lectures",
    default: null, // Nullable, as not all live classes might belong to a specific lecture
  },
  googleMeetLink: {
    type: String,
    required: true, // Store the Google Meet link
  },
  startTime: {
    type: Date,
    required: true, // Start time of the live class
  },
  endTime: {
    type: Date,
    required: true, // End time of the live class
  },
  createdAt: {
    type: Date,
    required: true, // End time of the live class
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there's a user schema for instructors or admins
    required: true,
  },
  courseCategory: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true, // Indicates whether the live class is active or not
  },
});

const LiveClass = mongoose.model("LiveClass", LiveClassSchema, "liveclass");

export default LiveClass;
