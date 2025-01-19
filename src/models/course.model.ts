import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: [40, "title should be under 40 characters."],
  },
  courseId: {
    type: String,
    required: [true, "Please provide a course id"],
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  subTitle: {
    type: String,
    required: [true, "Please provide a sub title"],
    maxlength: [40, "sub title should be under 40 characters."],
  },
  category: {
    type: String,
    required: [true, "Please provide category"],
    maxlength: [40, "category should be under 40 characters."],
  },
  subCategory: {
    type: String,
    required: [true, "Please provide a sub category"],
    maxlength: [40, "sub category should be under 40 characters."],
  },
  price: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  topic: {
    type: String,
    required: [true, "Please provide a topic"],
    maxlength: [40, "topic should be under 40 characters."],
  },
  instructor: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
  language: {
    type: String,
  },
  subtitleLanguage: {
    type: String,
  },
  courseDurations: {
    type: String,
  },
  courseLevels: {
    type: String,
  },
  courseThumbnail: {
    type: String,
  },
  courseTrailer: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  learnings: [
    {
      type: String,
    },
  ],
  targetAudience: [
    {
      type: String,
    },
  ],
  requirements: [
    {
      type: String,
    },
  ],
  isPaid: {
    type: Boolean,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  featured: {
    type: Boolean,
  },
  welcomeMsg: {
    type: String,
  },
  congratulationsMsg: {
    type: String,
  },
});

const Course = mongoose.model("Course", courseSchema, "course");

export default Course;
