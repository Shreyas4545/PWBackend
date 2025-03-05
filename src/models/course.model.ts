import mongoose from "mongoose";

//Faq schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please provide a question"],
    maxlength: [120, "Question should be under 120 characters."],
  },
  answer: {
    type: String,
    required: [true, "Please provide an answer"],
    maxlength: [120, "Answer should be under 120 characters."],
  },
});

// Course schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: [40, "Title should be under 40 characters."],
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
    default: Date.now, // Using Date.now to avoid creating a new instance
  },
  subTitle: {
    type: String,
    required: [true, "Please provide a subtitle"],
    maxlength: [40, "Subtitle should be under 40 characters."],
  },
  category: {
    type: String,
    required: [true, "Please provide category"],
    maxlength: [40, "Category should be under 40 characters."],
  },
  subCategory: {
    type: String,
    required: [true, "Please provide a subcategory"],
    maxlength: [40, "Subcategory should be under 40 characters."],
  },
  actualPrice: {
    type: Number,
  },
  discountedPrice: {
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
    maxlength: [40, "Topic should be under 40 characters."],
  },
  instructor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  schedule: [ //ritwik
    {
      type: String,
    },
  ],
  whatYouWillGet: [
    {
      type: String,
    },
  ],
  faq: [faqSchema],
  isPaid: {
    type: Boolean,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
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
