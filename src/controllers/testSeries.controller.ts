import testSeries from "../models/testSeries.model";
import testSections from "../models/testSections.model";
import Tests from "../models/tests.model";
import bigPromise from "../middlewares/bigPromise";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import test from "node:test";

export interface testSeriesObj {
  title: string;
  status: string;
  price: number;
  sortBy: number;
  isEnabled: boolean;
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
      price,
      sortBy,
      isEnabled,
    }: {
      title: string;
      status: string;
      price: number;
      sortBy: number;
      isEnabled: boolean;
    } = req.body;

    const addObj: testSeriesObj = {
      title,
      status: "ACTIVE",
      price,
      sortBy,
      isEnabled,
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
          isOptional: i?.isOptional,
          isFixedTiming: i.isFixedTiming,
        };

        try {
          await testSections.create(sectionObj);
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
    console.log("he");
  }
);
