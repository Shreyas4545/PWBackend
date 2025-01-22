import mongoose from "mongoose";

const testSectionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  negativeMarking: {
    type: Boolean,
  },
  marksPerQuestion: {
    type: Number,
  },
  testId: {
    type: mongoose.Types.ObjectId,
    ref: "tests",
  },
  questions: [
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
    },
  ],
  isOptional: {
    type: Boolean,
  },
  isFixedTiming: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const testSections = mongoose.model(
  "testSections",
  testSectionsSchema,
  "testsections"
);

export default testSections;
