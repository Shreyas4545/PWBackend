import Course from "../models/course.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";

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
  courseThumbnail: string;
  courseTrailer: string;
  courseDescription: string;
  learnings: string[];
  targetAudience: string[];
  requirements: string[];
  createdBy: string;
  featured: boolean;
  welcomeMsg: string;
  congratulationsMsg: string;
}

export const addCourse: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        subTitle,
        category,
        subCategory,
        topic,
        instructor,
        language,
        subtitleLanguage,
        courseDurations,
        courseLevels,
        courseThumbnail,
        courseTrailer,
        courseDescription,
        learnings,
        targetAudience,
        requirements,
        createdBy,
        featured,
        welcomeMsg,
        congratulationsMsg,
      }: {
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
        courseThumbnail: string;
        courseTrailer: string;
        courseDescription: string;
        learnings: string[];
        targetAudience: string[];
        requirements: string[];
        createdBy: string;
        featured: boolean;
        welcomeMsg: string;
        congratulationsMsg: string;
      } = req.body;

      const toStore: courseObj = {
        title,
        subTitle,
        category,
        subCategory,
        topic,
        instructor,
        language,
        subtitleLanguage,
        courseDurations,
        courseLevels,
        courseThumbnail,
        courseTrailer,
        courseDescription,
        learnings,
        targetAudience,
        requirements,
        createdBy,
        featured,
        welcomeMsg,
        congratulationsMsg,
      };

      console.log(toStore);

      const course = await Course.create(toStore);

      const response = sendSuccessApiResponse(
        "Course Added Successfully!",
        course
      );
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
    }
  }
);
