import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import Payment from "../models/payment.model";

export interface paymentObj {
  transactionId: string;
  amount: number;
  status: string;
  studentId: string;
  courseId: string;
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
