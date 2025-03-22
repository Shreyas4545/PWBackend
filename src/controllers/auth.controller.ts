import User from "../models/User";
import Student from "../models/student.model";
import { NextFunction, Request, RequestHandler, Response } from "express";
import bigPromise from "../middlewares/bigPromise";
import { sendSuccessApiResponse } from "../middlewares/successApiResponse";
import { createCustomError } from "../errors/customAPIError";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
dotenv.config();

const options = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

interface signupObject {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  password: string;
  phoneNumber: number;
  gender: string;
  role: string;
}

interface studentUpdateObj {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: number;
  gender?: string;
  role?: string;
  isActive?: boolean;
}

interface studentSignupObject {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  password: string;
  phoneNumber: number;
  gender: string;
  role: string;
  studentId: string;
}

export const signup: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        gender,
        phoneNumber,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: number;
        gender: string;
      } = req.body;

      const toStore: signupObject = {
        firstName,
        lastName,
        email,
        createdAt: new Date(),
        password,
        phoneNumber,
        gender,
        role: "user",
      };

      if (!email || !firstName || !password) {
        return next(
          createCustomError("Name, Email and Password fields are required", 400)
        );
      }

      const existingUser = await User.findOne({ email, isActive: true });

      if (existingUser) {
        return next(createCustomError("User Already exists", 400));
      }

      const phoneNumberIsActive = await User.findOne({
        phoneNumber,
        isActive: true,
      });

      if (phoneNumberIsActive) {
        return next(
          createCustomError("This phone number is already registered.", 400)
        );
      }

      const user: any = await User.create(toStore);

      user.save();
      const data: any = { token: user.getJwtToken(), user };

      const response = sendSuccessApiResponse(
        "User Registered Successfully!",
        data
      );
      res.status(200).cookie("token", data.token, options).send(response);
    } catch (error) {
      console.log(error);
    }
  }
);

function generateRandomPrefix() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26))
  );
}

export const studentSignup: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        gender,
        phoneNumber,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: number;
        gender: string;
      } = req.body;

      let studentId: string = "";

      // Fetch the document with the highest courseId numerically
      const latestStudent = await Student.findOne({})
        .sort({ student: -1 }) // Sort by courseId descending
        .exec();

      const randomPrefix = generateRandomPrefix();

      if (!latestStudent) {
        studentId = `${randomPrefix}101`;
      } else {
        // Extract the prefix and numeric part from the latest courseId
        const id = latestStudent.studentId; // e.g., "AB100"
        const numericPart = parseInt(id.slice(3)); // 100

        // Increment the numeric part by 1
        const nextNumericPart = numericPart + 1;

        // Pad the numeric part with leading zeros if necessary (3 digits)
        studentId = `${randomPrefix}${nextNumericPart
          .toString()
          .padStart(3, "0")}`;
      }

      const toStore: studentSignupObject = {
        firstName,
        lastName,
        email,
        createdAt: new Date(),
        password,
        phoneNumber,
        studentId,
        gender,
        role: "student",
      };

      if (!email || !firstName || !lastName || !password) {
        return next(
          createCustomError("Name, Email and Password fields are required", 400)
        );
      }

      const existingStudent = await Student.findOne({ email, isActive: true });

      if (existingStudent) {
        return next(createCustomError("Student Already exists", 400));
      }

      const phoneNumberIsActive = await Student.findOne({
        phoneNumber,
        isActive: true,
      });

      if (phoneNumberIsActive) {
        return next(
          createCustomError("This phone number is already registered.", 400)
        );
      }

      const student: any = await Student.create(toStore);

      student.save();
      const data: any = { token: student.getJwtToken(), student };

      const response = sendSuccessApiResponse(
        "Student Registered Successfully!",
        data
      );
      res.status(200).cookie("token", data.token, options).send(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export const refreshToken: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      const message = "Unauthenticaded No Bearer";
      return next(createCustomError(message, 401));
    }

    let data: any;
    const token = authHeader.split(" ")[1];
    try {
      const payload: string | jwt.JwtPayload | any = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      console.log(payload);

      data = await getNewToken(payload);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const payload: any = jwt.decode(token, { complete: true }).payload;
        data = await getNewToken(payload);

        if (!data) {
          const message = "Authentication failed invalid JWT";
          return next(createCustomError(message, 401));
        }
      } else {
        const message = "Authentication failed invalid JWT";
        return next(createCustomError(message, 401));
      }
    }

    return res
      .status(200)
      .json(sendSuccessApiResponse("Refresh Token Generated", data, 200));
  }
);

const getNewToken = async (payload: any) => {
  const isUser = payload?.id ? true : false;
  console.log(isUser);

  // const isInfluencer = payload?.influencerId ? true : false;

  let data: any;
  if (isUser) {
    const user: any = await User.findOne({
      isActive: true,
      _id: payload.userId,
    });
    if (user) {
      data = { token: user.generateJWT() };
    }
  }
  return data;
};

export const login: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      password,
    }: {
      email: string;
      password: string;
    } = req.body;

    if (!(email && password)) {
      return next(
        createCustomError("Email and Password fields are required", 400)
      );
    }

    const userExists: any = await User.findOne(
      { email: email, isActive: true },
      ["firstName", "lastName", "phoneNumber", "email", "password", "role"]
    );

    if (userExists) {
      const isPasswordCorrect = await userExists.isValidatedPassword(
        password,
        userExists.password
      );

      if (!isPasswordCorrect) {
        return next(createCustomError("Incorrect Password", 401));
      }
      userExists.password = undefined;
      const data: any = { token: userExists.getJwtToken(), userExists };

      return res
        .cookie("token", data.token, options)
        .send(sendSuccessApiResponse("User LoggedIn Successfully!", data, 201));
    } else {
      return next(createCustomError("You're not registered in our app", 400));
    }
  }
);

export const studentLogin: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      password,
    }: {
      email: string;
      password: string;
    } = req.body;

    if (!(email && password)) {
      return next(
        createCustomError("Email and Password fields are required", 400)
      );
    }

    const studentExists: any = await Student.findOne(
      { email: email, isActive: true },
      ["firstName", "lastName", "phoneNumber", "email", "password"]
    );

    if (studentExists) {
      const isPasswordCorrect = await studentExists.isValidatedPassword(
        password,
        studentExists.password
      );

      if (!isPasswordCorrect) {
        return next(createCustomError("Incorrect Password", 401));
      }
      studentExists.password = undefined;
      const data: any = { token: studentExists.getJwtToken(), studentExists };

      return res
        .cookie("token", data.token, options)
        .send(
          sendSuccessApiResponse("Student LoggedIn Successfully!", data, 201)
        );
    } else {
      return next(createCustomError("You're not registered in our app", 400));
    }
  }
);

export const getUsers: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;

    const obj: any = {};

    if (userId) {
      obj._id = userId;
    }

    let users: Array<Record<string, any>> = [];
    try {
      users = await User.find(obj);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }

    return res.status(200).send(sendSuccessApiResponse("Users", users));
  }
);

export const getStudents: RequestHandler = bigPromise(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId }: { studentId?: string } = req.query;

    const obj: any = {};

    if (studentId) {
      obj._id = new mongoose.Types.ObjectId(studentId);
    }

    let students: Array<Record<string, any>> = [];
    try {
      students = await Student.find(obj);
    } catch (err) {
      console.log(err);
      return next(createCustomError("Internal Server Error", 501));
    }

    return res.status(200).send(sendSuccessApiResponse("Students", students));
  }
);

export const updateStudentDetails: RequestHandler = bigPromise(
  async (req, res, next) => {
    try {
      const { id }: { id?: string } = req.params;

      const {
        firstName,
        lastName,
        email,
        password,
        gender,
        phoneNumber,
        isActive,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: number;
        gender: string;
        isActive: boolean;
      } = req.body;

      let updateObj: studentUpdateObj = {};

      if (firstName) {
        updateObj.firstName = firstName;
      }

      if (lastName) {
        updateObj.lastName = lastName;
      }
      if (email) {
        updateObj.email = email;
      }
      if (password) {
        updateObj.password = password;
      }
      if (gender) {
        updateObj.gender = gender;
      }
      if (phoneNumber) {
        updateObj.phoneNumber = phoneNumber;
      }
      if (isActive) {
        updateObj.isActive = isActive;
      }

      const data = await Student.findOneAndUpdate(
        { _id: id },
        { $set: updateObj },
        { new: true }
      );

      const response = sendSuccessApiResponse(
        "Student Updated Successfully!",
        data
      );
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export const logout: RequestHandler = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});
