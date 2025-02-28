import testSeries from "../models/testSeries.model";
import testSections from "../models/testSections.model";
import Tests from "../models/tests.model";
import bigPromise from "../middlewares/bigPromise";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import mongoose from "mongoose";

export interface testSeriesObj {
  title: string;
  status: string;
  description: string;
  whatYoullGet: [string];
  isPaid: boolean;
  actualPrice?: number;
  discountedPrice?: number;
  sortBy: number;
  isEnabled: boolean;
  createdBy: string;
}

export interface testsObj {
  title: string; // Title of the test
  testDescription?: string; // Optional description of the test
  testStatus?: string; // Optional status of the test
  status?: string; // Optional general status
  testSeriesId?: string; // ObjectId as a string referencing the test series
  noOfQuestions?: number; // Optional number of questions
  totalMarks?: number; // Optional total marks for the test
  totalDuration?: string; // Optional duration of the test (e.g., "1h 30m")
  sortingOrder?: boolean; // Optional flag for sorting order
  allowPdfMaterialDownload?: boolean; // Optional flag for allowing PDF material download
  startDate?: Date; // Optional start date
  endDate?: Date; // Optional end date
  testMaterial?: string; // Optional path or URL to test material
  createdAt?: Date; // Optional creation timestamp
}

export interface testSectionObj {
  title: string; // Title of the test section
  status: string;
  negativeMarking?: boolean; // Optional flag for negative marking
  marksPerQuestion?: number; // Optional marks assigned per question
  testId?: any; // ObjectId as a string referencing the associated test
  questions?: {
    question: string; // The question text
    options: {
      name: string; // Option name
      image?: string; // Optional image for the option
    }[];
    image?: string; // Optional image for the question
    correctAns?: string; // Optional correct answer
  }[]; // Array of question objects
  isOptional?: boolean; // Optional flag if the section is optional
  isFixedTiming?: boolean; // Optional flag if the section has fixed timing
  createdAt?: Date; // Optional creation timestamp
}

export const addTestSeries: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      actualPrice,
      discountedPrice,
      sortBy,
      isEnabled,
      description,
      whatYoullGet,
      createdBy,
    }: {
      title: string;
      status: string;
      actualPrice: number;
      sortBy: number;
      description: string;
      discountedPrice: number;
      isEnabled: boolean;
      whatYoullGet: [string];
      createdBy: string;
    } = req.body;

    const addObj: testSeriesObj = {
      title,
      status: "ACTIVE",
      actualPrice,
      discountedPrice,
      sortBy,
      whatYoullGet,
      description,
      isEnabled,
      createdBy,
    };

    try {
      const newTestSeries = await testSeries.create(addObj);

      const response = sendSuccessApiResponse(
        "Test Series Added Successfully!",
        newTestSeries
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const updateTestSeries: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updatedTestSeries = await testSeries
        .findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        .catch((err) => {
          console.log(err);
          return next(createCustomError("Internal Server Error", 501));
        });
      const response = sendSuccessApiResponse(
        "Test Series Updated Successfully!",
        updatedTestSeries
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const addTests: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      testDescription,
      testStatus,
      status,
      testSeriesId,
      noOfQuestions,
      totalMarks,
      totalDuration,
      sortingOrder,
      allowPdfMaterialDownload,
      startDate,
      endDate,
      testMaterial,
      sections,
    }: {
      title: string; // Title of the test
      testDescription?: string; // Optional description of the test
      testStatus?: string; // Optional status of the test
      status?: string; // Optional general status
      testSeriesId?: string; // ObjectId as a string referencing the test series
      noOfQuestions?: number; // Optional number of questions
      totalMarks?: number; // Optional total marks for the test
      totalDuration?: string; // Optional duration of the test (e.g., "1h 30m")
      sortingOrder?: boolean; // Optional flag for sorting order
      allowPdfMaterialDownload?: boolean; // Optional flag for allowing PDF material download
      startDate?: Date; // Optional start date
      endDate?: Date; // Optional end date
      testMaterial?: string; // Optional path or URL to test material
      sections: any;
    } = req.body;

    const toAdd: testsObj = {
      title,
      testDescription,
      testStatus,
      status,
      testSeriesId,
      noOfQuestions,
      totalMarks,
      totalDuration,
      sortingOrder,
      allowPdfMaterialDownload,
      startDate,
      endDate,
      testMaterial,
      createdAt: new Date(),
    };

    try {
      const newTest = await Tests.create(toAdd);

      const testData: any[] = [];
      const sectionData: any[] = [];

      testData.push(newTest);

      for (let i of sections) {
        const sectionObj: testSectionObj = {
          title: i?.title,
          negativeMarking: i?.negativeMarking,
          marksPerQuestion: i?.marksPerQuestion,
          testId: newTest?._id,
          questions: i?.questions,
          createdAt: new Date(),
          status: "ACTIVE",
          isOptional: i?.isOptional,
          isFixedTiming: i.isFixedTiming,
        };

        try {
          const newSection = await testSections.create(sectionObj);
          sectionData.push(newSection);
        } catch (err) {
          console.log(err);
          return next(createCustomError("Internal Server Error", 501));
        }
      }

      const response = sendSuccessApiResponse("Test Added Successfully!", {
        testData: testData,
        sectionData: sectionData,
      });
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getTestSeries: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, title }: { id?: string; title?: string } = req.query;

      const matchConditions: any = {};

      if (id) matchConditions._id = new mongoose.Types.ObjectId(id);

      if (title) matchConditions.title = title;

      const data: any[] = await testSeries.aggregate([
        {
          $match: matchConditions,
        },
        {
          $lookup: {
            from: "tests",
            localField: "_id",
            foreignField: "testSeriesId",
            as: "tests",
          },
        },
        {
          $unwind: {
            path: "$tests",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "testsections",
            localField: "tests._id",
            foreignField: "testId",
            as: "tests.sections",
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "createdBy",
            foreignField: "_id",
            as: "creator",
          },
        },
        {
          $unwind: {
            path: "$creator",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            createdBy: {
              $first: {
                $concat: ["$creator.firstName", " ", "$creator.lastName"],
              },
            },
            createdAt: { $first: "$createdAt" },
            status: { $first: "$status" },
            price: { $first: "$price" },
            sortBy: { $first: "$sortBy" },
            isEnabled: { $first: "$isEnabled" },
            tests: {
              $push: {
                testTitle: "$tests.title",
                _id: "$tests._id",
                testDescription: "$tests.testDescription",
                testStatus: "$tests.testStatus",
                status: "$tests.status",
                noOfQuestions: "$tests.noOfQuestions",
                totalMarks: "$tests.totalMarks",
                totalDuration: "$tests.totalDuration",
                sortingOrder: "$tests.sortingOrder",
                allowPdfMaterialDownload: "$tests.allowPdfMaterialDownload",
                startDate: "$tests.startDate",
                endDate: "$tests.endDate",
                testMaterial: "$tests.testMaterial",
                createdAt: "$tests.createdAt",
                testSections: {
                  $map: {
                    input: "$tests.sections",
                    as: "testSection",
                    in: {
                      title: "$$testSection.title",
                      _id: "$$testSection._id",
                      negativeMarking: "$$testSection.negativeMarking",
                      marksPerQuestion: "$$testSection.marksPerQuestion",
                      questions: "$$testSection.questions",
                      isOptional: "$$testSection.isOptional",
                      isFixedTiming: "$$testSection.isFixedTiming",
                    },
                  },
                },
              },
            },
          },
        },
      ]);

      console.log(data?.length);
      const response = sendSuccessApiResponse(
        "Test Series get successfully!",
        data
      );
      res.status(200).send(response);
      return data;
    } catch (error) {
      console.error("Error generating next courseId:", error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getHomeTestSeries: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const obj: any = {};
      const { id }: { id?: string } = req.query;
      if (id) {
        const testSeriesId = new mongoose.Types.ObjectId(id);
        if (testSeriesId) obj._id = testSeriesId;
      }

      const result = await testSeries.aggregate([
        {
          $match: obj, // Match the specific test series
        },
        {
          $lookup: {
            from: "tests", // Reference the tests collection
            localField: "_id",
            foreignField: "testSeriesId",
            as: "tests",
          },
        },
        {
          $addFields: {
            numberOfTests: { $size: "$tests" }, // Count total tests in this series
            NoOfQuestions: { $max: "$tests.noOfQuestions" }, // Get max noOfQuestions
            TotalMarks: { $max: "$tests.totalMarks" }, // Get max totalMarks
          },
        },
        {
          $project: {
            _id: 1,
            actualPrice: 1,
            discountedPrice: 1,
            isEnabled: 1,
            sortBy: 1,
            isPaid: 1,
            title: 1,
            numberOfTests: 1,
            NoOfQuestions: 1,
            TotalMarks: 1,
            description: 1,
            whatYoullGet: 1,
          },
        },
      ]);

      result.sort((a, b) => b.createdAt - a.createdAt);
      if (result.length === 0) {
        return res.status(404).json({ message: "Test series not found" });
      }

      return res.status(200).json({
        message: "Success",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching test series data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export const getTests: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const obj: any = {};
      const { id }: { id?: string } = req.query;
      if (id) {
        const testSeriesId = new mongoose.Types.ObjectId(id);
        if (testSeriesId) obj.testSeriesId = testSeriesId;
      }

      const result = await Tests.aggregate([
        {
          $match: obj, // Match the specific test series
        },
        {
          $addFields: {
            title: "$title", // Count total tests in this series
            testDescription: "$testDescription", // Get max noOfQuestions
            startDate: "$startDate", // Get max totalMarks
            endDate: "$endDate",
            allowPdfMaterialDownload: "$allowPdfMaterialDownload",
          },
        },
        {
          $project: {
            title: 1,
            price: 1,
            testDescription: 1,
            startDate: 1,
            endDate: 1,
            allowPdfMaterialDownload: 1,
          },
        },
      ]);

      result.sort((a, b) => b.createdAt - a.createdAt);

      if (result.length === 0) {
        return res.status(404).json({ message: "Tests not found" });
      }

      return res.status(200).json({
        message: "Success",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching tests data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export const getTestSections: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const obj: any = {};
      const { id }: { id?: string } = req.query;
      if (id) {
        const testId = new mongoose.Types.ObjectId(id);
        if (testId) obj.testId = testId;
      }

      const result: any = await testSections
        .aggregate([
          {
            $match: obj,
          },
          {
            $project: {
              questions: "$questions",
              title: "$title",
              negativeMarking: "$negativeMarking",
              marksPerQuestion: "$marksPerQuestion",
              isOptional: "$isOptional",
              isFixedTiming: "$isFixedTiming",
            },
          },
        ])
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Internal server error" });
        });

      result.sort((a: any, b: any) => b.createdAt - a.createdAt);

      if (result.length === 0) {
        return res.status(404).json({ message: "Test Sections not found" });
      }

      return res.status(200).json({
        message: "Success",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching test section data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export const updateTests: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const updatedTests = await Tests.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
      ).catch((err) => {
        console.log(err);
        return next(createCustomError("Internal Server Error", 501));
      });
      const response = sendSuccessApiResponse(
        "Tests Updated Successfully!",
        updatedTests
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const updateTestSections: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const updatedSections = await testSections
        .findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        .catch((err) => {
          console.log(err);
          return next(createCustomError("Internal Server Error", 501));
        });
      const response = sendSuccessApiResponse(
        "Test Sections Updated Successfully!",
        updatedSections
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);
