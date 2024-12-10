import Course from "../models/course.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";

interface courseObj {
  title: string;
  subTitle: string;
  category: string;
  subCategory: string;
  topic: string;
  instructor: string[];
  language: string;
  subtitleLanguage: string;
  courseDurations: string;
  courseLevels: string;
  featured: boolean;
  createdBy: string;
}

interface courseUpdateObj {
  courseThumbnail: string;
  welcomeMsg: string;
  congratulationsMsg: string;
  courseTrailer: string;
  courseDescription: string;
  learnings: string[];
  targetAudience: string[];
  requirements: string[];
}

export const addCourse: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        instructor,
        title,
        subTitle,
        category,
        subCategory,
        topic,
        language,
        createdBy,
        subtitleLanguage,
        courseDurations,
        featured,
        courseLevels,
      }: {
        title: string;
        subTitle: string;
        instructor: string[];
        category: string;
        subCategory: string;
        topic: string;
        language: string;
        createdBy: string;
        featured: boolean;
        subtitleLanguage: string;
        courseDurations: string;
        courseLevels: string;
      } = req.body;

      const toStore: courseObj = {
        title,
        subTitle,
        category,
        subCategory,
        instructor,
        topic,
        language,
        subtitleLanguage,
        courseDurations,
        courseLevels,
        createdBy,
        featured,
      };

      const course = await Course.create(toStore);

      const response = sendSuccessApiResponse(
        "Course Added Successfully!",
        course
      );
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const updateCourse: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      courseThumbnail,
      courseTrailer,
      courseDescription,
      learnings,
      targetAudience,
      requirements,
      welcomeMsg,
      congratulationsMsg,
    }: {
      courseThumbnail: string;
      courseTrailer: string;
      courseDescription: string;
      learnings: string[];
      targetAudience: string[];
      requirements: string[];
      welcomeMsg: string;
      congratulationsMsg: string;
    } = req.body;

    const id = req.params.id as string | undefined;

    const toUpdate: courseUpdateObj = {
      courseThumbnail,
      courseTrailer,
      courseDescription,
      learnings,
      targetAudience,
      requirements,
      welcomeMsg,
      congratulationsMsg,
    };

    await Course.findOneAndUpdate({ _id: id }, toUpdate, { new: true })
      .exec()
      .then((data) => {
        const response = sendSuccessApiResponse(
          "Course Updated Successfully!",
          data
        );
        res.status(200).send(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

function generateRandomPrefix() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26))
  );
}

export const getCourseId: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch the document with the highest courseId numerically
      const latestCourse = await Course.findOne({})
        .sort({ courseId: -1 }) // Sort by courseId descending
        .exec();

      const randomPrefix = generateRandomPrefix();

      // Default to "AB100" if no courseId exists
      if (!latestCourse) {
        const response = sendSuccessApiResponse(
          "Course Id Sent Successfully!",
          `${randomPrefix}101`
        );
        return response;
      }

      // Extract the prefix and numeric part from the latest courseId
      const courseId = latestCourse.courseId; // e.g., "AB100"
      const prefix = courseId?.slice(0, 2); // "AB"
      const numericPart = parseInt(courseId.slice(2)); // 100

      // Increment the numeric part by 1
      const nextNumericPart = numericPart + 1;

      // Pad the numeric part with leading zeros if necessary (3 digits)
      const newCourseId = `${randomPrefix}${nextNumericPart
        .toString()
        .padStart(3, "0")}`;

      const response = sendSuccessApiResponse(
        "Course Id Sent Successfully!",
        newCourseId
      );
      console.log(response);
      return res.status(200).send(response);
    } catch (error) {
      console.error("Error generating next courseId:", error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);
