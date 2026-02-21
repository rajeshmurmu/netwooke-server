import { AppError, ZodValidationError } from "@src/utils/error";
import config from "@src/config";
import { Request, Response, NextFunction } from "express";
import logger from "@src/config/winston";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  if (err instanceof ZodValidationError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
      errors: err.fieldErros,
    });
  }

  console.error("UNHANDLED ERROR: ", err);

  if (config.NODE_ENV !== "production") {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
    success: false,
  });
}
