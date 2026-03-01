import winston from "winston";
import config from ".";

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `[ ${info.timestamp} ] [ ${info.level} ]: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({
    //   filename: "./logs/error.log",
    //   level: "error",
    // }), // for production
    // new winston.transports.File({ filename: "./logs/combined.log" }), // for production
  ],
});

export default logger;
