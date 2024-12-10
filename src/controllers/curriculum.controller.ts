import Lectures from "../models/lectures.model";
import Subjects from "../models/subjects.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";

export interface subjectObj {}

export interface lectureObj {}
