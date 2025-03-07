import mongoose from "mongoose";

const studentResultSchema = new mongoose.Schema({
  studentId: {
    type: String, // Could be ObjectId if linking to a users collection
    required: true,
    index: true,
  },
  testId: {
    type: String,
    required: true,
    index: true,
  },
  answers: [
    {
      question: { type: String, required: true },
      type: { type: String }, // If 'type' is optional
      options: [
        {
          name: { type: String, required: true },
          image: { type: String },
        },
      ],
      image: { type: String },
      correctAns: { type: String, required: true },
      studentAnswer: { type: String, required: true },
    },
  ],
  totalScore: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export const StudentResult = mongoose.model(
  "StudentResult",
  studentResultSchema
);
