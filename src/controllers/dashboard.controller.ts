import Notifications from "../models/notifications.model";
import Banners from "../models/banner.model";
import Student from "../models/student.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import mongoose from "mongoose";

export interface notificationObj {
  message: string;
  to: string;
  status: string;
  createdBy: string;
  createdAt: Date;
}

export interface bannerObj {
  type: string;
  file: string;
  status: string;
  createdBy: string;
  createdAt: Date;
}

export const addNotification: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      message,
      to,
      createdBy,
    }: {
      message: string;
      to: string;
      createdBy: string;
    } = req.body;

    const addObj: notificationObj = {
      message,
      to,
      status: "ACTIVE",
      createdAt: new Date(),
      createdBy: createdBy,
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
      const {
        to,
        whom,
      }: {
        to?: string;
        whom?: string;
      } = req.query;

      const getObj: any = {
        status: "ACTIVE",
      };
      let notifications: any;
      if (to) getObj.to = to;
      if (whom == "Student") {
        notifications = await Notifications.aggregate([
          {
            $lookup: {
              from: "students",
              localField: "to",
              foreignField: "_id",
              as: "notiData",
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
            $match: getObj,
          },
          {
            $unwind: "$notiData",
          },
          {
            $unwind: "$creator",
          },
          {
            $project: {
              createdBy: {
                $concat: ["$creator.firstName", " ", "$creator.lastName"],
              },
              message: 1,
              to: {
                $concat: ["$notiData.firstName", " ", "$notiData.lastName"],
              },
            },
          },
        ]);
      } else if (whom == "Staff") {
        notifications = await Notifications.aggregate([
          {
            $lookup: {
              from: "user",
              localField: "to",
              foreignField: "_id",
              as: "notiData",
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
            $match: getObj,
          },
          {
            $unwind: "$notiData",
          },
          {
            $unwind: "$creator",
          },
          {
            $project: {
              createdBy: {
                $concat: ["$creator.firstName", " ", "$creator.lastName"],
              },
              message: 1,
              to: {
                $concat: ["$notiData.firstName", " ", "$notiData.lastName"],
              },
            },
          },
        ]);
      }

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

    const getObj: any = {};

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
