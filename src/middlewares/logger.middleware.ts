import logger from "@src/config/winston";
import { NextFunction, Request, Response } from "express";

const reqLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(`[ ${req.method} ] ${req.originalUrl}`);
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `[ ${req.method} ] ${req.originalUrl} - status: ${res.statusCode} - ${duration}ms`,
    );
  });
  next();
};

export default reqLogger;
