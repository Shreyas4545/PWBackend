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

export interface updateSubjectObj {
  title: string;
  status: string;
}
export interface lectureObj {
  title: string;
  subjectId: any;
  notes: any;
  dpp: any;
  video: any;
  test: any;
  assignment: any;
  status: string;
  createdAt: Date;
}

export interface updateLectureObj {
  title: string;
  notes: any;
  dpp: any;
  video: any;
  assignment: any;
  test: any;
  status: string;
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
        if (i._id) continue;
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
            subjectId: subject?._id,
            notes: j?.notes,
            dpp: j?.dpp,
            video: j?.video,
            assignment: j?.assignment,
            test: j?.test,
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

export const editSection: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string | undefined;

      const { title, status }: { title: string; status: string } = req.body;

      const updateObj: updateSubjectObj = {
        title,
        status,
      };
      const updatedSection = await Subjects.findOneAndUpdate(
        { _id: id },
        updateObj,
        { new: true }
      );
      const response = sendSuccessApiResponse(
        "Section Updated Successfully!",
        updatedSection
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);

export const editLecture: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string | undefined;

      const {
        title,
        status,
        assignment,
        dpp,
        video,
        test,
        notes,
      }: {
        dpp: any;
        test: any;
        video: any;
        assignment: any;
        notes: any;
        title: string;
        status: string;
      } = req.body;

      const updateObj: updateLectureObj = {
        title,
        status,
        dpp,
        assignment,
        video,
        test,
        notes,
      };

      const updatedLecture = await Lectures.findOneAndUpdate(
        { _id: id },
        updateObj,
        { new: true }
      );

      const response = sendSuccessApiResponse(
        "Lecture Updated Successfully!",
        updatedLecture
      );
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }
  }
);
