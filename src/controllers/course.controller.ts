import Course from "../models/course.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { calendar_v3 } from "googleapis/build/src/apis/calendar";
import mongoose from "mongoose";
import LiveClass from "../models/liveClass.model";

interface courseObj {
  title: string;
  subTitle: string;
  category: string;
  subCategory: string;
  topic: string;
  instructor: string[];
  status: string;
  language: string;
  subtitleLanguage: string;
  courseId: string;
  courseDurations: string;
  courseLevels: string;
  featured: boolean;
  createdBy: string;
  createdAt: Date;
  startDate?: Date;
  price?: number;
}

export interface ILiveClass {
  title?: string; // Title of the live class
  createdAt: Date;
  courseCategory: string;
  description?: string; // Description of the live class
  courseId?: string; // Reference to the Courses collection (MongoDB ObjectId as string)
  subjectId?: string; // Reference to the Subjects collection (MongoDB ObjectId as string)
  lectureId?: string | null; // Reference to the Lectures collection, nullable
  googleMeetLink?: string; // Google Meet link for the live class
  startTime?: Date; // Start time of the live class
  endTime?: Date; // End time of the live class
  createdBy?: string; // Reference to the Users collection (MongoDB ObjectId as string)
  isActive?: boolean; // Whether the live class is active
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
        courseId,
        title,
        subTitle,
        category,
        subCategory,
        topic,
        language,
        subtitleLanguage,
        courseDurations,
        featured,
        price,
        startDate,
        courseLevels,
      }: {
        title: string;
        subTitle: string;
        instructor: string[];
        courseId: string;
        category: string;
        subCategory: string;
        topic: string;
        language: string;
        featured: boolean;
        price?: number;
        startDate: Date;
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
        courseId,
        language,
        subtitleLanguage,
        courseDurations,
        courseLevels,
        price,
        startDate,
        createdBy: req.user._id,
        featured,
        createdAt: new Date(),
        status: "ACTIVE",
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

    try {
      const updatedCourse = await Course.findOneAndUpdate(
        { _id: id },
        toUpdate,
        { new: true }
      ).exec();

      const response = sendSuccessApiResponse(
        "Course Updated Successfully!",
        updatedCourse
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
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

export const getCoursesWithSubjectsAndLectures = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        id,
        category,
        subCategory,
      }: { id?: string; category?: string; subCategory?: string } = req.query;

      const matchConditions: any = {};

      if (id) matchConditions._id = new mongoose.Types.ObjectId(id);
      if (category) {
        matchConditions.category = category;
      }
      if (subCategory) {
        matchConditions.subCategory = subCategory;
      }

      const data: any[] = await Course.aggregate([
        {
          $match: matchConditions,
        },
        {
          $lookup: {
            from: "subjects",
            localField: "_id",
            foreignField: "courseId",
            as: "subjects",
          },
        },
        {
          $unwind: {
            path: "$subjects",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "lectures",
            localField: "subjects._id",
            foreignField: "subjectId",
            as: "subjects.lectures",
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "instructor",
            foreignField: "_id",
            as: "instructors",
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
            subTitle: { $first: "$subTitle" },
            category: { $first: "$category" },
            subCategory: { $first: "$subCategory" },
            topic: { $first: "$topic" },
            language: { $first: "$language" },
            subtitleLanguage: { $first: "$subtitleLanguage" },
            courseDurations: { $first: "$courseDurations" },
            courseLevels: { $first: "$courseLevels" },
            learnings: { $first: "$learnings" },
            targetAudience: { $first: "$targetAudience" },
            requirements: { $first: "$requirements" },
            featured: { $first: "$featured" },
            courseDescription: { $first: "$courseDescription" },
            courseThumbnail: { $first: "$courseThumbnail" },
            courseTrailer: { $first: "$courseTrailer" },
            congratulationsMsg: { $first: "$congratulationsMsg" },
            welcomeMsg: { $first: "$welcomeMsg" },
            courseId: { $first: "$courseId" },
            instructors: {
              $push: {
                $map: {
                  input: "$instructors",
                  as: "instructor",
                  in: {
                    $concat: [
                      "$$instructor.firstName",
                      " ",
                      "$$instructor.lastName",
                    ],
                  }, // Extract only the username field
                },
              },
            },
            subjects: {
              $push: {
                subjectTitle: "$subjects.title",
                lectures: {
                  $map: {
                    input: "$subjects.lectures",
                    as: "lecture",
                    in: {
                      lectureTitle: "$$lecture.title",
                      notes: "$$lecture.notes",
                      description: "$$lecture.description",
                      video: "$$lecture.video",
                      file: "$$lecture.file",
                      captions: "$$lecture.captions",
                    },
                  },
                },
              },
            },
          },
        },
      ]);

      const response = sendSuccessApiResponse("Course get successfully!", data);
      res.status(200).send(response);
      return data;
    } catch (error) {
      console.error("Error generating next courseId:", error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getGoogleMeetLink: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwtClient = new JWT({
        email: process.env.client_email,
        key: process.env.private_key.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });

      const tokens = await jwtClient.authorize();
      const calendar: any = google.calendar({ version: "v3", auth: jwtClient });

      const attendees: calendar_v3.Schema$EventAttendee[] = Array(5) // Example: 150 attendees
        .fill(null)
        .map((_, index) => ({ email: `attendee${index + 1}@example.com` }));

      const event: calendar_v3.Schema$Event = {
        summary: "Team Meeting",
        location: "Virtual",
        description: "A meeting for the entire team.",
        start: {
          dateTime: "2025-01-18T09:00:00+05:30", // Indian Standard Time (IST)
          timeZone: "Asia/Kolkata", // Indian Time Zone
        },
        end: {
          dateTime: "2025-01-18T10:00:00+05:30", // Indian Standard Time (IST)
          timeZone: "Asia/Kolkata", // Indian Time Zone
        },
        attendees,
        conferenceData: {
          createRequest: {
            requestId: "uniqueRequestId123", // Ensure this is unique
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      };

      const response: any = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
      });

      console.log(response);

      const {
        title,
        description,
        courseId,
        subjectId,
        lectureId,
        googleMeetLink,
        startTime,
        courseCategory,
        endTime,
        createdBy,
      }: {
        title: string;
        description: string;
        courseId: string;
        subjectId: string;
        lectureId?: string | null; // Optional and nullable
        googleMeetLink: string;
        startTime: Date;
        endTime: Date;
        courseCategory: string;
        createdBy: string;
      } = req.body;

      const toStore: ILiveClass = {
        title,
        description,
        courseId,
        subjectId,
        lectureId,
        courseCategory,
        googleMeetLink,
        startTime,
        endTime,
        createdBy,
        createdAt: new Date(),
        isActive: true,
      };

      const liveClass = await LiveClass.create(toStore);

      const resp = sendSuccessApiResponse(
        "Google Meet Link Sent Successfully!",
        response?.data.hangoutLink
      );

      return res.status(200).send(resp);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getLiveClasses: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseCategory }: { courseCategory?: string } = req.query;

      const obj = {
        isActive: true,
        courseCategory: courseCategory,
      };

      const liveClasses: any = await LiveClass.find(obj).catch((err) => {
        console.log(err);
      });

      const resp = sendSuccessApiResponse(
        "Live Classes Sent Successfully!",
        liveClasses
      );

      return res.status(200).send(resp);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getFreeVideos: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category }: { category?: string } = req.query;

      const matchConditions: any = {};

      if (category) {
        matchConditions.category = category;
        matchConditions.isPaid = false;
      }

      const data: any[] = await Course.aggregate([
        {
          $match: matchConditions,
        },
        {
          $lookup: {
            from: "subjects",
            localField: "_id",
            foreignField: "courseId",
            as: "subjects",
          },
        },
        {
          $unwind: {
            path: "$subjects",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "lectures",
            localField: "subjects._id",
            foreignField: "subjectId",
            as: "subjects.lectures",
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "instructor",
            foreignField: "_id",
            as: "instructors",
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
          $unwind: {
            path: "$subjects.lectures",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: null, // No grouping key, we just want a single array of videos
            videos: { $addToSet: "$subjects.lectures.video" }, // Combine all videos into one array
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field
            videos: 1, // Include only the videos array
          },
        },
      ]);

      const response = sendSuccessApiResponse(
        "Live Videos sent successfully!",
        data[0]
      );
      res.status(200).send(response);
      return data;
    } catch (error) {
      console.error("Error generating next courseId:", error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);
