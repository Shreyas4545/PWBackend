import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import Payment from "../models/payment.model";
import testSeriesPayment from "../models/testSeriesPayment.model";
import mongoose from "mongoose";
export interface paymentObj {
  transactionId: string;
  amount: number;
  status: string;
  studentId: string;
  courseId: string;
  createdAt: Date;
}

export interface testSeriesPaymentObj {
  transactionId: string;
  amount: number;
  status: string;
  studentId: string;
  testSeriesId: string;
  createdAt: Date;
}

//AddPayment
export const addPayment: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      transactionId,
      amount,
      studentId,
      courseId,
    }: {
      transactionId: string;
      amount: number;
      studentId: string;
      courseId: string;
    } = req.body;

    const addPayment: paymentObj = {
      transactionId,
      amount,
      studentId,
      courseId,
      status: "ACTIVE",
      createdAt: new Date(),
    };

    try {
      const newPayment = await Payment.create(addPayment);

      const response = sendSuccessApiResponse(
        "Payment Added Successfully!",
        newPayment
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const getStudentsRegistered: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      id,
    }: {
      id?: string;
    } = req.query;

    const obj: any = {};
    if (id) {
      obj.courseId = new mongoose.Types.ObjectId(id);
    }

    try {
      const students = await Payment.find(obj);

      const response = sendSuccessApiResponse(
        "Students registered sent successfully!",
        students
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const addTestSeriesPayment: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      transactionId,
      amount,
      studentId,
      testSeriesId,
    }: {
      transactionId: string;
      amount: number;
      studentId: string;
      testSeriesId: string;
    } = req.body;

    const addPayment: testSeriesPaymentObj = {
      transactionId,
      amount,
      studentId,
      testSeriesId,
      status: "ACTIVE",
      createdAt: new Date(),
    };

    try {
      const newTestSeriesPayment = await testSeriesPayment.create(addPayment);

      const response = sendSuccessApiResponse(
        "Test Series Payment Added Successfully!",
        newTestSeriesPayment
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);
