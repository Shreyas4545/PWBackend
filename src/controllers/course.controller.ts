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
import Subjects from "../models/subjects.model";
import Lectures from "../models/lectures.model";
import Reviews from "../models/review.model";

type FAQ = {
  question: string;
  answer: string;
};

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
  endDate?: Date;
  actualPrice?: number;
  discountedPrice?: number;
  isPaid: boolean;
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
  startDate?: string; // Start time of the live class
  startTime: string;
  thumbNail?: string;
  createdBy?: string; // Reference to the Users collection (MongoDB ObjectId as string)
  status?: string; // Whether the live class is active
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
        actualPrice,
        discountedPrice,
        startDate,
        courseLevels,
        endDate,
        isPaid,
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
        actualPrice?: number;
        discountedPrice?: number;
        startDate: Date;
        endDate: Date;
        subtitleLanguage: string;
        courseDurations: string;
        courseLevels: string;
        isPaid: boolean;
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
        actualPrice,
        discountedPrice,
        startDate,
        isPaid,
        createdBy: req.user._id,
        featured,
        endDate,
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
    const id = req.params.id as string | undefined;

    try {
      const updatedCourse = await Course.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
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
        return res.status(200).send(response);
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

      let data: any[] = await Course.aggregate([
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
            schedule: { $first: "$schedule" },
            whatYouWillGet: { $first: "$whatYouWillGet" },
            faq: { $first: "$faq" },
            featured: { $first: "$featured" },
            courseDescription: { $first: "$courseDescription" },
            courseThumbnail: { $first: "$courseThumbnail" },
            actualPrice: { $first: "$actualPrice" },
            discountedPrice: { $first: "$discountedPrice" },
            isPaid: { $first: "$isPaid" },
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
                id: "$subjects._id",
                lectures: {
                  $map: {
                    input: "$subjects.lectures",
                    as: "lecture",
                    in: {
                      lectureTitle: "$$lecture.title",
                      id: "$$lecture._id",
                      notes: "$$lecture.notes",
                      dpp: "$$lecture.dpp",
                      description: "$$lecture.description",
                      video: "$$lecture.video",
                      assignment: "$$lecture.assignment",
                      test: "$$lecture.test",
                    },
                  },
                },
              },
            },
          },
        },
      ]);

      data = data?.sort((a, b) => b.createdAt - a.createdAt);

      const response = sendSuccessApiResponse("Course get successfully!", data);
      res.status(200).send(response);
      return data;
    } catch (error) {
      console.error("Error sending courses:", error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getHomeCourses = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, studentId }: { id?: string; studentId?: string } = req.query;

    try {
      const obj: any = {};
      const obj1: any = {};
      let stuId: any = "";
      if (id) {
        obj._id = new mongoose.Types.ObjectId(id);
      }
      if (id) {
        obj1.courseId = new mongoose.Types.ObjectId(id);
      }
      if (studentId) {
        stuId = new mongoose.Types.ObjectId(studentId);
      }

      // let courses: any = await Course.aggregate([
      //   {
      //     $match: obj,
      //   },
      //   {
      //     $lookup: {
      //       from: "payments", // Reference the tests collection
      //       localField: "_id",
      //       foreignField: "courseId",
      //       as: "payments",
      //     },
      //   },
      //   {
      //     $set: {
      //       isPurchased: {
      //         $gt: [
      //           {
      //             $size: {
      //               $filter: {
      //                 input: "$payments",
      //                 as: "payment",
      //                 cond: { $eq: ["$$payment.studentId", studentId] },
      //               },
      //             },
      //           },
      //           0,
      //         ],
      //       },
      //     },
      //   },
      //   ,
      //   {
      //     $lookup: {
      //       from: "user",
      //       localField: "instructor",
      //       foreignField: "_id",
      //       as: "instructors",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "user",
      //       localField: "createdBy",
      //       foreignField: "_id",
      //       as: "creator",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$creator",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$_id",
      //       title: { $first: "$title" },
      //       isPurchased: { $first: "$isPurchased" },
      //       courseDurations: { $first: "$courseDurations" },
      //       createdBy: {
      //         $first: {
      //           $concat: ["$creator.firstName", " ", "$creator.lastName"],
      //         },
      //       },
      //       instructors: {
      //         $push: {
      //           $map: {
      //             input: "$instructors",
      //             as: "instructor",
      //             in: {
      //               name: {
      //                 $concat: [
      //                   "$$instructor.firstName",
      //                   " ",
      //                   "$$instructor.lastName",
      //                 ],
      //               },
      //               photo: "$$instructor.photo",
      //             },
      //           },
      //         },
      //       },
      //       subtitle: { $first: "$subtitle" },
      //       category: { $first: "$category" },
      //       subCategory: { $first: "$subCategory" },
      //       actualPrice: { $first: "$actualPrice" },
      //       discountedPrice: { $first: "$discountedPrice" },
      //       startDate: { $first: "$startDate" },
      //       endDate: { $first: "$endDate" },
      //       courseDescription: { $first: "$courseDescription" },
      //       courseThumbnail: { $first: "$courseThumbnail" },
      //       courseTrailer: { $first: "$courseTrailer" },
      //       welcomeMsg: { $first: "$welcomeMsg" },
      //       whatYouWillGet: { $first: "$whatYouWillGet" },
      //       faq: { $first: "$faq" },
      //       schedule: { $first: "$schedule" },
      //     },
      //   },
      // ]).catch((err) => {
      //   console.log(err);
      // });

      let courses: any = await Course.aggregate([
        {
          $match: obj,
        },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "courseId",
            as: "payments",
          },
        },
        {
          $set: {
            isPurchased: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$payments",
                      as: "payment",
                      cond: { $eq: ["$$payment.studentId", stuId] },
                    },
                  },
                },
                0,
              ],
            },
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
            isPurchased: { $first: "$isPurchased" },
            courseDurations: { $first: "$courseDurations" },
            createdBy: {
              $first: {
                $concat: ["$creator.firstName", " ", "$creator.lastName"],
              },
            },
            instructors: {
              $push: {
                $map: {
                  input: "$instructors",
                  as: "instructor",
                  in: {
                    name: {
                      $concat: [
                        "$$instructor.firstName",
                        " ",
                        "$$instructor.lastName",
                      ],
                    },
                    photo: "$$instructor.photo",
                  },
                },
              },
            },
            subtitle: { $first: "$subtitle" },
            category: { $first: "$category" },
            subCategory: { $first: "$subCategory" },
            actualPrice: { $first: "$actualPrice" },
            discountedPrice: { $first: "$discountedPrice" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            courseDescription: { $first: "$courseDescription" },
            courseThumbnail: { $first: "$courseThumbnail" },
            courseTrailer: { $first: "$courseTrailer" },
            welcomeMsg: { $first: "$welcomeMsg" },
            whatYouWillGet: { $first: "$whatYouWillGet" },
            faq: { $first: "$faq" },
            schedule: { $first: "$schedule" },
          },
        },
      ]).catch((err) => {
        console.log(err);
      });

      for (let i of courses) {
        i.instructors = i.instructors[0];
      }

      const classes: any = await Subjects.aggregate([
        {
          $match: obj1,
        },
        {
          $lookup: {
            from: "lectures", // Reference the tests collection
            localField: "_id",
            foreignField: "subjectId",
            as: "lectures",
          },
        },
        {
          $addFields: {
            numberOfLectures: { $size: { $ifNull: ["$lectures", []] } }, // Count total tests in this series
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            numberOfLectures: 1,
          },
        },
      ]).catch((err) => {
        console.log(err);
      });

      const courseReviews: any = await Reviews.find(obj1);

      const reviewRating: any = (
        courseReviews?.reduce((acc: any, it: any) => acc + it.rating, 0) /
        courseReviews?.length
      ).toFixed(2);

      let resultObj: any = {
        courses: courses,
      };

      if (id) {
        resultObj = {
          ...resultObj,
          classes: classes?.reduce(
            (acc: any, it: any) => acc + it.numberOfLectures,
            0
          ),
          rating: reviewRating,
        };
      }

      const response = sendSuccessApiResponse(
        "Courses sent Successfully!",
        resultObj
      );
      return res.status(200).send(response);
    } catch (error) {
      console.error("Error sending courses:", error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getWebHomeCourses = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id }: { id?: string } = req.query;

    const { page = 1, limit = 12 }: { page?: any; limit?: any } = req.query; // Default: 15 candidates per page

    try {
      const obj: any = {
        status: "ACTIVE",
      };
      if (id) {
        obj._id = new mongoose.Types.ObjectId(id);
      }

      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageSize;

      const courses = await Course.aggregate([
        {
          $lookup: {
            from: "payments", // Reference the tests collection
            localField: "_id",
            foreignField: "courseId",
            as: "payments",
          },
        },
        {
          $addFields: {
            noOfStudents: { $size: { $ifNull: ["$payments", []] } }, // Count total tests in this series
          },
        },
        {
          $project: {
            noOfStudents: 1,
            title: 1,
            startDate: 1,
            status: 1,
            endDate: 1,
            actualPrice: 1,
            courseDescription: 1,
            courseThumbnail: 1,
            discountedPrice: 1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ]).catch((err) => {
        console.log(err);
      });

      const totalCourses: any = await Course.countDocuments({
        status: "ACTIVE",
      });

      const resultObj: any = {
        courses: courses,
        totalPages: Math.ceil(totalCourses / pageSize),
        currentPage: pageNumber,
      };

      const response = sendSuccessApiResponse(
        "Courses sent Successfully!",
        resultObj
      );
      return res.status(200).send(response);
    } catch (error) {
      console.error("Error sending courses:", error);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getSubjects = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId }: { courseId?: string } = req.query;

    try {
      const obj: any = {};
      if (courseId) {
        obj.courseId = new mongoose.Types.ObjectId(courseId);
      }
      const subjects = await Subjects.aggregate([
        {
          $match: obj,
        },
        {
          $lookup: {
            from: "lectures", // Reference the tests collection
            localField: "_id",
            foreignField: "subjectId",
            as: "lectures",
          },
        },
        {
          $addFields: {
            numberOfLectures: { $size: { $ifNull: ["$lectures", []] } }, // Count total tests in this series
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            numberOfLectures: 1,
          },
        },
      ]).catch((err) => {
        console.log(err);
      });
      const response = sendSuccessApiResponse(
        "Subjects sent Successfully!",
        subjects
      );
      return res.status(200).send(response);
    } catch (error) {
      console.error("Error sending subjects", error);
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
        subject: "info@oscodesolutionapp.com",
      });

      const tokens = await jwtClient.authorize();
      const calendar: any = google.calendar({ version: "v3", auth: jwtClient });

      const attendees: calendar_v3.Schema$EventAttendee[] = Array(5) // Example: 150 attendees
        .fill(null)
        .map((_, index) => ({ email: `shreyasjakati66@gmail.com` }));

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

      const {
        title,
        description,
        courseId,
        subjectId,
        lectureId,
        startDate,
        startTime,
        courseCategory,
        thumbNail,
        createdBy,
        status,
      }: {
        title: string;
        description: string;
        courseId: string;
        subjectId: string;
        lectureId?: string | null;
        startDate: string;
        startTime: string;
        thumbNail: string;
        courseCategory: string;
        createdBy: string;
        status: string;
      } = req.body;

      const toStore: ILiveClass = {
        title,
        description,
        courseId,
        subjectId,
        lectureId,
        courseCategory,
        googleMeetLink: response?.data.hangoutLink,
        startDate,
        startTime,
        thumbNail,
        createdBy,
        createdAt: new Date(),
        status,
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
      const {
        courseCategory,
        status,
        lectureId,
      }: { courseCategory?: string; status?: string; lectureId?: string } =
        req.query;

      const obj: any = {};

      if (courseCategory) {
        obj.courseCategory = courseCategory;
      }
      if (lectureId) {
        obj.lectureId = new mongoose.Types.ObjectId(lectureId);
      }
      if (status) {
        obj.status = status;
      } else {
        obj["$or"] = [{ status: "UPCOMING" }, { status: "ONGOING" }];
      }

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

export const getLectures: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subjectId }: { subjectId?: string } = req.query;

      const obj: any = {};

      if (subjectId) {
        obj.subjectId = new mongoose.Types.ObjectId(subjectId);
      }
      obj.status = "ACTIVE";

      const lectures: any = await Lectures.aggregate([
        {
          $match: obj,
        },
        {
          $addFields: {
            notes: { $size: { $ifNull: ["$notes", []] } },
            tests: { $size: { $ifNull: ["$test", []] } },
            dpp: { $size: { $ifNull: ["$dpp", []] } },
            recordedLectures: { $size: { $ifNull: ["$video", []] } },
            assignments: { $size: { $ifNull: ["$assignment", []] } },
          },
        },
        {
          $project: {
            title: 1,
            notes: 1,
            tests: 1,
            dpp: 1,
            recordedLectures: 1,
            assignments: 1,
          },
        },
      ]).catch((err) => {
        console.log(err);
      });

      const resp = sendSuccessApiResponse(
        "Lectures Sent Successfully!",
        lectures
      );

      return res.status(200).send(resp);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getLectureDetails: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id }: { id?: string } = req.query;

      const obj: any = {};

      if (id) {
        obj._id = new mongoose.Types.ObjectId(id);
      }
      obj.status = "ACTIVE";

      const lectureDetails: any = await Lectures.find(obj).catch((err) => {
        console.log(err);
      });

      const resp = sendSuccessApiResponse(
        "Lecture Details Sent Successfully!",
        lectureDetails
      );

      return res.status(200).send(resp);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getAllTestsInCourse: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId }: { courseId?: string } = req.query;

      const allTests: any = await Lectures.aggregate([
        {
          $lookup: {
            from: "subjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        { $unwind: "$subject" },
        {
          $match: {
            "subject.courseId": new mongoose.Types.ObjectId(courseId), // Replace with actual courseId
            "subject.status": "ACTIVE",
          },
        },
        {
          $group: {
            _id: null,
            allTests: { $push: "$test" }, // Collect all tests arrays
          },
        },
        {
          $project: {
            _id: 0,
            allTests: {
              $reduce: {
                input: "$allTests",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            }, // Flatten the array of arrays into a single array
          },
        },
      ]);

      const resp = sendSuccessApiResponse(
        "All Tests Sent Successfully!",
        allTests
      );

      return res.status(200).send(resp);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const updateLiveClass: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id }: { id?: string } = req.params;

      const { status, lectureId }: { status?: string; lectureId?: string } =
        req.query;
      const obj = {
        status: status,
        lectureId: lectureId,
      };

      const updatedLiveClass = await LiveClass.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      ).catch((err) => {
        console.log(err);
      });

      const resp = sendSuccessApiResponse(
        "Live Classes Updated Successfully!",
        updatedLiveClass
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
          $unwind: {
            path: "$subjects.lectures.video",
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
        "Free Videos sent successfully!",
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
