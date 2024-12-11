import Lectures from "../models/lectures.model";
import Subjects from "../models/subjects.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";

export interface subjectObj {
  title: string;
  courseId: string;
  status: string;
  createdAt: Date;
}
export interface lectureObj {
  title: string;
  subject_id: any;
  notes: string;
  description: string;
  video: string;
  file: string;
  captions: string;
  status: string;
  createdAt: Date;
}

export const addCurriculum: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        courseId,
        data,
      }: {
        courseId: string;
        data: any;
      } = req.body;

      const subjectData: any = [];
      const lectureData: any = [];

      for (let i of data) {
        const subjectObjToStore: subjectObj = {
          title: i?.subjectTitle,
          courseId: courseId,
          status: "ACTIVE",
          createdAt: new Date(),
        };

        const subject = await Subjects.create(subjectObjToStore);
        subjectData.push({ id: subject?._id, title: i?.subjectTitle });

        for (let j of i?.lectures) {
          const lectureObjToStore: lectureObj = {
            title: j?.lectureTitle,
            subject_id: subject?._id,
            notes: j?.notes,
            description: j?.description,
            video: j?.video,
            file: j?.file,
            captions: j?.captions,
            status: "ACTIVE",
            createdAt: new Date(),
          };

          const lectureObj = await Lectures.create(lectureObjToStore);
          lectureData.push(lectureObj);
        }
      }
      const response = sendSuccessApiResponse(
        "Curriculum Added Successfully!",
        {
          subjectData: subjectData,
          lectureData: lectureData,
        }
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const editSection = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const editLecture = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {}
);
