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
      question: String,
      type: String,
      options: [
        {
          name: String,
          image: String,
        },
      ],
      image: String,
      correctAns: String,
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
