// import httpContext from "express-http-context";
// import winston from "winston";
// import path from "path";
// import fs from "fs";
// import { PROD_ENVIRONMENT } from "../constants/constants";

// const environment = process.env.NODE_ENV;
// const isProd = PROD_ENVIRONMENT.includes(environment);

// const level = () => {
//   return isProd ? "info" : "debug";
// };

// const logsDir = path.join(process.cwd(), "logs");

// console.log(logsDir);
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir, { recursive: true });
// }

// const defaultFormat = [
//   winston.format.splat(),
//   winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
//   // winston.format.label({ label: path.basename(require.main.filename) }),
//   winston.format.metadata({
//     fillExcept: ["timestamp", "level", "label", "message"],
//   }),
//   winston.format.printf((log) => {
//     const { timestamp, level, label, message, metadata, stack } = log;
//     const metaData =
//       Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : "";
//     const stackMessage = stack ? `\n${stack}` : "";
//     const requestId = httpContext.get("requestId");
//     const requestLog = requestId ? ` (requestId: ${requestId})` : "";
//     // return `[${timestamp}] [${level}] [${label}]: ${message} ${metaData}${stackMessage}`;
//     return `[${timestamp}] [${level}]:${requestLog} ${message} ${metaData}${stackMessage}`;
//   }),
// ];

// const fileFormat = winston.format.combine(...defaultFormat);
// const consoleFormat = winston.format.combine(
//   winston.format.colorize({ all: true }),
//   ...defaultFormat
// );

// const transports = [
//   new winston.transports.Console({ format: consoleFormat }),
//   new winston.transports.File({
//     filename: path.join(logsDir, "error.log"),
//     level: "error",
//     format: fileFormat,
//   }),
//   new winston.transports.File({
//     filename: path.join(logsDir, "app.log"),
//     format: fileFormat,
//   }),
// ];

// const exceptionHandlers = [
//   new winston.transports.File({
//     filename: path.join(logsDir, "exceptions.log"),
//     format: fileFormat,
//   }),
// ];

// const options: winston.LoggerOptions = {
//   level: level(),
//   transports: transports,
//   exceptionHandlers: exceptionHandlers,
// };

// const logger = winston.createLogger(options);

// if (!isProd) {
//   logger.debug("Logging initialized at debug level");
// }

// export default logger;
