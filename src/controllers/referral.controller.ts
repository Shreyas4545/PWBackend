import Coupan from "../models/coupan.model";
import bigPromise from "../middlewares/bigPromise";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";

export interface coupanCreateObj {
  code: string;
  discountPer: number;
  discountAmount: number;
  createdBy: string;
  status: string;
  createdAt: Date;
  courseId: string;
}

export interface coupanUpdateObj {
  code?: string;
  discountPer?: number;
  discountAmount?: number;
  status?: string;
  courseId?: string;
}

export const addCoupan: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      code,
      discountPer,
      discountAmount,
      createdBy,
      courseId,
    }: {
      code: string;
      discountPer: number;
      discountAmount: number;
      createdBy: string;
      courseId: string;
    } = req.body;

    const addObj: coupanCreateObj = {
      code,
      discountPer,
      discountAmount,
      status: "ACTIVE",
      courseId: courseId,
      createdAt: new Date(),
      createdBy: createdBy,
    };

    try {
      const newCoupan = await Coupan.create(addObj);

      const response = sendSuccessApiResponse(
        "Coupan Added Successfully!",
        newCoupan
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getCoupan: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      code,
      createdBy,
    }: {
      code?: string;
      createdBy?: string;
    } = req.query;

    const getObj: any = {};

    if (code) {
      getObj.code = code;
    }

    if (createdBy) {
      getObj.createdBy = createdBy;
    }

    try {
      const coupans = await Coupan.find(getObj);

      const response = sendSuccessApiResponse(
        "Coupan sent Successfully!",
        coupans
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const updateCoupan: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      code,
      status,
      discountPer,
      discountAmount,
      courseId,
    }: {
      code: string;
      status: string;
      discountPer: number;
      discountAmount: number;
      courseId: string;
    } = req.body;

    const id: string = req.params.id;

    const updateObj: coupanUpdateObj = {};

    if (code) {
      updateObj.code = code;
    }

    if (status) {
      updateObj.status = status;
    }
    if (discountAmount) {
      updateObj.discountAmount = discountAmount;
    }
    if (discountPer) {
      updateObj.discountPer = discountPer;
    }
    if (courseId) {
      updateObj.courseId = courseId;
    }

    try {
      const updatedCoupan = await Coupan.findOneAndUpdate(
        { _id: id },
        { $set: updateObj },
        { new: true }
      );

      const response = sendSuccessApiResponse(
        "Coupan Updated Successfully!",
        updatedCoupan
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);
