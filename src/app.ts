import compression from "compression";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import httpContext from "express-http-context";
import { connectDB } from "./config/db";
import notFound from "./errors/notFound";
import {
  generateRequestId,
  logRequest,
  logResponse,
} from "./middlewares/commonMiddleware";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import router from "./routes";
import { spawn } from "child_process";

const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // allowedHeaders: ["Content-Type", "Accept"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Load environment variables
// dotenv.config({ path: `.env.${process.env.NODE_ENV.toLowerCase()}` });
dotenv.config({ path: `.env.${"dev"}` });

// Create Express server
const app = express();

// Connecting Database
connectDB();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// CORS configuration
app.use(cors(corsOptions));
app.options("*", cors);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: {
        _id: string;
        userId: string;
        role: string;
      };
    }
  }
}

// Set HTTP context
app.use(httpContext.middleware);
app.get("/", async (req, res) => {
  return res.status(200).json({
    sucess: true,
    message: "Success boss",
  });
});

app.post("/getPdfParsedData", async (req, res) => {
  const pdfUrl =
    "https://res.cloudinary.com/dzxtkbwbk/image/upload/v1738696900/images/ds6qsjsshtw8gaqb8amm.pdf"; // Replace with actual PDF URL

  // const {pdfUrl} = req.body;
  const pythonProcess = spawn("python3", ["pdf_parser.py", pdfUrl]);

  let jsonData = "";

  pythonProcess.stdout.on("data", (data) => {
    jsonData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    return res.status(501).json({
      success: false,
      message: `Internal Server Error + ${data}`,
    });
  });

  pythonProcess.on("close", (code) => {
    try {
      const parsedData = JSON.parse(jsonData);
      console.log(parsedData);
      if (parsedData.error) {
        console.error(`Error: ${parsedData.error}`);
      } else {
        return res.status(200).json({
          success: true,
          data: parsedData,
          message: "Sucessfully Parsed pdf",
        });
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return res.status(501).json({
        success: false,
        message: `Internal Server Error + ${error}`,
      });
    }
  });
});

app.use(generateRequestId);

// Log all the requests and response.
app.use(logRequest);
app.use(logResponse);

app.use(router);

// Error handling
app.use(notFound);
app.use(errorHandlerMiddleware);

export default app;
