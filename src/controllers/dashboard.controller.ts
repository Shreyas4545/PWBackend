import Notifications from "../models/notifications.model";
import Banners from "../models/banner.model";
import Student from "../models/student.model";
import Queries from "../models/studentQueries.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import User from "../models/User";
import Course from "../models/course.model";
import Payment from "../models/payment.model";
import mongoose from "mongoose";
import Reviews from "../models/review.model";

export interface studentQueryObj {
  description: string;
  image: string;
  studentId: string;
  status: string;
  createdAt: Date;
}

export interface reviewObj {
  name: string;
  courseId: string;
  review: string;
  rating: string;
  status: string;
  createdAt: Date;
  date?: Date;
}

export interface reviewUpdateObj {
  name?: string;
  courseId?: string;
  review?: string;
  rating?: string;
  status?: string;
  date?: Date;
}

export interface notificationObj {
  message: string;
  to: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  courseId: string;
}

export interface bannerObj {
  type: string;
  file: string;
  status: string;
  createdBy: string;
  createdAt: Date;
}

export interface bannerUpdateObj {
  type?: string;
  file?: string;
  status?: string;
}

export const addNotification: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      message,
      to,
      createdBy,
      courseId,
    }: {
      message: string;
      to: string;
      createdBy: string;
      courseId: string;
    } = req.body;

    const addObj: notificationObj = {
      message,
      to,
      status: "ACTIVE",
      createdAt: new Date(),
      createdBy: createdBy,
      courseId: courseId,
    };

    try {
      const newNoti = await Notifications.create(addObj);

      const response = sendSuccessApiResponse(
        "Notification Added Successfully!",
        newNoti
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getNotifications: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId }: { studentId?: string } = req.query;

      const getObj: any = {
        status: "ACTIVE",
        studentId: new mongoose.Types.ObjectId(studentId),
      };

      let notifications: any = [];

      const unpaidNotifications: any = await Notifications.find({
        status: "ACTIVE",
        to: "UNPAID",
      }).catch((err) => {
        console.log(err);
      });

      const paidNotifications = await Payment.aggregate([
        {
          $lookup: {
            from: "notifications",
            localField: "courseId",
            foreignField: "courseId",
            as: "notiData",
          },
        },
        {
          $unwind: "$notiData",
        },
        {
          $match: { ...getObj, "notiData.to": "PAID" },
        },
        {
          $project: {
            message: "$notiData.message",
            to: "$notiData.to",
            status: "$notiData.status",
            createdAt: "$notiData.createdAt",
            courseId: "$notiData.courseId",
            createdBy: "$notiData.createdBy",
          },
        },
      ]);

      notifications = [...unpaidNotifications, ...paidNotifications];
      const response = sendSuccessApiResponse(
        "Notifications sent Successfully!",
        notifications
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const addBanner: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      file,
      type,
      createdBy,
    }: {
      file: string;
      type: string;
      createdBy: string;
    } = req.body;

    const addObj: bannerObj = {
      file,
      type,
      status: "ACTIVE",
      createdAt: new Date(),
      createdBy: createdBy,
    };

    try {
      const newBanner = await Banners.create(addObj);

      const response = sendSuccessApiResponse(
        "Banner Added Successfully!",
        newBanner
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const updateBanner: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      file,
      type,
      status,
    }: {
      file: string;
      type: string;
      status: string;
    } = req.body;

    const { id }: { id?: string } = req.params;
    const updateObj: bannerUpdateObj = {};

    if (file) {
      updateObj.file = file;
    }

    if (type) {
      updateObj.type = type;
    }

    if (status) {
      updateObj.status = status;
    }
    try {
      const updatedBanner = await Banners.findOneAndUpdate(
        { _id: id },
        { $set: updateObj },
        { new: true }
      );

      const response = sendSuccessApiResponse(
        "Banner Updated Successfully!",
        updatedBanner
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getBanners: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      id,
      createdBy,
      type,
    }: {
      id?: string;
      createdBy?: string;
      type?: string;
    } = req.query;

    const getObj: any = {
      status: "ACTIVE",
    };

    if (id) {
      getObj._id = id;
    }

    if (type) {
      getObj.type = type;
    }

    if (createdBy) {
      getObj.createdBy = createdBy;
    }

    try {
      const banners = await Banners.find(getObj);

      const response = sendSuccessApiResponse(
        "Banners sent Successfully!",
        banners
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getDashboardData: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const students: any = await Student.find({}).catch((err) => {
        console.log(err);
      });

      const instructors: any = await User.find({}).catch((err) => {
        console.log(err);
      });

      const courses: any = await Course.find({}).catch((err) => {
        console.log(err);
      });

      const payment: any = await Payment.aggregate([
        {
          $group: {
            _id: null, // No grouping key, so all documents are aggregated together
            totalAmount: { $sum: "$amount" }, // Summing the 'amount' field
          },
        },
        {
          $project: { _id: 0, totalAmount: 1 }, // Exclude `_id` from the output
        },
      ]);

      const uniqueCoursesBought = await Payment.aggregate([
        {
          $group: {
            _id: "$category", // Group by the 'category' field
          },
        },
        {
          $count: "uniqueCategories", // Count the number of unique categories
        },
      ]);

      let currDate: any = new Date();
      const onGoingCourses: any = await Course.find({
        $or: [
          { endDate: { $gte: currDate } }, // Include courses where endDate is >= currDate
          { endDate: { $exists: false } }, // Include courses where endDate is missing
        ],
      }).catch((err) => {
        console.error(err);
      });

      const endedCourses: any = await Course.find({
        $or: [
          { endDate: { $lt: currDate } }, // Include courses where endDate is >= currDate
          { endDate: { $exists: false } }, // Include courses where endDate is missing
        ],
      }).catch((err) => {
        console.error(err);
      });

      const reviews: any[] | any = await Reviews.find({}).catch((err) => {
        console.log(err);
      });

      const reviewObj = {
        "5 Star":
          (reviews?.filter((s: any) => s.rating == 5)?.length /
            reviews?.length.toFixed(2)) *
          100,
        "4 Star":
          (reviews?.filter((s: any) => s.rating == 4)?.length /
            reviews?.length.toFixed(2)) *
          100,
        "3 Star":
          (reviews?.filter((s: any) => s.rating == 3)?.length /
            reviews?.length.toFixed(2)) *
          100,
        "2 Star":
          (reviews?.filter((s: any) => s.rating == 2)?.length /
            reviews?.length.toFixed(2)) *
          100,
        "1 Star":
          (reviews?.filter((s: any) => s.rating == 1)?.length /
            reviews?.length.toFixed(2)) *
          100,
        "Overall Rating":
          reviews?.reduce((acc: any, it: any) => acc + it?.rating, 0) /
          (reviews?.length * 5),
      };

      const respData: any = {
        instructors: instructors?.length,
        students: students?.length,
        onlineCourses: courses?.length,
        payment: payment[0]?.totalAmount,
        onGoingCourses: onGoingCourses?.length,
        endedCourses: endedCourses?.length,
        reviews: reviewObj,
        coursesBought: uniqueCoursesBought?.length,
      };

      const response = sendSuccessApiResponse(
        "Banners sent Successfully!",
        respData
      );

      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const addStudentQueries: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      description,
      image,
      studentId,
    }: {
      description: string;
      image?: string;
      studentId: string;
    } = req.body;

    const addObj: studentQueryObj = {
      description,
      image,
      studentId,
      status: "ACTIVE",
      createdAt: new Date(),
    };

    try {
      const newQuery = await Queries.create(addObj);

      const response = sendSuccessApiResponse(
        "Query Added Successfully!",
        newQuery
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getStudentQueries: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queries = await Queries.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "_id",
            as: "studentQueries",
          },
        },
        {
          $unwind: "$studentQueries",
        },
        {
          $project: {
            studentPhone: "$studentQueries.phoneNumber",
            name: {
              $concat: [
                "$studentQueries.firstName",
                " ",
                "$studentQueries.lastName",
              ],
            },
            description: "$description",
            image: "$image",
          },
        },
      ]).catch((err) => {
        console.log(err);
      });

      const response = sendSuccessApiResponse(
        "Queries Sent Successfully!",
        queries
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const addReviews: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      courseId,
      review,
      rating,
      date,
    }: {
      name: string;
      courseId: string;
      review: string;
      rating: string;
      date?: Date;
    } = req.body;

    const addObj: reviewObj = {
      name,
      courseId,
      review,
      rating,
      date,
      status: "ACTIVE",
      createdAt: new Date(),
    };

    try {
      const newReview = await Reviews.create(addObj);

      const response = sendSuccessApiResponse(
        "Review Added Successfully!",
        newReview
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getReviews: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      courseId,
    }: {
      courseId?: string;
    } = req.query;

    try {
      let obj: any = {};
      if (courseId) {
        obj.courseId = courseId;
      }
      const reviews = await Reviews.find(obj).catch((err) => {
        console.log(err);
      });

      const response = sendSuccessApiResponse(
        "Reviews Sent Successfully!",
        reviews
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const updateReviews: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      courseId,
      review,
      rating,
      date,
      status,
    }: {
      name?: string;
      courseId?: string;
      review?: string;
      rating?: string;
      date?: Date;
      status?: string;
    } = req.body;

    const id: any = req.params.id;

    const updateObj: reviewUpdateObj = {
      name,
      courseId,
      review,
      rating,
      date,
      status: status,
    };

    try {
      const newUpdatedReview = await Reviews.findOneAndUpdate(
        { _id: id },
        { $set: updateObj },
        { new: true }
      ).catch((err) => {
        console.log(err);
      });

      const response = sendSuccessApiResponse(
        "Review Updated Successfully!",
        newUpdatedReview
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);
