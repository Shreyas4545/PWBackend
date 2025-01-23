import Notifications from "../models/notifications.model";
import Banners from "../models/banner.model";
import Student from "../models/student.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import User from "../models/User";
import Course from "../models/course.model";
import Payment from "../models/payment.model";
import mongoose from "mongoose";

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

      console.log(payment, uniqueCoursesBought);

      const respData: any = {
        instructors: instructors?.length,
        students: students?.length,
        onlineCourses: courses?.length,
        payment: payment[0]?.totalAmount,
        onGoingCourses: onGoingCourses?.length,
        endedCourses: endedCourses?.length,
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
